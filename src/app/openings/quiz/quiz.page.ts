import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { ChessboardComponent } from '../../chessboard';
import { timer } from 'rxjs';
import { shuffle } from 'lodash';
import { ChessHeader } from '../../models/chess-header';
import { MultipleChoiceCard } from '../../models/multiple-choice-card';

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
  shouldDisplayAnswer: boolean = false;
  multipleChoiceCard: MultipleChoiceCard;
  multipleChoiceForm: FormGroup;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, 1000);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor(public formBuilder: FormBuilder) {
    this.multipleChoiceForm = this.formBuilder.group(
        {}
    );
  }

  ngOnInit() {
    // TODO: Make sure you check these.
    // Only go as deep as the named opening. "Four Knights Game: Double Spanish Variation, 5.O-O O-O" should end with the 4th move, etc.
    this.pgns.push(['[OpeningName "Ruy Lopez Opening: Morphy Defense, Closed"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7']);
    this.pgns.push(['[OpeningName "Giuoco Piano Game: Center Attack, 5...exd4"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4']);
    this.pgns.push(['[OpeningName "Italian Game: Two Knights Defense, 5...exd4"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6']);
    this.pgns.push([
      '[OpeningName "Four Knights Game: Double Spanish Variation, 5.O-O O-O"]',
      '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bb4 5.O-O O-O'
    ]);
    this.loadRandomOpening();
    this.chessHeader = this.chessboard.getChessHeader();
    this.buildMultipleChoiceCard();
  }

  buildBoardForPgn(position: number) {
    this.chessboard.buildPgn(this.pgns[position]);
  }

  buildMultipleChoiceCard() {
    const tempAnswersArray: Array<string> = ['Answer A', 'Answer B', 'Answer C', 'Answer D'];
    tempAnswersArray.push(this.chessHeader.openingName);
    this.multipleChoiceCard = shuffle(new MultipleChoiceCard(tempAnswersArray, this.chessHeader.openingName));
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

  disableButtons() {
    // TODO: This is where ngrx would be helpful. There are several buttons which must be enabled/disabled depending on a particular state.
  }

  loadNextOpening() {
    if (this.currentPgnsPosition < this.pgns.length) {
      this.currentPgnsPosition++;
    }
    this.chessboard.buildPgn(this.pgns[this.currentPgnsPosition]);
  }

  loadPreviousOpening() {}

  loadRandomOpening() {
    this.chessboard.buildPgn(shuffle(this.pgns)[0]);
    if (shuffle([0, 1])[0] === 0) {
      this.flipBoard();
    }
  }

  answerSelected() {

  }

  displayAnswer() {
    this.shouldDisplayAnswer = true;
  }

  flipBoard() {
    this.chessboard.flip();
  }

}
