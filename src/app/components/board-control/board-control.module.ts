import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChessboardComponent } from '../../chessboard';
import { BoardControlComponent } from './board-control.component';

@NgModule({
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  declarations: [ChessboardComponent, BoardControlComponent],
  exports: [BoardControlComponent],

})
export class BoardControlModule {}
