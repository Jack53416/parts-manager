import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { APP_CONFIG } from '../environments/environment';
import { ElectronService } from './core/services';
import { PartsDataService } from './parts-editor/services/parts-data.service';
import { describePressedKey } from './shared/utils/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly keyMap = new Map<string, () => void>([
    ['ctrl+z', () => this.partsDataService.activeEditor?.undo()],
    ['ctrl+y', () => this.partsDataService.activeEditor?.redo()],
  ]);
  constructor(
    private electronService: ElectronService,
    private partsDataService: PartsDataService,
  ) {
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const handler = this.keyMap.get(describePressedKey(event));
    if (handler) {
      handler();
      event.preventDefault();
    }
  }
}
