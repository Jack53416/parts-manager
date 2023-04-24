import * as XLSX from 'xlsx';
import { getPartPropertiesFromDatabase } from './database';
import { columnReport, breakpointReport, shiftSuffixes } from './config';
import { last } from 'rxjs';
import { StringLiteralLike } from 'typescript/lib/tsserverlibrary';

export class Part {
  name: string;
  articleNo: string;
  id: string;

  constructor(
    public tool: string,
    public machine: string,
    public totalPartsProduced: number,
    public scrapNo: number,
    public comment?: string
  ) {}

  async getPartProperties(partNr: string) {
    const partData: {sapNr: string; sapName: string} = await getPartPropertiesFromDatabase(partNr);
    this.name = partData.sapName;
    this.articleNo = partData.sapNr;
    this.id = this.articleNo + ';' + this.tool;
  }
}

function generateShiftNames(date: string): string[] {
  // ToDo (Mateusz): validation of sheets names
  const suffixList = [shiftSuffixes.a, shiftSuffixes.b, shiftSuffixes.c];
  //const suffixList = [shiftSuffixes.a];
  return suffixList.map(element => date + element);
};

export async function readExcel(reportPath: string, date: string): Promise<Map<string, Part>> {
  const woorkbookReport: XLSX.WorkBook = XLSX.readFile(reportPath);
  const partsResult: Map<string, Part> = new Map();
  const shiftNames = generateShiftNames(date);

  const promises = shiftNames.map(async (shiftName) => {
    const sheetShift: XLSX.Sheet = woorkbookReport.Sheets[shiftName];
    const partsInSheet: Part[] = await parseShift(sheetShift);

    for (const part of partsInSheet) {
      if (!(partsResult.has(part.id))) {
        partsResult.set(part.id, part);
      } else {
        const modifiedPart = partsResult.get(part.id);
        modifiedPart.totalPartsProduced += part.totalPartsProduced;
        modifiedPart.scrapNo += part.scrapNo;
        partsResult.set(part.id, modifiedPart);
      }
    }
  });

  await Promise.all(promises);
  return partsResult;
}

function findFirstReportRow(
  sheetObject: Array<{ [key: string]: string | number }>): number {
  let rowCounter = 0;

  for (const row of sheetObject) {
    if (row[columnReport.machine] === breakpointReport.firstRow) {
      return rowCounter + 1;
    } else {
      rowCounter += 1;
    }
  }
  return -1; //error message
}

function findLastReportRow(
  sheetObject: Array<{ [key: string]: string | number }>): number {
  let rowCounter = 0;

  for (const row of sheetObject) {
    if ( //last row only contains scrap number and production number
      columnReport.production in row &&
      row[columnReport.production] !== 0 &&
      columnReport.scrap in row &&
      !(columnReport.articleNr in row) &&
      !(columnReport.tool in row) &&
      !(columnReport.batch in row)
    ) {
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

  const firstRowInjection: number = findFirstReportRow(sheetObject);
  const lastRowInjection: number = findLastReportRow(sheetObject);

  let lastMachine: string;
  const partList = [];

  const notEmptyRows: {[key: string]: string | number}[] = sheetObject
    .slice(firstRowInjection, lastRowInjection)
    //.filter(row => columnReport.articleNr in row && row[columnReport.production] !== 0);
    .filter(row => columnReport.articleNr in row);

  for (const row of notEmptyRows) {
    if (row[columnReport.machine]) {
      lastMachine = row[columnReport.machine].toString();
    }



    if (row[columnReport.production] !== 0) {
      const part = await createPart(row, lastMachine);
      partList.push(part);
      lastMachine = part.machine;
    }
  }
  return partList;
}

async function createPart(row: {[key: string]: string | number}, lastMachine: string): Promise<Part> {
  const partNrFromReport = row[columnReport.articleNr].toString();
  const toolFromReport = row[columnReport.tool].toString();
  let machineFromReport = lastMachine;

  if (row.hasOwnProperty(columnReport.machine)) {
    machineFromReport = row[columnReport.machine].toString();
  }

  const productionFromReport = +row[columnReport.production];
  const scrapFromReport = +(row[columnReport.scrap] ?? 0);
  const commentFromReport = (row[columnReport.comment] ?? '').toString();

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

