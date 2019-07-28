import { Component, OnInit } from '@angular/core';
import { random, inRange } from 'lodash';
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
  buttonsDisabled: false;
  currentSquareIndex: number;
  answerStr: string;
  nextQuestionInterval = 1000;
  totalExerciseTimeInSeconds = 10;
  totalAnsweredCount = 0;
  wrongCount = 0;

  private loadSquareSubscription: Subscription;
  private loadSquareTimer$: Observable<number> = timer(1000, 0, this.nextQuestionInterval);

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

    this.loadRandomSquareIndex();
  }

  loadRandomSquareIndex() {
    this.currentSquareIndex = random(GeneralConstants.SQUARES_2.length - 1);
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
      this.loadRandomSquareIndex();
      this.loadSquareSubscription.unsubscribe();
    });
  }

  endExercise() {

  }

  get currentSquare() {
    return GeneralConstants.SQUARES_2[this.currentSquareIndex];
  }

  get isEvenRank() {
    const i = this.currentSquareIndex;
    return inRange(i, 8) || inRange(i, 16, 24) || inRange(i, 32, 40) || inRange(i, 48, 56);
  }
}
