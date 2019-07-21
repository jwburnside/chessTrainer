import { Component, OnInit, ViewChild } from '@angular/core';
import { ChessboardComponent } from '../chessboard';
import { EndgameDatabaseService, EndgameDatabase, Category, Subcategory, Position, MiscService, ConfigurationService, Configuration } from '../shared';


@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  private position: Position;
  public showNavPrev = false;
  public showNavNext = false;

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor() { }

  ngOnInit() {
    this.position = {target: 'checkmate', fen: '2k5/8/5K2/8/8/8/2P5/8 w - - 0 1', record: 0};
    this.chessboard.build(this.position.fen, this.position.target);

  }

  gotoPrev() {

  }

  gotoNext() {

  }

}
