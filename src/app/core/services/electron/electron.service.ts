import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Part } from '../../../../../app/excel-parser/read-report';
import { PartWorkbook } from '../../../parts-editor/models/editor';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;

  fs: typeof fs;
  path: typeof path;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.fs = window.require('fs');
      this.path = window.require('path');

      this.childProcess = window.require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }

        console.log(`stdout:\n${stdout}`);
      });

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  async readExcelFile(date: Date): Promise<Map<string, Part>> {
    const result = await this.ipcRenderer?.invoke('openExcel', date.getTime());
    return result;
  }

  async savePartsToStatistic(parts: PartWorkbook, dateReport: Date): Promise<void> {
    const partsToSave = [];

    for (const part of parts) {
      const partDataToSave = {
        machine: part.machine.value,
        articleNo: part.articleNo.value,
        name: part.name.value,
        tool: part.tool.value,
        totalPartsProduced: part.totalPartsProduced.value,
        shortShot: part.shortShot.value,
        startupParts: part.startupParts.value,
        burns: part.burns.value,
        contaminated: part.contaminated.value,
        oilContaminations: part.oilContaminations.value,
        smudges: part.smudges.value,
        deformations: part.deformations.value,
        damagedInTransport: part.damagedInTransport.value,
        mechanicalDamages: part.mechanicalDamages.value,
        scratches: part.scratches.value,
        flashes: part.flashes.value,
        silvering: part.silvering.value,
        removedByRobot: part.removedByRobot.value,
        airBubbles: part.airBubbles.value,
        others: part.others.value,
      };

      partsToSave.push(partDataToSave);
    }

    await this.ipcRenderer.invoke('saveParts', partsToSave, dateReport);
  }
}
