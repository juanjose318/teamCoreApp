import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { MasterFileService } from 'src/app/services/masterfile/masterfile.service';

@Component({
  selector: 'app-upload-master-file',
  templateUrl: './upload-master-file.component.html',
  styleUrls: ['./upload-master-file.component.scss']
})
export class UploadMasterFileComponent {

  @ViewChild('file') file: ElementRef;
  fileData: File = null;

  constructor(private http: HttpClient, private masterFileService : MasterFileService) { }

  ngOnInit() {
   
  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    //formData.append('file', this.fileData);
    formData.append('file', 
    this.file.nativeElement.files[0], 
    this.file.nativeElement.files[0].name);
    this.masterFileService.uploadFile(formData);
  }

}
