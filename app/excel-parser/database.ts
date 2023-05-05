import { Database} from 'sqlite3';
import { databasePath } from './config';

const db: Database = new Database(databasePath, (err: Error) => {
    if (err) {
      console.error(err.message);
    }
  });

export async function getPartPropertiesFromDatabase(partNr: string): Promise<{sapNr: string; sapName: string}> {
    return new Promise((resolve, reject) => {
        db.get(
            'select * from part_translate where report_nr = ?',
             partNr,
             // eslint-disable-next-line @typescript-eslint/naming-convention
             (_, row: {report_nr: string; sap_nr: string; sap_name: string}) => {
            if (row === undefined) {
                resolve({sapNr: partNr, sapName: 'Not in db'});
            } else {
                resolve({sapNr: row.sap_nr, sapName: row.sap_name});
            }
        });
    });
}
