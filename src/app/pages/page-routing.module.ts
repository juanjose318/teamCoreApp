import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurarAliadosComponent } from './configurar-aliados/configurar-aliados.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurarAliadosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
