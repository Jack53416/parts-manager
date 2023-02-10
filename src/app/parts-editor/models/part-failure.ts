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

export const PART_FAILURES = [
    'machine',
    'name',
    'articleNo',
    'tool',
    'comment',
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
    'others'
];

