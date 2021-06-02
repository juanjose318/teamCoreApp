import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})

export class ModalFormComponent implements OnInit {
  @Input() ally;
  @Input() title;

  constructor(
    activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) { }

  formGroup: FormGroup;
  idAlly: string;
  channeldId: string;
  routeId: string;
  identification: string;
  name: string;
  countryId: string;
  contact: string;
  mail: string;
  phone: number;
  description: string;
  carvajalContact: string;
  creationDate: Date = new Date();

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: new FormControl(this.idAlly),
      channelId: new FormControl(this.channeldId),
      routeId: new FormControl(this.routeId),
      identification: new FormControl(this.identification, [Validators.maxLength(30), alphaNumericValidator]),
      name: new FormControl(this.name, [Validators.maxLength(50), alphaNumericValidator]),
      countryId: new FormControl(this.countryId, [Validators.required, Validators.maxLength(2), alphaNumericValidator]),
      contact: new FormControl(this.contact, [Validators.required, Validators.maxLength(100)]),
      mail: new FormControl(this.mail, [Validators.required, alphaNumericValidator]),
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

