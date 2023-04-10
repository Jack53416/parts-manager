import { Part } from './part';

export interface PartFailure extends Part {
    shortShot: number;
    startupParts: number;
    burns: number;
    contaminated: number;
    oilContaminations: number;
    smudges: number;
    deformations: number;
    damagedInTransport: number;
    mechanicalDamages: number;
    scratches: number;
    flashes: number;
    silvering: number;
    removedByRobot: number;
    airBubbles: number;
    others: number;
}

export type PartColumns = keyof PartFailure;

export const PART_FAILURES: PartColumns[] = [
    'machine',
    'name',
    'articleNo',
    'tool',
    'totalPartsProduced',
    'scrapNo',
    'shortShot',
    'startupParts',
    'burns',
    'contaminated',
    'oilContaminations',
    'smudges',
    'deformations',
    'damagedInTransport',
    'mechanicalDamages',
    'scratches',
    'flashes',
    'silvering',
    'removedByRobot',
    'airBubbles',
    'others',
];

