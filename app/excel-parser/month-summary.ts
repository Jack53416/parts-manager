import * as fs from 'fs';
import * as excelJs from 'exceljs';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import {
  partSummaryTemplate,
  partSummaryPath,
  monthSummaryColumnsLetters,
  statisticsPath,
  partFileRowsRange,
  partStatisticColumnsLetters,
  partSummaryColumnsLetters,
  partStatisticScrapCategoriesRow,
  partStatisticNameCell,
  partAssemblyStatisticsPath,
  partSummaryMainSheetName,
  partSummaryEmptySheetName,
  partStatisticNrCell
} from './config';


export async function summarizeMonth(date: Date) {
    let summaryWorkbook = new excelJs.Workbook();

    // Check if there is a summary file in folder
    const fileList = fs.readdirSync(partSummaryPath);
    if (fileList.some(file => file.includes(dayjs(date).format('YYYY')))) {
        await summaryWorkbook.xlsx.readFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
    } else {
        summaryWorkbook = await createSummary(date, summaryWorkbook);
    }

    await saveInjectionStatistic(summaryWorkbook, date);
    await saveAssemblyStatistic(summaryWorkbook, date);
}

async function saveAssemblyStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const asemblyStatisticFiles = fs.readdirSync(partAssemblyStatisticsPath);
    const partWorkbook = new excelJs.Workbook();
    const monthIndex = +dayjs(date).month();

    const partsList = await Promise.all(
        asemblyStatisticFiles.map(async partFileName => {
            await partWorkbook.xlsx.readFile(
                `${partAssemblyStatisticsPath}/${partFileName}`
            );
            return await getAssemblyPartData(partWorkbook, date, partFileName);
        })
    );

    const summaryWorksheet = summaryWorkbook.getWorksheet(partSummaryMainSheetName);
    const summaryRows = summaryWorksheet.getRows(1, summaryWorksheet.rowCount);

    let lastSummaryRow: number;
    let partRowNumber: number;  // first row  part table

    partsList.map(partStatisticsData => {
        lastSummaryRow = summaryWorksheet.rowCount;

        // find part in statistic
        for (const row of summaryRows) { //row -> 1 based
            if (row.getCell(monthSummaryColumnsLetters.partNr).value === partStatisticsData.partNr) {
                partRowNumber = row.number;
                break;
            }
        }

        // if part not in table add it
        if (!partRowNumber) {
            addNewPartTable(partStatisticsData, summaryWorkbook, summaryWorksheet, lastSummaryRow);
            partRowNumber = lastSummaryRow+1;
        }

        // insert data
        Object.entries(partStatisticsData).forEach(([key, value]) => {
            summaryWorksheet.getCell(`${monthSummaryColumnsLetters[key]}${partRowNumber+monthIndex}`).value = value;
        });
    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
}

async function getAssemblyPartData(partStatisticsFile: excelJs.Workbook, date: Date, partHeadline: string):
    Promise<{totalProduction: number; totalScrap: number; partNr: string}> {

    const monthWorksheet = partStatisticsFile.worksheets[date.getMonth()];
    const producitonData = await getProductionData(monthWorksheet);

    return {
      totalProduction: producitonData.productionSum,
      totalScrap: producitonData.scrapSum,
      partNr: partHeadline,
    };
  };


async function saveStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const partStatisticFiles = fs.readdirSync(statisticsPath); //inny path -> docelowo wszystko w tej samej lokalizacji
    const partWorkbook = new excelJs.Workbook();
    const monthIndex = +dayjs(date).month();

    //get part data
    const partsList = await Promise.all(partStatisticFiles.map(async partFileName =>{
        await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFileName}`);
        return await getPartData(partWorkbook, date); //inny get part
    }));

    //save to template
    const summaryWorksheet = summaryWorkbook.getWorksheet(partSummaryMainSheetName);
    const summaryRows = summaryWorksheet.getRows(1, summaryWorksheet.rowCount);

    let lastSummaryRow = summaryWorksheet.rowCount;

    partsList.map(partStatisticsData => {
        //check if exist in stat
        let partRow: number;

        lastSummaryRow = summaryWorksheet.rowCount;

        // find part number
        for (const row of summaryRows) { //row -> 1 based
            if ((row.getCell(monthSummaryColumnsLetters.partNr).value === partStatisticsData.partNr) &&
            (row.getCell(monthSummaryColumnsLetters.tool).value === partStatisticsData.tool) // tylko nr czesci
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
        Object.entries(partStatisticsData).forEach(([key, value]) => {
            summaryWorksheet.getCell(`${monthSummaryColumnsLetters[key]}${partRow+monthIndex}`).value = value;
        });
    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
}
async function saveInjectionStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const partStatisticFiles = fs.readdirSync(statisticsPath);
    const partWorkbook = new excelJs.Workbook();
    const monthIndex = +dayjs(date).month();

    //get part data
    const partsList = await Promise.all(partStatisticFiles.map(async partFileName =>{
        await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFileName}`);
        return await getPartData(partWorkbook, date);
    }));

    //save to template
    const summaryWorksheet = summaryWorkbook.getWorksheet(partSummaryMainSheetName);
    const summaryRows = summaryWorksheet.getRows(1, summaryWorksheet.rowCount);

    let lastSummaryRow = summaryWorksheet.rowCount;

    partsList.map(partStatisticsData => {
        //check if exist in stat
        let partRow: number;

        lastSummaryRow = summaryWorksheet.rowCount;

        // find part number
        for (const row of summaryRows) { //row -> 1 based
            if ((row.getCell(monthSummaryColumnsLetters.partNr).value === partStatisticsData.partNr) &&
            (row.getCell(monthSummaryColumnsLetters.tool).value === partStatisticsData.tool)
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
        Object.entries(partStatisticsData).forEach(([key, value]) => {
            summaryWorksheet.getCell(`${monthSummaryColumnsLetters[key]}${partRow+monthIndex}`).value = value;
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
    const templateWorksheet = summaryWorkbook.getWorksheet(partSummaryEmptySheetName);
    const emptyTable: excelJs.Row[] = templateWorksheet.getRows(1, 13);

    // copy each cell in table
    emptyTable.forEach(row => {
        row.getCell(monthSummaryColumnsLetters.partNr).value = partStatisticsData.partNr;
        row.getCell(monthSummaryColumnsLetters.tool).value = partStatisticsData.tool;
        row.getCell(monthSummaryColumnsLetters.scrapPercent).value = {
            formula: `${monthSummaryColumnsLetters.totalScrap}${row.number+lastSummaryRow}/`
              + `${monthSummaryColumnsLetters.totalProduction}${row.number+lastSummaryRow}`,
            date1904: false
        };
        row.getCell(monthSummaryColumnsLetters.totalScrapCost).value = {
            formula: `${monthSummaryColumnsLetters.totalScrap}${row.number+lastSummaryRow}*`
              + `$${monthSummaryColumnsLetters.partCost}$${lastSummaryRow+1}`,
            date1904: false
        };
        row.getCell(monthSummaryColumnsLetters.ppm).value = {
            formula: `(${monthSummaryColumnsLetters.totalScrap}${row.number+lastSummaryRow}/`
              + `${monthSummaryColumnsLetters.totalProduction}${row.number+lastSummaryRow})*1000000`,
            date1904: false
        };
        row.eachCell({ includeEmpty: true }, cell => {
            const targetCell = summaryWorksheet.getCell(cell.address);
            const newCell = summaryWorksheet.getCell(+targetCell.row + lastSummaryRow, targetCell.col);
            newCell.style = cell.style;
            newCell.value = cell.value;
        });
    });
    summaryWorksheet.getCell(`${monthSummaryColumnsLetters.totalProduction}${lastSummaryRow+13}`).value = {
        formula: `SUM(${monthSummaryColumnsLetters.totalProduction}${lastSummaryRow+1}:`
            + `${monthSummaryColumnsLetters.totalProduction}${lastSummaryRow+12})`,
        result: undefined,
        date1904: false
    };
    summaryWorksheet.getCell(`${monthSummaryColumnsLetters.totalScrap}${lastSummaryRow+13}`).value = {
        formula: `SUM(${monthSummaryColumnsLetters.totalScrap}${lastSummaryRow+1}:`
            + `${monthSummaryColumnsLetters.totalScrap}${lastSummaryRow+12})`,
        date1904: false
    };
}

async function getPartData(
  partFile: excelJs.Workbook,
  date: Date,
): Promise<{
  machine?: string;
  totalProduction: number; //
  totalScrap: number; //
  partNr: string; //
  partName?: excelJs.CellValue;
  tool?: string;
  scrapNames?: string;
}> {

    //SG-XXX_PARTNR_TOOL -YY
    const partHeadline = partFile.worksheets[1].getCell(partStatisticNrCell).value.toString();
    const headLineArray = partHeadline.split('_'); // nie ma tego w asembly

    // production data
    let productionSum = 0;
    let scrapSum = 0;
    const scrapCategoriesArray = [];
    const monthWorksheet = partFile.worksheets[date.getMonth()];
    const partName = monthWorksheet.getCell(partStatisticNameCell).value;

    for (const rowNr of partFileRowsRange) {
        const currentCell = monthWorksheet.getCell(`${partStatisticColumnsLetters.totalPartsProduced}${rowNr}`);
        // dont count trials (yellow rows)
        if (currentCell.fill.type === 'pattern' && currentCell.fill.bgColor) {
            continue;
        }

        if (typeof(currentCell.value) === 'number') {
            productionSum = productionSum + +currentCell.value;
        } else if (!(currentCell.value === null)) {
            productionSum = productionSum + +currentCell.result;
        }

        const scrapData = await parseScrapRow(monthWorksheet, rowNr);

        scrapSum = scrapSum + scrapData.rowScrapSum;
        scrapCategoriesArray.push(...scrapData.scrapCategories);
    }

    const scrapCategories = new Set(scrapCategoriesArray);

  return {
    machine: headLineArray[0],
    partNr: headLineArray[1],
    tool: headLineArray[2].slice(4, -8),
    totalProduction: productionSum,
    totalScrap: scrapSum,
    partName,
    scrapNames: Array.from(scrapCategories).slice(0, 3).toString()
  };
};

async function getProductionData(partSheet: excelJs.Worksheet): Promise<{ // do wyjebania
    productionSum: number;
    scrapSum: number;
    scrapCategories: Set<string>;
}> {
    let productionSum = 0;
    let scrapSum = 0;
    const scrapCategoriesArray = [];

    for (const rowNr of partFileRowsRange) {
        const currentCell = partSheet.getCell(`${partStatisticColumnsLetters.totalPartsProduced}${rowNr}`);
        // dont count trials (yellow rows)
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

    partSummaryColumnsLetters.map(column => {
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

    const summaryWorksheet = summaryWorkbook.getWorksheet(partSummaryEmptySheetName);

    //generate 12 months
    const dates = [];
    for (let i = 1; i < 13; i++) {
        dates.push(dayjs(`${i}/01/${dayjs(date).format('YYYY')}`).utcOffset(0, true).toDate());
    }

    dates.forEach((month, i) => {
        summaryWorksheet.getCell(`${monthSummaryColumnsLetters.month}${i+1}`).value = month;
    });

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);

    return summaryWorkbook;
}
