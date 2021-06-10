import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-description',
    templateUrl: 'modal-description.component.html',
    styleUrls: ['modal-description.component.scss']
})

export class ModalDescriptionComponent {
    /**
     * @param data Usada para eliminacion de aliado
     * @param dialogRef Referencia asi mismo
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalDescriptionComponent>,
    ) { }

    close() {
        this.dialogRef.close();
    }
}
