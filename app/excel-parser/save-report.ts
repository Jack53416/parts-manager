import { statisticsPath, partStatisticTemplatePath, partStatisticColumns, firstRowPartStatistic, partStatisticNameCell } from './config';
import * as fs from 'fs';
import * as excelJs from 'exceljs';
import * as dayjs from 'dayjs';
import { PartToSave } from '../main';



export async function saveParts(parts: PartToSave[], reportDate: Date) {
  const fileList = fs.readdirSync(statisticsPath);
  const yearShort = dayjs(reportDate).format('YY');
  let partWorkbook = new excelJs.Workbook();

  for (const part of parts) {
    const fileName = `${part.machine}_${part.articleNo.replace('/', '_')}_wkz ${part.tool} -${yearShort}`;

    if (!(fileList.includes(fileName + '.xlsx'))) {
      partWorkbook = await createPartWorkbook(fileName, yearShort);
    } else {
      await partWorkbook.xlsx.readFile(`${statisticsPath}/${fileName}.xlsx`);
    }
    await savePartWoorkbook(partWorkbook, part, fileName, reportDate);
  }
}

async function createPartWorkbook(fileName: string, yearShort: string): Promise<excelJs.Workbook> {
  const partTemplate = new excelJs.Workbook();
  await partTemplate.xlsx.readFile(partStatisticTemplatePath);

  partTemplate.eachSheet((worksheet, _) => {
    worksheet.name = `${worksheet.name} ${yearShort}`;
    worksheet.getCell(partStatisticNameCell).value = fileName;
  });

  await partTemplate.xlsx.writeFile(`${statisticsPath}/${fileName}.xlsx`);
  return partTemplate;
}

async function savePartWoorkbook(partWorkbook: excelJs.Workbook, partData: PartToSave, fileName: string, reportDate: Date) {
  const monthIndex = reportDate.getMonth();

  const monthSheet = partWorkbook.worksheets[monthIndex];

  for (const [columnName, value] of Object.entries(partData)) {
    const columnLetter = partStatisticColumns[columnName];
    const row = firstRowPartStatistic + reportDate.getDate();

    if (columnLetter) {
      monthSheet.getCell(`${columnLetter}${row}`).value = +value;
    }
  }

  await partWorkbook.xlsx.writeFile(`${statisticsPath}/${fileName}.xlsx`);
}
