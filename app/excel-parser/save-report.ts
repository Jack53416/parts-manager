import { statisticsPath, partStatisticTemplatePath, partStatisticColumns, firstRowPartStatistic, partStatisticNameCell } from './config';
import * as fs from 'fs';
import * as excelJs from 'exceljs';

export async function saveParts(parts: {[key: string]: {[key: string]: string}}[], reportDate: Date): Promise<string> {
  const fileList = fs.readdirSync(statisticsPath);
  const yearShort = reportDate.getFullYear().toString().substring(2);

  for (const part of parts) {
    const fileName = `${part.machine.content}_${part.articleNo.content.replace('/', '_')}_wkz ${part.tool.content} -${yearShort}`;

    if (!(fileList.includes(fileName + '.xlsx'))) {
      await createPartWorkbook(fileName, yearShort);
    }
    await savePartWoorkbook(part, fileName, reportDate);
  }
  return 'done';
}

async function createPartWorkbook(fileName: string, yearShort: string) {
  const partTemplate = new excelJs.Workbook();
  await partTemplate.xlsx.readFile(partStatisticTemplatePath);

  const firstSheet = partTemplate.worksheets[0];
  firstSheet.getCell(partStatisticNameCell).value = fileName;

  for (const sheet of partTemplate.worksheets.slice(1)) {
    sheet.name = `${sheet.name} ${yearShort}`;
    sheet.getCell(partStatisticNameCell).value = {formula: `=${firstSheet.name}!${partStatisticNameCell}`, date1904: false};
  }

  await partTemplate.xlsx.writeFile(`${statisticsPath}/${fileName}.xlsx`);
}

async function savePartWoorkbook(partData: {[key: string]: {[key: string]: string}}, fileName: string, reportDate: Date) {
  const monthIndex = reportDate.getMonth();

  const partWorkbook = new excelJs.Workbook();
  await partWorkbook.xlsx.readFile(`${statisticsPath}/${fileName}.xlsx`);
  const monthSheet = partWorkbook.worksheets[monthIndex];

  for (const column of Object.entries(partData)) {
    const columnLetter = partStatisticColumns[column[0]];
    const row = firstRowPartStatistic + reportDate.getDate();

    if (columnLetter) {
      monthSheet.getCell(`${columnLetter}${row}`).value = +column[1].content;
    }
  }

  await partWorkbook.xlsx.writeFile(`${statisticsPath}/${fileName}.xlsx`);
}
