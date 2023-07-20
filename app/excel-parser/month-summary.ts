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
  partSummaryColumns,
  partStatisticScrapCategoriesRow,
  partStatisticNameCell,
  partAssemblyStatisticsPath
} from './config';


export async function summarizeMonth(date: Date) {
    date = new Date(1685996260000); //05.06.2023 - date for testing
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
    await saveAssemblyStatistic(summaryWorkbook, date);
}

async function saveAssemblyStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const partStatisticFiles = fs.readdirSync(partAssemblyStatisticsPath);
    const partWorkbook = new excelJs.Workbook();
    const monthIndex = +dayjs(date).month();

    const partsList = await Promise.all(partStatisticFiles.map(async partFileName =>{
        await partWorkbook.xlsx.readFile(`${partAssemblyStatisticsPath}/${partFileName}`);
        return await getAssemblyPartData(partWorkbook, date, partFileName);
    }));

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
            if (row.getCell(monthSummaryColumns.partNr).value === partStatisticsData.partNr) {
                partRow = row.number;
                break;
            }
        }
        // if part not in table
        if (!partRow) {
            addNewPartTable(partStatisticsData, summaryWorkbook, summaryWorksheet, lastSummaryRow);
            partRow = lastSummaryRow+1;
        }
        //insert data

        Object.entries(partStatisticsData).forEach(([key, v]) => {
            summaryWorksheet.getCell(`${monthSummaryColumns[key]}${partRow+monthIndex}`).value = v;
        });
    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
}

async function getAssemblyPartData(
    partFile: excelJs.Workbook,
    date: Date,
    partHeadline: string
  ): Promise<{
    totalProduction: number;
    totalScrap: number;
    partNr: string;
  }> {

    const monthWorksheet = partFile.worksheets[date.getMonth()];
    const producitonData = await getProductionData(monthWorksheet);

    return {
      totalProduction: producitonData.productionSum,
      totalScrap: producitonData.scrapSum,
      partNr: partHeadline,
    };
  };

async function saveStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const partStatisticFiles = fs.readdirSync(statisticsPath);
    const partWorkbook = new excelJs.Workbook();
    const monthIndex = +dayjs(date).month();

    //get part data
    const partsList = await Promise.all(partStatisticFiles.map(async partFileName =>{
        await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFileName}`);
        return await getPartData(partWorkbook, date, partFileName);
    }));

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
            if ((row.getCell(monthSummaryColumns.partNr).value === partStatisticsData.partNr) &&
            (row.getCell(monthSummaryColumns.tool).value === partStatisticsData.tool)
            ) {
                partRow = row.number;
                break;
            }
        }
        // if part not in table
        if (!partRow) {
            addNewPartTable(partStatisticsData, summaryWorkbook, summaryWorksheet, lastSummaryRow);
            partRow = lastSummaryRow+1;
        }
        //insert data

        Object.entries(partStatisticsData).forEach(([key, v]) => {
            summaryWorksheet.getCell(`${monthSummaryColumns[key]}${partRow+monthIndex}`).value = v;
        });
    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
}

function addNewPartTable(
    partStatisticsData,
    summaryWorkbook: excelJs.Workbook,
    summaryWorksheet: excelJs.Worksheet,
    lastSummaryRow: number
    ) {
    const templateWorksheet = summaryWorkbook.getWorksheet('Empty');
    const emptyTable: excelJs.Row[] = templateWorksheet.getRows(1, 13);
    console.log(lastSummaryRow);
    // copy each cell in table
    emptyTable.forEach(row => {
        row.getCell(monthSummaryColumns.partNr).value = partStatisticsData.partNr;
        row.getCell(monthSummaryColumns.tool).value = partStatisticsData.tool;
        row.getCell(monthSummaryColumns.scrapPercent).value = {
            formula: `${monthSummaryColumns.totalScrap}${row.number+lastSummaryRow}/`
              + `${monthSummaryColumns.totalProduction}${row.number+lastSummaryRow}`,
            date1904: false
        };
        row.getCell(monthSummaryColumns.totalScrapCost).value = {
            formula: `${monthSummaryColumns.totalScrap}${row.number+lastSummaryRow}*`
              + `$${monthSummaryColumns.partCost}$${lastSummaryRow+1}`,
            date1904: false
        };
        row.getCell(monthSummaryColumns.ppm).value = {
            formula: `(${monthSummaryColumns.totalScrap}${row.number+lastSummaryRow}/`
              + `${monthSummaryColumns.totalProduction}${row.number+lastSummaryRow})*1000000`,
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
        formula: `SUM(${monthSummaryColumns.totalProduction}${lastSummaryRow+1}:`
            + `${monthSummaryColumns.totalProduction}${lastSummaryRow+12})`,
        result: undefined,
        date1904: false
    };
    summaryWorksheet.getCell(`${monthSummaryColumns.totalScrap}${lastSummaryRow+13}`).value = {
        formula: `SUM(${monthSummaryColumns.totalScrap}${lastSummaryRow+1}:`
            + `${monthSummaryColumns.totalScrap}${lastSummaryRow+12})`,
        date1904: false
    };
}

async function getPartData(
  partFile: excelJs.Workbook,
  date: Date,
  partHeadline: string
): Promise<{
  totalProduction: number;
  totalScrap: number;
  partNr: string;
  partName: excelJs.CellValue;
  tool: string;
  scrapNames: string;
}> {

  const monthWorksheet = partFile.worksheets[date.getMonth()];
  const producitonData = await getProductionData(monthWorksheet);
  const partHeadlineData = getDataFromPartHeadline(partHeadline);
  const partName = monthWorksheet.getCell(partStatisticNameCell).value;

  return {
    totalProduction: producitonData.productionSum,
    totalScrap: producitonData.scrapSum,
    partNr: partHeadlineData.partNr,
    partName,
    tool: partHeadlineData.tool,
    scrapNames: Array.from(producitonData.scrapCategories).slice(0, 3).toString()
  };
};

function getDataFromPartHeadline(partHeadline: string): {machine: string; partNr: string; tool: string} {
    //SG-XXX_PARTNR_TOOL -YY
    const headLineArray = partHeadline.split('_');

    return {machine: headLineArray[0], partNr: headLineArray[1], tool: headLineArray[2].slice(4, -8)};
}

async function getProductionData(partSheet: excelJs.Worksheet): Promise<{
    productionSum: number;
    scrapSum: number;
    scrapCategories: Set<string>;
}> {
    let productionSum = 0;
    let scrapSum = 0;
    const scrapCategoriesArray = [];

    for (const rowNr of partFileRowsRange) {
        const currentCell = partSheet.getCell(`${partStatisticColumns.totalPartsProduced}${rowNr}`);
        // dont count trials (yellow lines)
        if (currentCell.fill.type === 'pattern' && currentCell.fill.bgColor) {
            continue;
        }

        if (typeof(currentCell.value) === 'number') {
            productionSum = productionSum + +currentCell.value;
        } else if (!(currentCell.value === null)) {
            productionSum = productionSum + +currentCell.result;
        }

        const scrapData = await parseScrapRow(partSheet, rowNr);

        scrapSum = scrapSum + scrapData.rowScrapSum;
        scrapCategoriesArray.push(...scrapData.scrapCategories);
    }

    const scrapCategories = new Set(scrapCategoriesArray);
    return {productionSum, scrapSum, scrapCategories};
}

async function parseScrapRow(partSheet: excelJs.Worksheet, rowNr: number): Promise<{rowScrapSum: number; scrapCategories: string[]}> {
    let rowScrapSum = 0;
    const scrapCategories = [];

    partSummaryColumns.map(column => {
        const scrapCell = partSheet.getCell(`${column}${rowNr}`);

        if (typeof(scrapCell.value) === 'number') {
            rowScrapSum = rowScrapSum + +scrapCell.value;
        } else if (!(scrapCell.value === null)) {
            rowScrapSum = rowScrapSum + +scrapCell.result;
        }

        scrapCategories.push(partSheet.getCell(`${column}${partStatisticScrapCategoriesRow}`).value.toString());
    });

    return {rowScrapSum, scrapCategories};
}

async function createSummary(date: Date, summaryWorkbook: excelJs.Workbook): Promise<excelJs.Workbook> {
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
