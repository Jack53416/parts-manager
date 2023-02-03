import { Component, ViewChild } from '@angular/core';
import { APP_CONFIG } from '../environments/environment';
import { ElectronService } from './core/services';
import { CustomToolbarComponent } from './toolbar/components/custom-toolbar/custom-toolbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(CustomToolbarComponent, {static: true}) customToolbar: CustomToolbarComponent;
  _showRedBox = false;
  constructor(
    private electronService: ElectronService,
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
  handleDupa3Click() {
    this.customToolbar.showDupa2();
  }
  showRedBox() {
    // eslint-disable-next-line no-underscore-dangle
    this._showRedBox = !this._showRedBox;
  }
}
