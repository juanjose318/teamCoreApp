import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurarAliadosComponent } from './configurar-aliados/configurar-aliados.component';
import { ConfigurarEnviosAliadoComponent } from './configurar-envios-aliado/configurar-envios-aliado.component';
import { TrazabilidadComponent } from './trazabilidad/trazabilidad.component';

const routes: Routes = [
  {
    path: 'configurar-aliado',
    component: ConfigurarAliadosComponent
  },
  {
    path: 'configurar-envios-aliado',
    component: ConfigurarEnviosAliadoComponent
  },
  {
    path: 'trazabilidad',
    component: TrazabilidadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
