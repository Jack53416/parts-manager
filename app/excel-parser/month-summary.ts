import * as fs from 'fs';
import * as excelJs from 'exceljs';
import * as dayjs from 'dayjs';
import { partSummaryTemplate, partSummaryPath, monthSummaryColumns, statisticsPath } from './config';



export async function summarizeMonth(date: Date) {
    date = new Date(1680307200000); //01.04.2023
    const fileList = fs.readdirSync(partSummaryPath);
    console.log(dayjs(date).format('MM.YYYY'));
    let summaryWorkbook = new excelJs.Workbook();

    //console.log(fileList);
    if (fileList.some(file => file.includes(dayjs(date).format('YYYY')))) {
        console.log('read');
        await summaryWorkbook.xlsx.readFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);
    } else {
        summaryWorkbook = await createSummary(date, summaryWorkbook);
    }

    await saveStatistic(summaryWorkbook, date);

}

async function saveStatistic(summaryWorkbook: excelJs.Workbook, date: Date) {
    const worksheetseparat = summaryWorkbook.getWorksheet('Arkusz1');
    const partStatisticFiles = fs.readdirSync(statisticsPath);
    const partWorkbook = new excelJs.Workbook();

   //const partsList = partStatisticFiles.map(async partFile => {
   //    console.log(`${statisticsPath}/${partFile}`);
   //    await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFile}`);
   //    return await getPartData(partWorkbook, date);
   //    //getPartData(partFile);
   //});

    const partsList = await Promise.all(partStatisticFiles.map(async partFile =>{
        console.log(`${statisticsPath}/${partFile}`);
        await partWorkbook.xlsx.readFile(`${statisticsPath}/${partFile}`);
        await getPartData(partWorkbook, date);
    }));
}

async function getPartData(partFile: excelJs.Workbook, date: Date) {
    //console.log(partFile);
    // name, number, tool, prod, scrap, wady
    const monthWorksheet = partFile.worksheets[date.getMonth()+1];
    console.log(monthWorksheet.getCell('B38').result);
    return 10;
};

async function createSummary(date: Date, summaryWorkbook: excelJs.Workbook): Promise<excelJs.Workbook> {
    console.log(`create summary for ${dayjs(date).format('MM.YYYY')}`);
    await summaryWorkbook.xlsx.readFile(`${partSummaryTemplate}`);
    const dateTemplate = dayjs(date).subtract(date.getMonth()-1, 'month').format('MM.DD.YYYY');

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const summaryWorksheet = summaryWorkbook.getWorksheet('Empty');
    summaryWorksheet.getCell(`${monthSummaryColumns.month}${2}`).value = new Date(Date.parse(dateTemplate));

    await summaryWorkbook.xlsx.writeFile(`${partSummaryPath}/podsumowanie ${date.getFullYear()}.xlsx`);

    return summaryWorkbook;
}
