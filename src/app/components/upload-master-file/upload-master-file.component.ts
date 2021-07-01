import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterFileService } from 'src/app/services/masterfile/masterfile.service';
import { base64 } from 'angular-base64/angular-base64';
import { MasterFile } from 'src/app/models/MasterFile.interface';

@Component({
  selector: 'app-upload-master-file',
  templateUrl: './upload-master-file.component.html',
  styleUrls: ['./upload-master-file.component.scss']
})
export class UploadMasterFileComponent {

  @ViewChild('file') file: ElementRef;
  fileData: File = null;

  constructor(private http: HttpClient, private masterFileService: MasterFileService) { }

  ngOnInit() {

  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  onSubmit() {
    var dataEncode = '';
    var dataDecode = '';
    const formData = new FormData();
    //formData.append('file', this.fileData);
    /*formData.append('file',
      this.file.nativeElement.files[0],
      this.file.nativeElement.files[0].name);*/
    let masterFile: MasterFile;
    masterFile = {
      "fileName": this.file.nativeElement.files[0].name,
      "detail": btoa(this.file.nativeElement.files[0]),
      "idMasterFile": 0,
      "idAlliedCompanyConfig": 0,
      "idAlliedCompanyConfAudit": 0,
      "userName": "camalzgo",
      "master": "Producto",
      "startDateLoad": new Date(Date.now()),
      "endDateLoad": new Date(Date.now())
    };
    console.log(masterFile.detail);
    //dataEncode = btoa("username:temppass");
    //console.log(dataEncode);
    //dataDecode = atob(dataEncode);
    //console.log(dataDecode);
    //this.masterFileService.uploadFile(formData);
  }

}
