import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { BoardControlModule } from '../../components/board-control/board-control.module';
import { SharedModule } from '../../shared';

import { QuizPage } from './quiz.page';

const routes: Routes = [
  {
    path: '',
    component: QuizPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), ReactiveFormsModule, BoardControlModule, FormsModule],
  declarations: [QuizPage]
})
export class QuizPageModule {}
