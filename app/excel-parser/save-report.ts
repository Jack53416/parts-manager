import {
  statisticsPath,
  partStatisticTemplatePath,
  partStatisticColumns,
  firstRowPartStatistic,
  partStatisticNameCell,
  partStatisticNrCell,
} from './config';
import * as fs from 'fs';
import * as excelJs from 'exceljs';
import * as dayjs from 'dayjs';
import { PartToSave } from '../models/part-to-save';

export async function saveParts(parts: PartToSave[], reportDate: Date) {
  const fileList = fs.readdirSync(statisticsPath);
  const yearShort = dayjs(reportDate).format('YY');
  let partWorkbook = new excelJs.Workbook();

  for (const part of parts) {
    const partName = `${part.articleNo.replace('/', '-')}_wkz ${part.tool} -${yearShort}`;
    let fileName = fileList.find((file) => file.includes(partName));

    if (fileName) {
      await partWorkbook.xlsx.readFile(`${statisticsPath}/${fileName}`);
    } else {
      fileName = `${part.machine}_${partName}.xlsx`;
      partWorkbook = await createPartWorkbook(fileName, part.name);
    }
    await savePartWoorkbook(partWorkbook, part, fileName, reportDate);
  }
}

async function createPartWorkbook(
  fileName: string,
  partName: string
): Promise<excelJs.Workbook> {
  const partTemplate = new excelJs.Workbook();
  await partTemplate.xlsx.readFile(partStatisticTemplatePath);

  partTemplate.eachSheet((worksheet, _) => {
    worksheet.getCell(partStatisticNrCell).value = fileName;
    worksheet.getCell(partStatisticNameCell).value = partName;
  });

  await partTemplate.xlsx.writeFile(`${statisticsPath}/${fileName}`);
  return partTemplate;
}

async function savePartWoorkbook(
  partWorkbook: excelJs.Workbook,
  partData: PartToSave,
  fileName: string,
  reportDate: Date
) {
  const monthIndex = reportDate.getMonth();

  const monthSheet = partWorkbook.worksheets[monthIndex];
  const row = firstRowPartStatistic + reportDate.getDate();

  for (const [columnName, value] of Object.entries(partData)) {
    const columnLetter = partStatisticColumns[columnName];

    if (columnLetter) {
      monthSheet.getCell(`${columnLetter}${row}`).value = +value;
    }
  }

  if (partData.machine !== fileName.slice(0, 6)) {
    monthSheet.getCell(
      `${partStatisticColumns.totalPartsProduced}${row}`
    ).note = partData.machine;
  }

  // set edited worksheet to be active when open file manually
  partWorkbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: monthIndex,
      visibility: 'visible',
    },
  ];

  await partWorkbook.xlsx.writeFile(`${statisticsPath}/${fileName}`);
}
