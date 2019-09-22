import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { IonicModule } from '@ionic/angular';
import { ChessboardComponent } from '../../chessboard';
import { BoardControlComponent } from './board-control.component';

@NgModule({
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [ChessboardComponent, BoardControlComponent],
  exports: [BoardControlComponent],
  providers: [File, FileOpener]
})
export class BoardControlModule {}
