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
  selectedAlly;
  selectedCountry: any;
  selectedCompany;

  /**
  * Mensajes para textBox component
  */
  // tslint:disable-next-line: max-line-length
  descriptionText: String = 'Herramienta que permite habilitar e inhabilitar tanto comercio como un fabricante y sobre este último, activar los socios comerciales y las referencias del catálogo de productos para el envío de la metadata de ventas para inventarios al aliado';

  /**
   * Conficional para Saber si se trata de la pantalla configurar envios de aliado
   */
  configInfoSending = true;

  /**
  * tableNumber define desde que componente se va a reutilizar la tabla de display de informacion
  */
  tableNumber = 1;

  /**
  * Auditoria
  */
  audit: any;
  auditSub: Subscription;

  /**
   * Coleccion
   */
  allyCollection;
  companyCollection;

  /**
   * Reset de configuracion
   */
  cleanConfig;

  /**
   * Guardar configuraciones
   */
  saveConfig;

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

  handleSave(save) {
    if (save ) {
      this.saveConfig = true;
    }
  }

  handleWasSaved(saved) {
    if (saved) {
        this.saveConfig = false;
    } else {
      this.saveConfig = false;
    }
  }

  handleReset() {
    setTimeout(() => {
      this.cleanConfig = false;
    }, 1000);
  }

}
