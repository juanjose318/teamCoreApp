import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Material Module
 */
import { MaterialModule } from '../shared/modules/material.module';
/**
 * Componentes
 */
import { TextBoxComponent } from '../components/text-box/text-box.component';
import { ConfigurarAliadosComponent } from './configurar-aliados/configurar-aliados.component';
import { SearchCreateAllyComponent } from '../components/search-create-ally/search-create-ally.component';
import { ResultsTableComponent } from '../components/results-table/results-table.component';
import { ModalDescriptionComponent } from '../components/modal-description/modal-description.component';
import { TableOverviewComponent } from '../components/table/table-overview.component';
import { ConfigurarEnviosAliadoComponent } from './configurar-envios-aliado/configurar-envios-aliado.component';
import { ConfigTabsComponent } from '../components/config-tabs/config-tabs.component';
import { AuditConfigComponent } from '../components/audit-config/audit-config.component';
import { UploadMasterFileComponent } from '../components/upload-master-file/upload-master-file.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { ModalAllyFormComponent } from '../components/modal-ally-form/modal-ally-form.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { ModalConfigFormComponent } from '../components/modal-config-form/modal-config-form.component';
import { SecondStepTableComponent } from '../components/table-second-step/table-second-step.component';
import { SearchTraceComponent } from '../components/search-trace/search-trace.component';
import { TraceTableComponent } from '../components/trace-table/trace-table.component';

@NgModule({
  declarations: [
    ConfigurarAliadosComponent,
    ResultsTableComponent,
    SearchCreateAllyComponent,
    TextBoxComponent,
    AuditConfigComponent,
    ConfigurarEnviosAliadoComponent,
    ConfigTabsComponent,
    UploadMasterFileComponent,
    TrazabilidadComponent,
    NavigationComponent,
    ModalAllyFormComponent,
    ModalDescriptionComponent,
    TableOverviewComponent,
    SidebarComponent,
    ModalConfigFormComponent,
    SecondStepTableComponent,
    SearchTraceComponent,
    TraceTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    PageRoutingModule,
    MaterialModule

  ],
  entryComponents: [
    ModalAllyFormComponent,
    ModalDescriptionComponent,
    ModalConfigFormComponent
  ],
})
export class PageModule { }
