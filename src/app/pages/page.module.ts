import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRoutingModule } from './page-routing.module';
import { ConfigurarAliadosComponent } from './configurar-aliados/configurar-aliados.component';
import { SearchCreateAllyComponent } from '../components/search-create-ally/search-create-ally.component';
import { ResultsTableComponent } from '../components/results-table/results-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TextBoxComponent } from '../components/text-box/text-box.component';

@NgModule({
  declarations: [
    ConfigurarAliadosComponent,
    ResultsTableComponent,
    SearchCreateAllyComponent,
    TextBoxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    PageRoutingModule
  ]
})
export class PageModule { }
