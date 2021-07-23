import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configurar-envios-aliado',
  templateUrl: './configurar-envios-aliado.component.html',
  styleUrls: ['./configurar-envios-aliado.component.scss'],
})
export class ConfigurarEnviosAliadoComponent {
  constructor(
    private cd: ChangeDetectorRef
  ) { }

  /**
 * Aliado
 */
  private selectedAlly;
  private selectedCountry: any;
  private selectedCompany;

  /**
  * Mensajes para textBox component
  */
  descriptionText: String = 'Herramienta que permite habilitar e inhabilitar tanto comercio como un fabricante y sobre este último, activar los socios comerciales y las referencias del cátalogo de productos para el envío de la metadata de ventas para inventarios al aliado';

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

  /**
   * Guardar configuraciones
   */
  private saveConfig;

  /**
   * Condicional de registro
   */
  hasRegistry: any;
  hasUploadedFile: boolean;
  hasSelectedComercialPartners: boolean;

  isLoading: boolean;

  handleSearchAlly(allyId) {
    if (!!allyId) {
      this.selectedAlly = allyId;
    }
  }

  handleSearchCompany(companyId) {
    this.selectedCompany = companyId;
  }

  handleCancel(cancel) {
    if (cancel === true) {
      this.cleanConfig = true;
    }
  }

  handleSearchCountry(country) {
    this.isLoading = true;
    switch (country) {
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

  /**
   * @param hasRegistry boolean que confirma si hay registro seleccionado
   */
  handleRegistry(hasRegistry) {
    if (hasRegistry.hasRegistry === true) {
      this.hasRegistry = hasRegistry;
      // console.log(hasRegistry);
    }
  }

  handleComercialPartners(hasComercialPartners) {
    if (hasComercialPartners) {
      this.hasSelectedComercialPartners = true;
    }
  }

  handleUploadedfile(uploadedFile) {
    if (uploadedFile) {
      this.hasUploadedFile = true;
    }
  }

  handleSave() {
    console.log(this.saveConfig);
    this.saveConfig = true;
  }

  handleWasSaved(saved) {
    if(saved){
      this.saveConfig = false;
    }
  }

  handleReset() {
    setTimeout(() => {
      this.cleanConfig = false;
    }, 1000);
  }

}
