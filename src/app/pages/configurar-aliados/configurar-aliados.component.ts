import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  private allies: any;
  private allySub: Subscription;
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
  descriptionBoxText: String = 'Herramienta que permite crear y/o editar informacion de los Aliados';
  descriptionAudit = 'El ultimo cambio efectuado sobre la informacion de Aliado';

  /**
   * Config envio de aliados
  */
  private configInfoSending  = false;


  constructor(
    private aliadoService: AliadoService,
    private auditService: AuditService
  ) { }

  ngOnInit() {
    this.aliadoService.getAllies();
    this.allySub = this.aliadoService.getAllyListener()
      .subscribe((allyData) => {
        this.allies = allyData.allies;
        console.log(allyData.allies);
      });

    this.auditService.getAudit();
    this.auditSub = this.auditService.getAuditListener()
      .subscribe((auditData) => {
        this.audit = auditData;
        console.log(auditData);
      });
  }

  /**
   * TODO: Abrir modal con inputs para creacion de usuario
   */
  handleNewAlly() { }

  handleSearch(parameters) {
    console.log(parameters);
  }
}
