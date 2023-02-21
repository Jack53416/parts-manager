import * as XLSX from "xlsx";
//const reportPath: string = "./10_Październik_2022.xlsx";
const shiftNames: Array<string> = [
  "04.10.2022 zm.A",
  "04.10.2022 zm.B",
  "04.10.2022 zm.C",
];

export class Part {
  name: string;
  ArticleNo: string;
  tool: string;
  machine: string;
  totalPartsProduced: number;
  scrapNo: number;
  id: string;

  constructor(
    nameFromReport: string,
    partNrFromReport: string,
    toolFromReport: string,
    machineFromReport: string,
    productionFromReport: number,
    scrapFromReport: number
  ) {
    this.name = nameFromReport;
    this.ArticleNo = partNrFromReport;
    this.tool = toolFromReport;
    this.machine = machineFromReport;
    this.totalPartsProduced = productionFromReport;
    this.scrapNo = scrapFromReport;
    this.id = this.ArticleNo + ";" + this.tool;
  }
}

export function readExcel(reportPath: string) {
  let woorkbookReport: XLSX.WorkBook = XLSX.readFile(reportPath);

  let partList: Array<Part>;
  let partDict: { [key: string]: Part } = {};

  shiftNames.forEach(shiftNumber => {
    console.log(shiftNumber)
    let sheetShift: XLSX.Sheet = woorkbookReport.Sheets[shiftNumber];
    partList = parseShift(sheetShift);

    for (const part of partList) {
      if (!(part.id in partDict)) {
        partDict[part.id] = part;
      } else {
        partDict[part.id]["totalPartsProduced"] += part.totalPartsProduced;
        partDict[part.id]["scrapNo"] += part.scrapNo;
      }
    };
  });
  //console.log(partDict)
  return partDict;
}

function findFirstInjCell(sheetObject: Array<{ [key: string]: string | number }>) {
  let rowCounter: number = 0;

  for (const row of sheetObject) {
    if (row.A === "Maszyna") {
      return rowCounter + 1
    } else {
      rowCounter += 1;
    };
  }
  return -1 //komunikat o błędzie
};

function findLastInjCell(sheetObject: Array<{ [key: string]: string | number }>) {
  let rowCounter: number = 0;

  for (const row of sheetObject) {
    if ("P" in row && row.P !== 0 && "R" in row && !("C" in row) && !("E" in row) && !("N" in row)) {
      //console.log(row)
      return rowCounter - 1
    } else {
      rowCounter += 1;
    };
  }
  return -1 //komunikat o błędzie
};

function findFirstAssyCell(sheetObject: Array<{ [key: string]: string | number }>) {
  let rowCounter: number = 0;

  for (const row of sheetObject) {
    if (row.A === "Stanowisko") {
      return rowCounter + 1
    } else {
      rowCounter += 1;
    };
  }
  return -1 //komunikat o błędzie
};

function findLastAssyCell(sheetObject: Array<{ [key: string]: string | number }>) {
  let rowCounter: number = 0;

  for (const row of sheetObject) {
    if (row.B === "BS236013") {
      console.log(row)
      return rowCounter - 1
    } else {
      rowCounter += 1;
    };
  }
  return -1 //komunikat o błędzie
};

function parseShift(shiftSheet: XLSX.Sheet) {
  let sheetObject: Array<{ [key: string]: string | number }> =
  XLSX.utils.sheet_to_json(shiftSheet, { header: "A" , blankrows: true});

  let firstRowInjection: number = findFirstInjCell(sheetObject);
  let lastRowInjection: number = findLastInjCell(sheetObject);
  let firstRowAssembly: number = findFirstAssyCell(sheetObject);
  let lastRowAssembly: number = findLastAssyCell(sheetObject);

  let nameFromReport: string;
  let partNrFromReport: string;
  let toolFromReport: string;
  let machineFromReport: string;
  let productionFromReport: number;
  let scrapFromReport: number;

  let lastMachine: string;

  let part: Part;
  let partList: Array<Part> = [];

  sheetObject
    .slice(firstRowInjection, lastRowInjection)
    .filter((row) => {
      return "C" in row && row.P !== 0;
    })
    .forEach((row) => {
      //console.log(row);

      nameFromReport = "placeholder";
      partNrFromReport = row.C.toString();
      toolFromReport = row.E.toString();

      if ("A" in row) {
        machineFromReport = row.A.toString();
        lastMachine = machineFromReport;
      } else {
        machineFromReport = lastMachine;
      }

      productionFromReport = +row.P;
      scrapFromReport = +row.R;

      part = new Part(
        (nameFromReport = nameFromReport),
        (partNrFromReport = partNrFromReport),
        (toolFromReport = toolFromReport),
        (machineFromReport = machineFromReport),
        (productionFromReport = productionFromReport),
        (scrapFromReport = scrapFromReport)
      );

      partList.push(part);
    });
  //console.log(partList[0])
  return partList;
}

//let partDict: { [key: string]: Part } = readExcel();

//console.log(partDict["WW1701/5;56b"])