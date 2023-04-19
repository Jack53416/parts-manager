import * as XLSX from 'xlsx';
import { getPartPropertiesFromDatabase } from './database';
import { reportConfig } from './config';

//TODO Reveive date from user
//const shiftNames: Array<string> = [
//  '04.10.2022 zm.A',
//  '04.10.2022 zm.B',
//  '04.10.2022 zm.C',
//];

export class Part {
  name: string;
  articleNo: string;
  tool: string;
  machine: string;
  totalPartsProduced: number;
  scrapNo: number;
  id: string;
  comment?: string;

  constructor(
    toolFromReport: string,
    machineFromReport: string,
    productionFromReport: number,
    scrapFromReport: number,
    commentFromReport: string
  ) {
    //this.name = this.getPartName(partNrFromReport);
    //this.articleNo = partNrFromReport;
    this.tool = toolFromReport;
    this.machine = machineFromReport;
    this.totalPartsProduced = productionFromReport;
    this.scrapNo = scrapFromReport;
    this.comment = commentFromReport;
  }

  async getPartProperties(partNr: string) {
    const partData: {sapNr: string; sapName: string} = await getPartPropertiesFromDatabase(partNr);
    this.name = partData.sapName;
    this.articleNo = partData.sapNr;
    this.id = this.articleNo + ';' + this.tool;
  }
}

function generateShiftNames(date: string): string[] {
  // ToDo: validation of sheets names
  const suffixList = [' zm.A', ' zm.B', ' zm.C'];
  return suffixList.map(element => date + element);
};

export async function readExcel(reportPath: string, date: string): Promise<{[key: string]: Part}> {
  const woorkbookReport: XLSX.WorkBook = XLSX.readFile(reportPath);
  const parts: { [key: string]: Part } = {};
  const shiftNames = generateShiftNames(date);

  const promises = shiftNames.map(async (shiftName) => {
    const sheetShift: XLSX.Sheet = woorkbookReport.Sheets[shiftName];
    const partsInSheet: Part[] = await parseShift(sheetShift);

    for (const part of partsInSheet) {
      if (!(part.id in parts)) {
        parts[part.id] = part;
      } else {
        parts[part.id].totalPartsProduced += part.totalPartsProduced;
        parts[part.id].scrapNo += part.scrapNo;
      }
    }
  });

  await Promise.all(promises);
  return parts;
}

function findFirstInjCell(
  sheetObject: Array<{ [key: string]: string | number }>): number {
  let rowCounter = 0;

  for (const row of sheetObject) {
    if (row[reportConfig.columnMachine] === 'Maszyna') {
      return rowCounter + 1;
    } else {
      rowCounter += 1;
    }
  }
  return -1; //error message
}

function findLastInjCell(
  sheetObject: Array<{ [key: string]: string | number }>): number {
  let rowCounter = 0;

  for (const row of sheetObject) {
    if (
      reportConfig.columnProduction in row &&
      row[reportConfig.columnProduction] !== 0 &&
      reportConfig.columnScrap in row &&
      !(reportConfig.columnArticleNr in row) &&
      !(reportConfig.columnTool in row) &&
      !(reportConfig.columnBatch in row)
    ) {
      return rowCounter - 1;
    } else {
      rowCounter += 1;
    }
  }
  return -1; //error message
}

function findFirstAssyCell(
  sheetObject: Array<{ [key: string]: string | number }>): number {
  let rowCounter = 0;

  for (const row of sheetObject) {
    if (reportConfig.columnMachine === 'Stanowisko') {
      return rowCounter + 1;
    } else {
      rowCounter += 1;
    }
  }
  return -1; //error message
}

function findLastAssyCell(
  sheetObject: Array<{ [key: string]: string | number }>): number {
  let rowCounter = 0;

  for (const row of sheetObject) {
    if (row.B === 'BS236013') {
      return rowCounter - 1;
    } else {
      rowCounter += 1;
    }
  }
  return -1; //error message
}

async function parseShift(shiftSheet: XLSX.Sheet): Promise<Part[]> {
  const sheetObject: Array<{ [key: string]: string | number }> =
    XLSX.utils.sheet_to_json(shiftSheet, { header: 'A', blankrows: true });

  const firstRowInjection: number = findFirstInjCell(sheetObject);
  const lastRowInjection: number = findLastInjCell(sheetObject);
  const firstRowAssembly: number = findFirstAssyCell(sheetObject);
  const lastRowAssembly: number = findLastAssyCell(sheetObject);

  let lastMachine: string;
  const partList = [];

  const notEmptyRows: {[key: string]: string | number}[] = sheetObject
    .slice(firstRowInjection, lastRowInjection)
    .filter(row => reportConfig.columnArticleNr in row && row[reportConfig.columnProduction] !== 0);

  for (const row of notEmptyRows) {
    const part = await createPart(row, lastMachine);
    partList.push(part);
    lastMachine = part.machine;
  }
  return partList;
}

async function createPart(row: {[key: string]: string | number}, lastMachine: string): Promise<Part> {
      const partNrFromReport = row[reportConfig.columnArticleNr].toString();
      const toolFromReport = row[reportConfig.columnTool].toString();
      let machineFromReport = lastMachine;

      if (reportConfig.columnMachine in row) {
        machineFromReport = row[reportConfig.columnMachine].toString();
      }

      const productionFromReport = +row[reportConfig.columnProduction];
      const scrapFromReport = +(row[reportConfig.columnScrap] ?? 0) ;
      const commentFromReport = (row[reportConfig.columnComment] ?? '').toString();

      const part = new Part(
        toolFromReport,
        machineFromReport,
        productionFromReport,
        scrapFromReport,
        commentFromReport
      );
      await part.getPartProperties(partNrFromReport);

      return part;
}

