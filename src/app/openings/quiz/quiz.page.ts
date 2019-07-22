import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChessboardComponent } from '../../chessboard';
import { timer } from 'rxjs';



@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss']
})
export class QuizPage implements OnInit {

  public currentPgn: Array<string> = [];
  public showNavPrev = false;
  public showNavNext = false;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(2000, 1000);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor() {}

  ngOnInit() {
    this.currentPgn = [
      '[Event "Ruy Lopez Opening: Morphy Defense, Closed"]',
      '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7'
    ];

    this.chessboard.buildPgn(this.currentPgn);
  }

  reset() {
    this.chessboard.showFirstPosition();
  }

  showNextPosition() {
    this.chessboard.showNextPosition();
  }

  showPreviousPosition() {
    this.chessboard.showPreviousPosition();
  }

  startMoving() {

    // TODO: Can you load the PGN here? That should start the board off from scratch.

    this.showNextPosition();
    this.subscription = this.timer$.subscribe(result => {
      this.showNextPosition();
    });
  }

  stopMoving() {
    this.subscription.unsubscribe();
  }

}
