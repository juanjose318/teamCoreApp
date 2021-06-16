import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ModalDescriptionComponent } from 'src/app/components/modal-description/modal-description.component';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { AuditService } from 'src/app/services/audit/audit.service';

@Component({
  selector: 'app-configurar-aliados',
  templateUrl: './configurar-aliados.component.html',
  styleUrls: ['./configurar-aliados.component.scss']
})
export class ConfigurarAliadosComponent implements OnInit {
  /**
   * Aliado
   */
  private selectedAlly;
  private allies: any;
  private allySub: Subscription;
  private everyAlly: any;
  /**
   * Check para ver que pais esta seleccionado
   */
  private selectedCountry: string;
  /**
   * Auditoria
   */
  private audit: any;
  private auditSub: Subscription;
  /**
   * tableNumber define desde que componente se va a reutilizar la tabla de display de informacion
   */
  tableNumber = 1;
  /**
   * Mensajes para textBox component
   * TODO: Ponerlos en archivo aparte como mock
   */
  descriptionBoxText = 'Herramienta que permite crear y/o editar informacion de los Aliados';
  descriptionAudit = 'El ultimo cambio efectuado sobre la informacion de Aliado';
  /**
   * Config envio de aliados
  */
  private configInfoSending = false;
  constructor(
    private aliadoService: AliadoService,
    private auditService: AuditService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // console.log("hi");
    // this.aliadoService.getAllies();
    // this.allySub = this.aliadoService.getAllyListener()
    //   .subscribe((allyData) => {
    //     this.everyAlly = allyData.allies;
    //     console.log(this.everyAlly);
    //   });
  }
  /**
   * Creacion de Aliado
   * @param newAlly Id de aliado
   */
  handleNewAlly(newAlly) {
    this.aliadoService.createAlly(newAlly).subscribe((allyData) => {
      this.handleSearchCountry(newAlly.idCountry);
      this.allies.allies.push(allyData);
    });
  }
  /**
   * Busqueda de aliado especifico despues de filtro de pais
   * @param allyId Id de aliado
   */
  handleSearchAlly(allyId) {
    this.selectedAlly = [];
    const searchedByAlly = this.allies.allies.filter(ally => ally.idAllied == allyId);
    this.selectedAlly = { allies: searchedByAlly };
  }
  /**
   * Confirmar o cancelar eliminacion de Aliado
   * @param idAllied id Aliado
   */
  handleDeleteAlly(toDeleteAlly) {
    const dialogRef = this.dialog.open(ModalDescriptionComponent, {
      width: '30%',
      data: { deleting: true, cancelling: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const updateDate: Date = new Date();

        this.aliadoService.deleteAlly(toDeleteAlly.idAllied).subscribe(() => {
          const collectionAfterDelete = this.allies.allies.filter(ally => ally.idAllied !== toDeleteAlly.idAllied);
          this.aliadoService.getAllyByCountry(toDeleteAlly.idCountry);
          const allyAudit = [{
            'idAlliedAudit': null,
            'idAllied': toDeleteAlly.idAllied,
            'idState': 1,
            'idCountry': toDeleteAlly.idCountry,
            'actionExecuted': 'Eliminado',
            'executor': 'ivan hernandez',
            'affectedField': ' ',
            'valueBefore': ' ',
            'valueAfter': ' ',
            'ipOrigin': '10.20.32.141',
            'creationDate': toDeleteAlly.creationDate,
            'updateDate': ''
          }];
          this.auditService.createAuditAlly(allyAudit).subscribe();
          this.allies = { allies: collectionAfterDelete };
          this._snackBar.open('Operacion exitosa, El registro se Elimino Satisfactoriamente', 'cerrar', {
            duration: 2000,
          });
        });
      } else {
        this._snackBar.open('Operacion Cancelada', 'cerrar', {
          duration: 2000,
        });
      }
    });
  }
  /**
   * @param ally objeto con dos subobjetos
   * @param ally.modifiedAlly Aliado modificiado
   * @param ally.selectedAlly Aliado sin modificar
   */
  handleEditedAlly(ally) {
    const updateDate: Date = new Date();
    const alliesAudit = [];

    Object.getOwnPropertyNames(ally.modifiedAlly).forEach((val, idx, array) => {
      if (idx !== 1 && idx !== 2) {
        if (ally.selectedAlly[val] !== ally.modifiedAlly[val]) {

          const allyAudit = {
            'idAlliedAudit': null,
            'idAllied': ally.selectedAlly.idAllied,
            'idState': 1,
            'idCountry': ally.selectedAlly.idCountry,
            'actionExecuted': 'Editado',
            'executor': 'ivan hernandez',
            'affectedField': val,
            'valueBefore': ally.selectedAlly[val],
            'valueAfter': ally.modifiedAlly[val],
            'ipOrigin': '10.20.32.141',
            'creationDate': ally.modifiedAlly.creationDate,
            'updateDate': updateDate
          };
          alliesAudit.push(allyAudit);
        }
      }
    });
    this.aliadoService.updateAlly(ally.modifiedAlly).subscribe(() => {
      this.auditService.createAuditAlly(alliesAudit).subscribe(() => {
        this.audit.push(alliesAudit);
      });
      this.handleSearchCountry(ally.modifiedAlly.idCountry);
    });
  }

  /**
   * Filtro por pais
   * @param country Id de pais por el cual se quiere filtrar
   */
  handleSearchCountry(country) {
    console.log(country);
    this.allies = country;
    this.audit = country;
  }
}
