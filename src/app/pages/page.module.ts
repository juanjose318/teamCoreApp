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


@NgModule({
  declarations: [
    ConfigurarAliadosComponent,
    ResultsTableComponent,
    SearchCreateAllyComponent,
    TextBoxComponent,
    AuditAllyComponent,

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
