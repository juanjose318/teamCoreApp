import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-modal-save-confirmation',
    template: `
    <div *ngIf="data">
        <div mat-dialog-header>
            <h1 mat-dialog-title class="text-primary">Confirmación</h1>
        </div>
        <div mat-dialog-content>
        <p>Está seguro que desea continuar con la operación?</p>
      </div>
      <div mat-dialog-actions class="btn-wrapper">
      <button class="btn btn-primary" [mat-dialog-close]="data.confirm">Confirmar</button>
      <button class="btn btn-primary" [mat-dialog-close]="data.cancel">Cancelar</button>
    </div>
    </div>
    `,
    styleUrls: ['./modal-save-confirmation.component.scss']
})

export class ModalSaveConfirmationComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalSaveConfirmationComponent>,
    ) { }

    ngOnInit() { }
}
