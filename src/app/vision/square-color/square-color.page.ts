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

  loadSquareSubscription: Subscription;
  loadSquareTimer$: Observable<number> = timer(1000, this.nextQuestionInterval);

  countdownSubscription: Subscription;
  countdownTimer$: Observable<number> = timer(0, 1000);

  levels: Array<string> = ['Top/Bottom Squares', 'Side Squares', 'All Edge Squares'];
  squarePool: Array<number> = [];

  constructor() {}

  ngOnInit() {}

  startExercise() {
    this.setCurrentLevel();
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

  setCurrentLevel(): string {
    switch (this.totalAnsweredCount) {
      case 0:
        this.squarePool = this.squarePool.concat(this.getBottomRankSquareIndexes());
        break;
      case 20:
        this.squarePool = this.squarePool.concat(this.getTopRankSquareIndexes());
        break;
      case 40:
        this.squarePool = this.squarePool.concat(this.getLeftSquareIndexes());
        break;
      case 60:
        this.squarePool = this.squarePool.concat(this.getRightSquareIndexes());
        break;
    }
  }

  get currentLevelString(): string {
    return this.levels[this.levelProgress];
  }

  getTopRankSquareIndexes(): Array<number> {
    return [57, 58, 59, 60, 61, 62, 63, 64];
  }

  getBottomRankSquareIndexes(): Array<number> {
    return [0, 1, 2, 3, 4, 5, 6, 7];
  }

  getLeftSquareIndexes(): Array<number> {
    return [8, 16, 24, 32, 40, 48, 56];
  }

  getRightSquareIndexes(): Array<number> {
    return [15, 23, 31, 39, 47, 55, 63];
  }

  loadRandomSquare() {
    this.currentSquareIndex = sample(this.squarePool);
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

    this.setCurrentLevel();


    this.loadSquareSubscription = this.loadSquareTimer$.subscribe(result => {
      this.buttonsDisabled = false;
      this.loadRandomSquare();
      this.loadSquareSubscription.unsubscribe();
    });
  }

  endExercise() {}

  get currentSquare(): string {
    return GeneralConstants.SQUARES[this.currentSquareIndex];
  }

  get isEvenRank() {
    const i = this.currentSquareIndex;
    return inRange(i, 8) || inRange(i, 16, 24) || inRange(i, 32, 40) || inRange(i, 48, 56);
  }
}
