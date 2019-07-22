import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChessboardComponent, ChessHeader } from '../../chessboard';
import { timer } from 'rxjs';
import { shuffle } from 'lodash';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss']
})
export class QuizPage implements OnInit {
  currentPgnsPosition = 0;
  pgns: Array<Array<string>> = [];
  showNavPrev: boolean = false;
  showNavNext: boolean = false;
  chessHeader: ChessHeader;
  displayHeader: boolean = true;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, 1000);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor() {}

  ngOnInit() {
    // TODO: Make sure you check these.
    this.pgns.push(['[Event "Ruy Lopez Opening: Morphy Defense, Closed"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7']);
    this.pgns.push(['[Event "Giuoco Piano Game: Center Attack, 5...exd4"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4']);
    this.pgns.push(['[Event "Italian Game: Two Knights Defense, 5...exd4"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6']);
    this.pgns.push(['[Event "Four Knights Game: Double Spanish Variation, 5.O-O O-O"]', '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bb4 5.O-O O-O']);
    this.buildBoardForPgn(this.currentPgnsPosition);
    this.chessHeader = this.chessboard.getChessHeader();
  }

  buildBoardForPgn(position: number) {
    this.chessboard.buildPgn(this.pgns[position]);
  }

  public reset() {
    this.chessboard.showFirstPosition();
  }

  public showNextPosition() {
    this.chessboard.showNextPosition();
  }

  showPreviousPosition() {
    this.chessboard.showPreviousPosition();
  }

  startMoving() {
    this.subscription = this.timer$.subscribe(result => {
      if (!this.chessboard.isShowingLatestPosition()) {
        this.showNextPosition();
      } else {
        this.stopMoving();
      }
    });
  }

  stopMoving() {
    this.subscription.unsubscribe();
  }

  disableButtonsForMoving() {}

  loadNextOpening() {
    if (this.currentPgnsPosition < this.pgns.length) {
      this.currentPgnsPosition++;
    }
    this.chessboard.buildPgn(this.pgns[this.currentPgnsPosition]);
  }

  loadPreviousOpening() {}

  getRandomOpening() {
    this.chessboard.buildPgn(shuffle(this.pgns)[0]);
    if (shuffle([0, 1])[0] === 0) {
      this.flipBoard();
    }
  }

  flipBoard() {
    this.chessboard.flip();
  }

  getHeaderValue(key: string) {
    return JSON.stringify(this.chessboard.getHeaderValue(key));
  }
}
