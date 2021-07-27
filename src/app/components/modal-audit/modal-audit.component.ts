import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-audit',
    templateUrl: 'modal-audit.component.html',
    styleUrls: ['./modal-audit.component.scss']
})

export class ModalAuditComponent implements OnInit {
    private dataType = {
        products: 'products',
        pointsSale: 'pointsSale',
        traders: 'traders',
        masters: 'masters'
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalAuditComponent>,
    ) { }

    ngOnInit() {
     }

    close() {
        this.dialogRef.close();
      }
}