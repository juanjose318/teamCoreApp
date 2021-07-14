import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterFileService } from 'src/app/services/masterfile/masterfile.service';
import { base64 } from 'angular-base64/angular-base64';
import { MasterFile } from 'src/app/models/MasterFile.interface';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-master-file',
  templateUrl: './upload-master-file.component.html',
  styleUrls: ['./upload-master-file.component.scss']
})
export class UploadMasterFileComponent {

  @ViewChild('file') file: ElementRef;

  base64File;
  selectedFile;
  fileUrl;

  @Output() masterfile: EventEmitter<{ codedfile: MasterFile, fileInfo: string }> = new EventEmitter<{ codedfile: MasterFile, fileInfo: string }>();

  constructor(
  ) { }

  ngOnInit() {

  }

  convertToBase64() {
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile as Blob);
    reader.onloadend = () => {
      let read = reader.result as string;
      this.base64File = read.replace('data:application/vnd.ms-excel;base64,', '');
      let fileName = this.selectedFile.name.replace('.csv', '');
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
