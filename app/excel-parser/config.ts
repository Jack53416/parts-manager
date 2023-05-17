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

export const statisticsPath = 'P:/tempStaty';

export const partStatisticTemplatePath = './app/excel-parser/m_template.xlsx';

export const partSummaryTemplate = './app/excel-parser/part_summary_template.xlsx';

export const partSummaryPath = 'P:/summary';

export const breakpointReport = {
    firstRow: 'Maszyna' //Header of first row, column A
};

export const shiftSuffixes = {
    a: '. zm.A',
    b: '. zm.B',
    c: '. zm.C'
};

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
    scrapNo: null
};

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
