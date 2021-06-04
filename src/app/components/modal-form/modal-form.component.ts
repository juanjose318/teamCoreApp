import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss'],
})

export class ModalFormComponent implements OnInit {
  @Input() ally;
  @Input() title;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ModalFormComponent>,


  ) { }

  formGroup: FormGroup;
  idAlly: number;
  idChannel: number;
  idRoute: number;
  identification: string;
  name: string;
  idCountry: string;
  contact: string;
  mail: string;
  phone: number;
  description: string;
  carvajalContact: string;
  creationDate: Date = new Date();


  save() {
    if (this.formGroup.invalid) {
      return;
    }
    this.dialogRef.close(this.formGroup.value);
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      idAllied: new FormControl(this.idAlly),
      channel: new FormGroup ({
        idChannel: new FormControl(this.idChannel),
      }),
      route: new FormGroup ({
        idRoute: new FormControl(this.idRoute),
      }),
      identification: new FormControl(this.identification, [Validators.maxLength(30), alphaNumericValidator]),
      name: new FormControl(this.name, [Validators.maxLength(50), alphaNumericValidator]),
      idCountry: new FormControl(this.idCountry, [Validators.required, Validators.maxLength(2), alphaNumericValidator]),
      contact: new FormControl(this.contact, [Validators.required, Validators.maxLength(100)]),
      mail: new FormControl(this.mail, [Validators.required]),
      phone: new FormControl(this.phone, [Validators.required]),
      description: new FormControl(this.description, [Validators.required, Validators.maxLength(400)]),
      carvajalContact: new FormControl(this.carvajalContact, [Validators.required, Validators.maxLength(320)]),
      creationDate: new FormControl(this.creationDate)
    });
  }
}

/**
 * Custom Validator para chequear si es alfanumerico
 */
const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9_]*$/;
const ALPHA_NUMERIC_VALIDATION_ERROR = { alphaNumericError: 'El campo debe ser numerico' };
function alphaNumericValidator(control: FormControl): ValidationErrors | null {
  return ALPHA_NUMERIC_REGEX.test(control.value) ? null : ALPHA_NUMERIC_VALIDATION_ERROR;
}

