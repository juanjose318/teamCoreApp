import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';

@Component({
  selector: 'app-configurar-envios-aliado',
  templateUrl: './configurar-envios-aliado.component.html',
  styleUrls: ['./configurar-envios-aliado.component.scss']
})
export class ConfigurarEnviosAliadoComponent implements OnInit {
    /**
   * Aliado
   */
     private allies: any;
     private allySub: Subscription;
       /**
   * Mensajes para textBox component
   * TODO: Ponerlos en archivo aparte como mock
   */
  descriptionText: String = 'Herramienta que permite  Habilitar en inhabilitar tanto comercio como un fabricante y sobre este ultimo, activar los socios Comerciales y las referencisa del catalogo de productos para el envio de la Meta Data de ventar para inventarios al aliado';

  private configInfoSending  = true;

  constructor(
    private aliadoService: AliadoService,

  ) { }

  ngOnInit() {
    this.aliadoService.getAllies();
    this.allySub = this.aliadoService.getAllyListener()
      .subscribe((allyData) => {
        this.allies = allyData.allies;
        console.log(allyData.allies);
      });

    // this.auditService.getAudit();
    // this.auditSub = this.auditService.getAuditListener()
    //   .subscribe((auditData) => {
    //     this.audit = auditData;
    //     console.log(auditData);
    //   });
  }

}
