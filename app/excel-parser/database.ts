import { Database} from 'sqlite3';

const db: Database = new Database('./app/excel-parser/parts.db', (err: Error) => {
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
             (err, row: {report_nr: string; sap_nr: string; sap_name: string}) => {
            if (row === undefined) {
                //const newPart = addPart(partNr);
                //resolve(newPart);
                resolve({sapNr: 'Not in db', sapName: 'Not in db'});
            } else {
                resolve({sapNr: row.sap_nr, sapName: row.sap_name});
            }
        });
    });
}
