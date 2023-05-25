import * as fs from 'fs';
import * as excelJs from 'exceljs';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import {
  partSummaryTemplate,
  partSummaryPath,
  monthSummaryColumns,
  statisticsPath,
  partFileRowsRange,
  partStatisticColumns,
  partSummaryColumnsLetters,
  partStatisticScrapCategoriesRow
} from './config';



export async function summarizeMonth(date: Date) {
    date = new Date(1680307200000); //01.04.2023
    const fileList = fs.readdirSync(partSummaryPath);
    console.log(dayjs(date).format('MM.YYYY'));
    let summaryWorkbook = new excelJs.Workbook();

    //console.log(fileList);
    if (fileList.some(file => file.includes(dayjs(date).format('YYYY')))) {
        await summaryWorkbook.xlsx.readFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
    } else {
        summaryWorkbook = await createSummary(date, summaryWorkbook);
    }

    await saveStatistic(summaryWorkbook, date);
}

async function saveStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const partStatisticFiles = fs.readdirSync(statisticsPath);
    const partWorkbook = new excelJs.Workbook();
    const monthIndex = +dayjs(date).month();

    //get part data
    const partsList = await Promise.all(partStatisticFiles.map(async partFileName =>{
        await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFileName}`);
        return await getPartData(partWorkbook, date, partFileName);
    }));

    //console.log(partsList);

    //save to template
    const summaryWorksheet = summaryWorkbook.getWorksheet('Arkusz1');
    const rows = summaryWorksheet.getRows(1, summaryWorksheet.rowCount+1);

    let lastSummaryRow = summaryWorksheet.rowCount;

    partsList.map(partStatisticsData => {
        //check if exist in stat
        console.log(partStatisticsData.partNr);
        let partRow: number;

        lastSummaryRow = summaryWorksheet.rowCount;

        // find part number
        for (const row of rows) { //row -> 1 based
            //console.log(row.getCell('C').value, 't');
            if (row.getCell('C').value === partStatisticsData.partNr) {
                partRow = row.number;
                console.log(row.getCell('C').value, row.number, 'aaa');
                break;
            }
        }
        // if part not in table
        if (!partRow) {
            const templateWorksheet = summaryWorkbook.getWorksheet('Empty');
            const emptyTable: excelJs.Row[] = templateWorksheet.getRows(1, 13);
            console.log(lastSummaryRow);
            // copy each cell in table
            emptyTable.forEach(row => {
                row.getCell(monthSummaryColumns.partNr).value = partStatisticsData.partNr;
                row.getCell(monthSummaryColumns.tool).value = partStatisticsData.tool;
                row.getCell(monthSummaryColumns.scrapPercent).value = {
                    formula: `${monthSummaryColumns.totalScrap}${row.number+lastSummaryRow}/
                        ${monthSummaryColumns.totalProduction}${row.number+lastSummaryRow}`,
                    date1904: false
                };
                row.getCell(monthSummaryColumns.totalScrapCost).value = {
                    formula: `${monthSummaryColumns.totalScrap}${row.number+lastSummaryRow}*
                        $${monthSummaryColumns.partCost}$${lastSummaryRow+1}`,
                    date1904: false
                };
                row.getCell(monthSummaryColumns.ppm).value = {
                    formula: `(${monthSummaryColumns.totalScrap}${row.number+lastSummaryRow}/
                        ${monthSummaryColumns.totalProduction}${row.number+lastSummaryRow})*1000000`,
                    date1904: false
                };
                row.eachCell({ includeEmpty: true }, cell => {
                    const targetCell = summaryWorksheet.getCell(cell.address);
                    const newCell = summaryWorksheet.getCell(+targetCell.row + lastSummaryRow, targetCell.col);
                    newCell.style = cell.style;
                    newCell.value = cell.value;
                });
            });
            summaryWorksheet.getCell(`${monthSummaryColumns.totalProduction}${lastSummaryRow+13}`).value = {
                formula: `SUM(${monthSummaryColumns.totalProduction}${lastSummaryRow+1}:
                    ${monthSummaryColumns.totalProduction}${lastSummaryRow+12})`,
                result: undefined,
                date1904: false
            };
            summaryWorksheet.getCell(`${monthSummaryColumns.totalScrap}${lastSummaryRow+13}`).value = {
                formula: `SUM(${monthSummaryColumns.totalScrap}${lastSummaryRow+1}:
                    ${monthSummaryColumns.totalScrap}${lastSummaryRow+12})`,
                date1904: false
            };

        partRow = lastSummaryRow+1;
        }
        //insert data

        Object.entries(partStatisticsData).forEach(([key, v]) => {
            summaryWorksheet.getCell(`${monthSummaryColumns[key]}${partRow+monthIndex}`).value = v;
        });

    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
}

async function getPartData(
  partFile: excelJs.Workbook,
  date: Date,
  partHeadline: string
): Promise<{
  totalProduction: number;
  totalScrap: number;
  partNr: string;
  //machine: string;
  tool: string;
  scrapNames: string;
}> {

  const monthWorksheet = partFile.worksheets[date.getMonth()];
  const producitonData = await getProductionSum(monthWorksheet);
  const partHeadlineData = getDataFromPartHeadline(partHeadline);

  return {
    totalProduction: producitonData.productionSum,
    totalScrap: producitonData.scrapSum,
    partNr: partHeadlineData.partNr,
    //machine: partHeadlineData.machine,
    tool: partHeadlineData.tool,
    scrapNames: Array.from(producitonData.scrapCategories).slice(0, 3).toString()
  };
};

function getDataFromPartHeadline(partHeadline: string): {machine: string; partNr: string; tool: string} {
    const headLineArray = partHeadline.split('_');

    return {machine: headLineArray[0], partNr: headLineArray[1], tool: headLineArray[2].slice(4, -4)};
}

async function getProductionSum(
    partSheet: excelJs.Worksheet
): Promise<{
    productionSum: number;
    scrapSum: number;
    scrapCategories: Set<string>;
}> {

    let productionSum = 0;
    let scrapSum = 0;
    const scrapCategoriesArray = [];

    for (const rowNr of partFileRowsRange) {
        productionSum = productionSum + +partSheet.getCell(`${partStatisticColumns.totalPartsProduced}${rowNr}`).value;
        const scrapData = await parseScrapRow(partSheet, rowNr);

        scrapSum = scrapSum + scrapData.rowScrapSum;
        scrapCategoriesArray.push(...scrapData.scrapCategoriesArray);
    }

    const scrapCategories = new Set(scrapCategoriesArray);
    return {productionSum, scrapSum, scrapCategories};
}

async function parseScrapRow(partSheet: excelJs.Worksheet, rowNr: number): Promise<{rowScrapSum: number; scrapCategoriesArray: string[]}> {
    let rowScrapSum = 0;
    const scrapCategoriesArray = [];

    partSummaryColumnsLetters.map(column => {
        const cellScrapValue = +partSheet.getCell(`${column}${rowNr}`).value;

        rowScrapSum = rowScrapSum + cellScrapValue;
        if (cellScrapValue > 0) {
            scrapCategoriesArray.push(partSheet.getCell(`${column}${partStatisticScrapCategoriesRow}`).value.toString());
        };
    });

    return {rowScrapSum, scrapCategoriesArray};
}

async function createSummary(date: Date, summaryWorkbook: excelJs.Workbook): Promise<excelJs.Workbook> {
    console.log(`create summary for ${dayjs(date).format('YYYY')}`);
    await summaryWorkbook.xlsx.readFile(`${partSummaryTemplate}`);

    const summaryWorksheet = summaryWorkbook.getWorksheet('Empty');
    const dates = [];

    for (let i = 1; i < 13; i++) {
        dates.push(dayjs(`${i}/01/${dayjs(date).format('YYYY')}`).utcOffset(0, true).toDate());
    }

    dates.forEach((month, i) => {
        summaryWorksheet.getCell(`E${i+1}`).value = month;
    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);

    return summaryWorkbook;
}
