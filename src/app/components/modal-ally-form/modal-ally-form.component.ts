import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-ally-form.component.html',
  styleUrls: ['./modal-ally-form.component.scss'],
})

export class ModalAllyFormComponent implements OnInit {
  @Input() ally;
  @Input() title;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ModalAllyFormComponent>,
  ) { }

  private formGroup: FormGroup;
  private idAlly: number;
  private idChannel: number;
  private idRoute: number;
  private identification: string;
  private name: string;
  private idCountry: string;
  private contact: string;
  private mail: string;
  private phone: number;
  private description: string;
  private carvajalContact: string;
private creationDate: Date = new Date ();

  save() {
    if (this.formGroup.invalid) {
      return;
    }
    this.dialogRef.close(this.formGroup.value);
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Getters para manejo dentro del html
   */
  get nameField() {
    return this.formGroup.get('name');
  }

  get mailField() {
    return this.formGroup.get('mail');
  }

  get contactField() {
    return this.formGroup.get('contact');
  }

  get identificationField() {
    return this.formGroup.get('identification');
  }

  get phoneField() {
    return this.formGroup.get('phone');
  }

  get descriptionField() {
    return this.formGroup.get('description');
  }

  get carvajalContactField() {
    return this.formGroup.get('carvajalContact');
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      idAllied: new FormControl(this.idAlly),
      channel: new FormGroup({
        idChannel: new FormControl(this.idChannel),
      }),
      route: new FormGroup({
        idRoute: new FormControl(this.idRoute),
      }),
      identification: new FormControl(this.identification, [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('^.*$')]),
      name: new FormControl(this.name, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^.*$')]),
      idCountry: new FormControl(this.idCountry, [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern('^.*$')]),
      contact: new FormControl(this.contact, [
        Validators.required,
        Validators.maxLength(100)]),
      mail: new FormControl(this.mail, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+.*[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$')]),
      phone: new FormControl(this.phone, [
        Validators.required]),
      description: new FormControl(this.description, [
        Validators.required,
        Validators.maxLength(400),
        Validators.pattern('^.*$')]),
      carvajalContact: new FormControl(this.carvajalContact, [
        Validators.required,
        Validators.maxLength(320),
        Validators.pattern('^[a-zA-Z]+.*[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$')]),
      creationDate: new FormControl(this.creationDate)
    });

    /**
     * Inyeccion de datos de aliado a form
     */
    if (!!this.data) {
      this.formGroup.patchValue({
        idAllied: this.data.ally.idAllied,
        channel: {
          idChannel: this.data.ally.channel.channel
        },
        route: {
          idRoute: this.data.ally.route.route
        },
        identification: this.data.ally.identification,
        name: this.data.ally.name,
        idCountry: this.data.ally.idCountry,
        contact: this.data.ally.contact,
        mail: this.data.ally.mail,
        phone: this.data.ally.phone,
        description: this.data.ally.description,
        carvajalContact: this.data.ally.carvajalContact,
        creationDate: this.data.ally.creationDate
      });
    }
  }
}
