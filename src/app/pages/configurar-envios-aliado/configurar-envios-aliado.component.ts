import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-configurar-envios-aliado',
  templateUrl: './configurar-envios-aliado.component.html',
  styleUrls: ['./configurar-envios-aliado.component.scss']
})
export class ConfigurarEnviosAliadoComponent implements OnInit {
  /**
 * Aliado
 */
  private selectedAlly;
  private allies: any;
  /**
   * Suscripciones
   */
  private allySub: Subscription;
  /**
  * Mensajes para textBox component
  * TODO: Ponerlos en archivo aparte como mock
  */
  descriptionText: String = 'Herramienta que permite  Habilitar en inhabilitar tanto comercio como un fabricante y sobre este ultimo, activar los socios Comerciales y las referencisa del catalogo de productos para el envio de la Meta Data de ventar para inventarios al aliado';
  /**
   * Conficional para Saber si se trata de la pantalla configurar envios de aliado
   */
  private configInfoSending = true;
  /**
  * tableNumber define desde que componente se va a reutilizar la tabla de display de informacion
  */
  tableNumber = 1;
  /**
  * Auditoria
  */
  private audit: any;
  private auditSub: Subscription;

  isLoading: boolean;

  handleSearchAlly(allyId) {
    this.selectedAlly = allyId;
  }

  constructor(
    private aliadoService: AliadoService,
    private configService: ConfigService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
 
  }

  handleSearchCountry(country) {
    this.isLoading = true;
    console.log(country);
    switch (country) {
      case 'CO':
        this.allies = country;
        this.audit = country;
        break;
      case 'ALL':
        this.allies = country;
        break;
      case 'AR':
        this.allies = country;
        this.audit = country;
        break;
      case 'EMPTY':
        this.isLoading = false;
        break;
      case 'MX':
        this.allies = country;
        this.audit = country;
        break;
      case 'PE':
        this.allies = country;
        this.audit = country;
        break;
    }
  }

}
