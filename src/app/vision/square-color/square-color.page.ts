import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { inRange, sample } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { GeneralConstants } from '../../constants/general-constants';

@Component({
  selector: 'app-square-color',
  templateUrl: './square-color.page.html',
  styleUrls: ['./square-color.page.scss']
})
export class SquareColorPage {
  exerciseStarted = false;
  buttonsDisabled = false;
  currentSquareIndex: number;
  totalAnsweredCount = 0;
  rightAnswerCount = 0;
  wrongAnswerCount = 0;

  nextQuestionInterval = 1000;
  totalExerciseTimeInSeconds = 60;

  loadSquareSubscription: Subscription;
  loadSquareTimer$: Observable<number> = timer(100, this.nextQuestionInterval);

  countdownSubscription: Subscription;
  countdownTimer$: Observable<number> = timer(0, 1000);

  levels: Array<string> = ['Bottom Squares', 'Top Squares', 'Left Squares', 'Right Squares', 'All Sides'];
  currentLevelString = this.levels[0];
  squarePool: Array<number> = [];

  constructor(private alertController: AlertController) {}

  loadExerciseType() {

  }

  toggleExercise() {
    this.setCurrentLevel();
    this.exerciseStarted = true;
    this.countdownSubscription = this.countdownTimer$.subscribe(result => {
      if (this.totalExerciseTimeInSeconds !== 0) {
        this.totalExerciseTimeInSeconds--;
      } else {
        this.countdownSubscription.unsubscribe();
        this.endExercise();
      }
    });

    this.loadRandomSquare();
  }

  setCurrentLevel() {
    switch (this.totalAnsweredCount) {
      case 0:
        this.squarePool = this.squarePool.concat(this.getBottomRankSquareIndexes());
        this.currentLevelString = this.levels[0];
        break;
      case 20:
        this.squarePool = this.squarePool = this.getTopRankSquareIndexes();
        this.currentLevelString = this.levels[1];
        break;
      case 40:
        this.squarePool = this.squarePool = this.getLeftSquareIndexes();
        this.currentLevelString = this.levels[2];
        break;
      case 60:
        this.squarePool = this.squarePool = this.getRightSquareIndexes();
        this.currentLevelString = this.levels[3];
        break;
    }
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
  }

  evaluateAnswer(answer: number) {
    this.buttonsDisabled = true;
    this.totalAnsweredCount++;
    if (this.isEvenRank) {
      if (this.currentSquareIndex % 2 === answer) {
        if (this.wrongAnswerCount === 2) {
          this.endExercise();
          return;
        } else {
          this.wrongAnswerCount++;
        }
      } else {
        this.rightAnswerCount++;
      }
    } else {
      if (this.currentSquareIndex % 2 !== answer) {
        if (this.wrongAnswerCount === 2) {
          this.endExercise();
          return;
        } else {
          this.wrongAnswerCount++;
        }
      } else {
        this.rightAnswerCount++;
      }
    }

    this.setCurrentLevel();

    this.loadSquareSubscription = this.loadSquareTimer$.subscribe(result => {
      this.buttonsDisabled = false;
      this.loadRandomSquare();
      this.loadSquareSubscription.unsubscribe();
    });
  }

  async endExercise() {
    this.countdownSubscription.unsubscribe();
    const alert = await this.alertController.create({
      header: 'Game Over',
      message: 'You got ' + this.rightAnswerCount.toString() + ' right!',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.resetGame();
          }
        }
      ]
    });

    await alert.present();
  }

  resetGame() {
    this.countdownSubscription = null;
    this.exerciseStarted = false;
    this.buttonsDisabled = false;
    this.totalAnsweredCount = 0;
    this.currentSquareIndex = 0;
    this.squarePool = [];
    this.totalExerciseTimeInSeconds = 60;
  }

  get currentSquare(): string {
    return GeneralConstants.SQUARES[this.currentSquareIndex];
  }

  get isEvenRank() {
    const i = this.currentSquareIndex;
    return inRange(i, 8) || inRange(i, 16, 24) || inRange(i, 32, 40) || inRange(i, 48, 56);
  }
}
