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
export class ConfigurarEnviosAliadoComponent {
  /**
 * Aliado
 */
  private selectedAlly;
  private selectedCountry: any;
  private selectedCompany;
  /**
   * Suscripciones
   */
  private allySub: Subscription;
  private companySub: Subscription;
  /**
  * Mensajes para textBox component
  * TODO: Ponerlos en archivo aparte como mock
  */
  descriptionText: String = 'Herramienta que permite habilitar e inhabilitar tanto comercio como un fabricante y sobre este último, activar los socios comerciales y las referencias del catalogo de productos para el envío de la metadata de ventas para inventarios al aliado ';
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
  /**
   * Coleccion
   */
  private allyCollection;
  private companyCollection;
  /**
   * Reset de configuracion
   */
  private cleanConfig;

  isLoading: boolean;

  handleSearchAlly(allyId) {
    if (!!allyId) {
      this.selectedAlly = allyId;
    }
  }

  constructor(
    private aliadoService: AliadoService,
    private configService: ConfigService,
    private companyService: CompanyService,
    private allyService: AliadoService,

  ) { }

  handleSearchCompany(companyId) {
      this.selectedCompany = companyId;
    }

  handleCancel(cancel){
    console.log(cancel);
    if(cancel === true){
      this.cleanConfig = true;
    }
  }

  handleSearchCountry(country) {
    this.isLoading = true;
      switch(country) {
      case 'CO':
      this.selectedCountry = country;
      this.audit = country;
      break;
      case 'ALL':
      this.selectedCountry = country;
      break;
      case 'AR':
      this.selectedCountry = country;
      this.audit = country;
      break;
      case 'EMPTY':
      this.isLoading = false;
      break;
      case 'MX':
      this.selectedCountry = country;
      this.audit = country;
      break;
      case 'PE':
      this.selectedCountry = country;
      this.audit = country;
      break;
    }
  }

  handleReset(){
    this.cleanConfig = false;
  }

}
