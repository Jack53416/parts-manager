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

    //get part data
    const partsList = await Promise.all(partStatisticFiles.map(async partFileName =>{
        await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFileName}`);
        return await getPartData(partWorkbook, date, partFileName);
    }));

    //console.log(partsList);

    //save to template
    const summaryWorksheet = summaryWorkbook.getWorksheet('Arkusz1');
    partsList.map(partStatisticsData => {
        //check if exist in stat
        console.log(summaryWorksheet.rowCount);
    });
}

async function getPartData(
  partFile: excelJs.Workbook,
  date: Date,
  partHeadline: string
): Promise<{
  productionSum: number;
  scrapSum: number;
  partName: string;
  machine: string;
  tool: string;
}> {

  const monthWorksheet = partFile.worksheets[date.getMonth()];
  const producitonData = await getProductionSum(monthWorksheet);
  const partHeadlineData = getDataFromPartHeadline(partHeadline);

  return {
    productionSum: producitonData.productionSum,
    scrapSum: producitonData.scrapSum,
    partName: partHeadlineData.name,
    machine: partHeadlineData.machine,
    tool: partHeadlineData.tool,
  };
};

function getDataFromPartHeadline(partHeadline: string): {machine: string; name: string; tool: string} {
    const headLineArray = partHeadline.split('_');

    return {machine: headLineArray[0], name: headLineArray[1], tool: headLineArray[2].slice(4, -4)};
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
    //const dateTemplate = dayjs(date).subtract(date.getMonth()-1, 'month').format('MM.DD.YYYY');
    const firstDayOfYear = dayjs(date).utcOffset(0).startOf('year').toDate();

    const summaryWorksheet = summaryWorkbook.getWorksheet('Empty');
    summaryWorksheet.getCell(`${monthSummaryColumns.month}${2}`).value = firstDayOfYear;

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);

    return summaryWorkbook;
}
