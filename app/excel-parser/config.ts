export const columnReport = {
    production: 'P',
    articleNr: 'C',
    machine: 'A',
    tool: 'E',
    scrap: 'R',
    comment: 'L',
    batch: 'N'
};

export const databasePath = './app/excel-parser/parts.db';

export const statisticsPath = 'E:/tempStaty';

export const partStatisticTemplatePath = './app/excel-parser/m_template.xlsx';

export const partSummaryTemplate = './app/excel-parser/part_summary_template.xlsx';

export const partSummaryPath = 'E:/summary';

export const breakpointReport = {
    firstRow: 'Maszyna' //Header of first row, column A
};

export const shiftSuffixes = {
    a: '. zm.A',
    b: '. zm.B',
    c: '. zm.C'
};

export const partStatisticScrapCategoriesRow = 5;

export const partStatisticColumns = {
    airBubbles: 'Q',
    burns: 'G',
    contaminated: 'H',
    damagedInTransport: 'L',
    deformations: 'K',
    flashes: 'O',
    mechanicalDamages: 'M',
    oilContaminations: 'I',
    others: 'S',
    removedByRobot: 'R',
    scratches: 'N',
    shortShot: 'F',
    silvering: 'P',
    smudges: 'J',
    startupParts: 'E',
    articleNo: null,
    totalPartsProduced: 'B',
    tool: null,
    name: null,
    machine: null,
    scrapNo: null,
    scrap: 'D'
};

export const partSummaryColumnsLetters = [
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'R',
    'S',
];

export const firstRowPartStatistic = 5;

export const partStatisticNameCell = 'O2';

export const monthSummaryColumns = {
    tool: 'A',
    project: 'B',
    nrSap: 'C',
    name: 'D',
    month: 'E',
    scrapNames: 'F',
    totalProduction: 'G',
    totalScrap: 'H',
    partCost: 'L'
};

const firstPartFileRow = 6;
const lastPartFileRow = 36;

export const partFileRowsRange = getRange(firstPartFileRow, lastPartFileRow);

function getRange(start: number, end: number): number[] {
    return [...Array(end - start + 1).keys()].map(x => x + start);
}
