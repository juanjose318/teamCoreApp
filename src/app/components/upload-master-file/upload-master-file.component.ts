import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MasterFile } from 'src/app/models/MasterFile.interface';

@Component({
  selector: 'app-upload-master-file',
  templateUrl: './upload-master-file.component.html',
  styleUrls: ['./upload-master-file.component.scss']
})
export class UploadMasterFileComponent implements OnChanges, OnInit {

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
        this.file.nativeElement.value = '';
      }
    }

  }
  // TODO AGREGAR SPINNER
  convertToBase64() {
    const reader = new FileReader();
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile as Blob);
    }
    reader.onloadend = () => {
      const read = reader.result as string;

      this.base64File = read.replace('data:application/vnd.ms-excel;base64,', '');
      let fileName = this.selectedFile.name;
      const idxDot = fileName.lastIndexOf('.') + 1;
      const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile === 'csv') {
        fileName = this.selectedFile.name.replace('.csv', '');
        const validFileName = this.hasSpecialCharacters(fileName);
        if (validFileName) {
          this.masterfile.emit({ codedfile: this.base64File, fileInfo: fileName });
        } else {
          this.file.nativeElement.value = '';
          this._snackBar.open('Nombre archivo inválido. Solo se aceptan letras, números, espacio, guion Medio ("-"), guion bajo("_")', 'cerrar', {
            duration: 2000,
          });
        }
      } else {
        this.file.nativeElement.value = '';
        this._snackBar.open('La extensión del archivo debe ser CSV', 'cerrar', {
          duration: 2000,
        });
      }
    };

  }

  hasSpecialCharacters(string) {
    const regex = /^[\w\d\s-_]+$/;
    const isValid = regex.test(string);
    if (!isValid) {
      return false;
    } else {
      return true;
    }
  }

  onSelectFile(element) {
    if (element.files.length === 0) {
      return;
    }
    this.selectedFile = (element.files as FileList)[0];
    this.convertToBase64();
  }
}
