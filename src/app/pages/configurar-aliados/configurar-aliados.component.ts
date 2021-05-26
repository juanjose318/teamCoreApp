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
   * Mensajes para textBox component
   * TODO: Ponerlos en archivo aparte como mock
   */
  descriptionBoxText: String = "Herramienta que permite  Habilitar en inhabilitar tanto comercio como un fabricante y sobre este ultimo, activar los socios Comerciales y las referencisa del catalogo de productos para el envio de la Meta Data de ventar para inventarios al aliado";
  descriptionAudit = "El ultimo cambio efectuado sobre la informacion de Aliado";

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
