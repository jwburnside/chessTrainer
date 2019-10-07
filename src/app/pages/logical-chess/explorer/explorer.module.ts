import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BoardControlModule } from '../../../components/board-control/board-control.module';

import { ExplorerPage } from './explorer.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorerPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), BoardControlModule],
  declarations: [ExplorerPage]
})
export class ExplorerPageModule {}
