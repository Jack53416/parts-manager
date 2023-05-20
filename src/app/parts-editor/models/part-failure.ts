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

export interface PartColumnDefinition {
  name: keyof PartFailure;
  title: string;
}

export type PartColumns = Map<keyof PartFailure, string>;

export const PART_FAILURES: PartColumns = new Map([
  ['machine', $localize`Machine`],
  ['reportNumber', $localize`Number Report`],
  ['name', $localize`Name`],
  ['articleNo', $localize`Article No`],
  ['tool', $localize`Tool`],
  ['totalPartsProduced', $localize`Total parts produced`],
  ['scrapNo', $localize`Scrap No`],
  ['startupParts', $localize`Startup Parts`],
  ['shortShot', $localize`Short Shot`],
  ['burns', $localize`Burns`],
  ['contaminated', $localize`Contaminated`],
  ['oilContaminations', $localize`Oil contaminations`],
  ['smudges', $localize`Smudges`],
  ['deformations', $localize`Deformations`],
  ['damagedInTransport', $localize`Damaged in transport`],
  ['mechanicalDamages', $localize`Mechanical damages`],
  ['scratches', $localize`Scratches`],
  ['flashes', $localize`Flashes`],
  ['silvering', $localize`Silvering`],
  ['removedByRobot', $localize`Removed by robot`],
  ['airBubbles', $localize`Air bubbles`],
  ['others', $localize`Others`],
]);

export const PART_FAILURE_COLUMNS: PartColumnDefinition[] = Array.from(
  PART_FAILURES.entries()
).map(([colName, colTitle]) => ({
  name: colName,
  title: colTitle,
}));
