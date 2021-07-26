import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MasterFile } from 'src/app/models/MasterFile.interface';

@Component({
  selector: 'app-upload-master-file',
  templateUrl: './upload-master-file.component.html',
  styleUrls: ['./upload-master-file.component.scss']
})
export class UploadMasterFileComponent implements OnChanges {

  @ViewChild('file') file: ElementRef;
  @Input() configurationDone;

  base64File;
  selectedFile;
  fileUrl;

  @Output() masterfile: EventEmitter<{ codedfile: MasterFile, fileInfo: string }> = new EventEmitter<{ codedfile: MasterFile, fileInfo: string }>();

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const configurationDone = changes['configurationDone'];
    if (configurationDone) {
      if (configurationDone.currentValue) {
        this.selectedFile = null;
      }
    }

  }
  // TODO AGREGAR SPINNER
  convertToBase64() {
    const reader = new FileReader();
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile as Blob);
    } else {
      this._snackBar.open('Selecciona un archivo para subir', 'cerrar', {
        duration: 2000,
      });
    }
    reader.onloadend = () => {
      const read = reader.result as string;
      this.base64File = read.replace('data:application/vnd.ms-excel;base64,', '');
      const fileName = this.selectedFile.name.replace('.csv', '');
      this.masterfile.emit({ codedfile: this.base64File, fileInfo: fileName });
    }
  }

  onSelectFile(element) {
    if (element.files.length === 0) {
      return;
    }
    this.selectedFile = (element.files as FileList)[0];
  }
}
