import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { ConfigurarAliadosComponent } from './configurar-aliados/configurar-aliados.component';
import { SearchCreateAllyComponent } from '../components/search-create-ally/search-create-ally.component';
import { ResultsTableComponent } from '../components/results-table/results-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TextBoxComponent } from '../components/text-box/text-box.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuditAllyComponent } from '../components/audit-ally/audit-ally.component';
import { ConfigurarEnviosAliadoComponent } from './configurar-envios-aliado/configurar-envios-aliado.component';
import { ConfigTabsComponent } from '../components/config-tabs/config-tabs.component';
import { AuditConfigComponent } from '../components/audit-config/audit-config.component';
import { UploadMasterFileComponent } from '../components/upload-master-file/upload-master-file.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';
import { SerchCompanyComponent } from '../components/serch-company/serch-company.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { ModalFormComponent } from '../components/modal-form/modal-form.component';


@NgModule({
  declarations: [
    ConfigurarAliadosComponent,
    ResultsTableComponent,
    SearchCreateAllyComponent,
    TextBoxComponent,
    AuditAllyComponent,
    AuditConfigComponent,
    ConfigurarEnviosAliadoComponent,
    ConfigTabsComponent,
    UploadMasterFileComponent,
    TrazabilidadComponent,
    SerchCompanyComponent,
    NavigationComponent,
    ModalFormComponent
  ],
  entryComponents: [
    ModalFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    PageRoutingModule
  ],
})
export class PageModule { }
