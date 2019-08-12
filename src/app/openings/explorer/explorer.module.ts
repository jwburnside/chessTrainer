import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule, IonRadioGroup } from '@ionic/angular';
import { ChessboardComponent } from '../../chessboard';


import { ExplorerPage } from './explorer.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorerPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), FormsModule],
  declarations: [ExplorerPage, ChessboardComponent, FormGroupDirective],
  providers: [FormBuilder, IonRadioGroup]

})
export class ExplorerPageModule {}
