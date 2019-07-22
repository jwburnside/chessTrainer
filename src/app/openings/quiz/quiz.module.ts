import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule, IonRadioGroup } from '@ionic/angular';
import { ChessboardComponent } from '../../chessboard';


import { QuizPage } from './quiz.page';

const routes: Routes = [
  {
    path: '',
    component: QuizPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), FormsModule],
  declarations: [QuizPage, ChessboardComponent, FormGroupDirective],
  providers: [FormBuilder, IonRadioGroup]

})
export class QuizPageModule {}
