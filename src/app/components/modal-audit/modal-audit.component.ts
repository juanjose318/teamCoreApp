import { Component, Inject, Input, OnInit } from '@angular/core';
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
        traders: 'traders'
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalAuditComponent>,
    ) { }

    ngOnInit() {
        console.log(this.data.registry.lstAlliedPointsSaleConfAudit.length);
     }

    close() {
        this.dialogRef.close();
      }
}