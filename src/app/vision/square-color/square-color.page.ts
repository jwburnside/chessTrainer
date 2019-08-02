import { Component, OnInit } from '@angular/core';
import { random, inRange, sample } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { GeneralConstants } from '../../constants/general-constants';

@Component({
  selector: 'app-square-color',
  templateUrl: './square-color.page.html',
  styleUrls: ['./square-color.page.scss']
})
export class SquareColorPage implements OnInit {
  exerciseStarted = false;
  buttonsDisabled = false;
  currentSquareIndex: number;
  answerStr: string;
  nextQuestionInterval = 1000;
  totalExerciseTimeInSeconds = 10;
  totalAnsweredCount = 0;
  wrongCount = 0;

  private loadSquareSubscription: Subscription;
  private loadSquareTimer$: Observable<number> = timer(1000, this.nextQuestionInterval);

  private countdownSubscription: Subscription;
  private countdownTimer$: Observable<number> = timer(0, 1000);

  constructor() {}

  ngOnInit() {}

  startExercise() {
    this.exerciseStarted = true;
    this.countdownSubscription = this.countdownTimer$.subscribe(result => {
      if (this.totalExerciseTimeInSeconds !== 0) {
        this.totalExerciseTimeInSeconds--;
      } else {
        this.countdownSubscription.unsubscribe();
      }
    });

    this.loadRandomSquare();
  }

  getTopAndBottomSquareIndexes() {
    const sideSquares = [];
    return sideSquares.concat([0, 1, 2, 3, 4, 5, 6, 7]) // Bottom rank
        .concat([57, 58, 59, 60, 61, 62, 63, 64]); // Top rank
  }

  getLeftAndRightSquareIndexes(): Array<number> {
    const sideSquares = [];
    return sideSquares
        .concat([8, 16, 24, 32, 40, 48, 56]) // Left file
        .concat([15, 23, 31, 39, 47, 55, 63]); // Right file
  }

  // TODO: Let's serve these choices as openings. At the end of the opening, ask the user to name it.
  getAllSidesSquareIndexes(): Array<number> {
    const sideSquares = [];
    return sideSquares.concat([0, 1, 2, 3, 4, 5, 6, 7]) // Bottom rank
        .concat([8, 16, 24, 32, 40, 48, 56]) // Left file
        .concat([15, 23, 31, 39, 47, 55, 63]) // Right file
        .concat([57, 58, 59, 60, 61, 62, 63, 64]); // Top rank
  }

  loadRandomSquare() {

    this.currentSquareIndex = sample(this.getTopAndBottomSquareIndexes());
    this.answerStr = null;
  }

  evaluateAnswer(answer: number) {
    this.buttonsDisabled = true;
    this.totalAnsweredCount++;
    if (this.isEvenRank) {
      if (this.currentSquareIndex % 2 === answer) {
        this.answerStr = 'wrong';
        this.wrongCount++;
      } else {
        this.answerStr = 'right';
      }
    } else {
      if (this.currentSquareIndex % 2 === answer) {
        this.answerStr = 'right';
      } else {
        this.answerStr = 'wrong';
        this.wrongCount++;
      }
    }

    this.loadSquareSubscription = this.loadSquareTimer$.subscribe(result => {
      this.buttonsDisabled = false;
      this.loadRandomSquare();
      this.loadSquareSubscription.unsubscribe();
    });
  }

  endExercise() {

  }

  get currentSquare(): string {
    return GeneralConstants.SQUARES[this.currentSquareIndex];
  }

  get isEvenRank() {
    const i = this.currentSquareIndex;
    return inRange(i, 8) || inRange(i, 16, 24) || inRange(i, 32, 40) || inRange(i, 48, 56);
  }
}
