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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


/**
 * Angular material Nodules
 */
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalDescriptionComponent } from '../components/modal-description/modal-description.component';
import { DataTablesModule } from 'angular-datatables';
import { TableOverviewComponent } from '../components/table/table-overview.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { sidebarComponent } from '../shared/sidebar/sidebar.component';


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
    ModalFormComponent,
    ModalDescriptionComponent,
    TableOverviewComponent,
    sidebarComponent
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
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule,
    DataTablesModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    ModalFormComponent,
    ModalDescriptionComponent
  ],
})
export class PageModule { }
