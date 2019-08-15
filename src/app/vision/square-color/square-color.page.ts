import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as Chess from 'chess.js';
import { sample } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-square-color',
  templateUrl: './square-color.page.html',
  styleUrls: ['./square-color.page.scss']
})
export class SquareColorPage {
  readonly squareColors: Array<string> = ['light', 'dark'];

  chess: Chess = new Chess();
  exerciseStarted = false;
  buttonsDisabled = false;
  currentSquare: string;
  totalAnsweredCount = 0;
  rightAnswerCount = 0;
  wrongAnswerCount = 0;

  nextQuestionInterval = 1000;
  totalExerciseTimeInSeconds = 60;

  loadSquareSubscription: Subscription;
  loadSquareTimer$: Observable<number> = timer(100, this.nextQuestionInterval);
  countdownSubscription: Subscription;
  countdownTimer$: Observable<number> = timer(0, 1000);

  squareGroups: Array<SquareGroup> = [];
  selectedSquareGroups: Array<SquareGroup> = [];

  constructor(private alertController: AlertController) {
    this.loadSquareGroups();
  }

  loadSquareGroups() {
    // The 8 ranks
    this.squareGroups.push(new SquareGroup('a1-h1', ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1']));
    this.squareGroups.push(new SquareGroup('a2-h2', ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2']));
    this.squareGroups.push(new SquareGroup('a3-h3', ['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3']));
    this.squareGroups.push(new SquareGroup('a4-h4', ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4']));
    this.squareGroups.push(new SquareGroup('a5-h5', ['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5']));
    this.squareGroups.push(new SquareGroup('a6-h6', ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6']));
    this.squareGroups.push(new SquareGroup('a7-h7', ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7']));
    this.squareGroups.push(new SquareGroup('a8-h8', ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']));

    // The 8 files
    this.squareGroups.push(new SquareGroup('a1-a8', ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8']));
    this.squareGroups.push(new SquareGroup('b1-b8', ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8']));
    this.squareGroups.push(new SquareGroup('c1-c8', ['c1', 'c2', 'c3', 'c4', 'c5', 'd6', 'c7', 'c8']));
    this.squareGroups.push(new SquareGroup('d1-d8', ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8']));
    this.squareGroups.push(new SquareGroup('e1-e8', ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8']));
    this.squareGroups.push(new SquareGroup('f1-f8', ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8']));
    this.squareGroups.push(new SquareGroup('g1-g8', ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8']));
    this.squareGroups.push(new SquareGroup('h1-h8', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8']));
  }

  toggleExercise() {
    this.exerciseStarted = !this.exerciseStarted;
    if (this.exerciseStarted) {
      this.selectRandomSquareFromSquareGroups();
      this.countdownSubscription = this.countdownTimer$.subscribe(result => {
        if (this.totalExerciseTimeInSeconds !== 0) {
          this.totalExerciseTimeInSeconds--;
        } else {
          this.countdownSubscription.unsubscribe();
          this.endExercise();
        }
      });
    } else {
      this.endExercise();
    }
  }

  handleSquareGroupSelected(event: any) {
    const squareGroupNames: Array<string> = event.detail.value;
    this.selectedSquareGroups = this.getSquareGroupsByNames(squareGroupNames);
  }

  getSquareGroupsByNames(squareGroupNames: Array<string>): Array<SquareGroup> {
    const selectedSquareGroups: Array<SquareGroup> = [];
    for (const squareGroupName of squareGroupNames) {
      selectedSquareGroups.push(this.squareGroups.find(sg => sg.name === squareGroupName));
    }
    return selectedSquareGroups;
  }

  selectRandomSquareFromSquareGroups() {
    const selectedSquareGroup: SquareGroup = sample(this.selectedSquareGroups);
    this.currentSquare = sample(selectedSquareGroup.squarePool);
  }

  evaluateAnswer(answer: string) {
    this.buttonsDisabled = true;
    this.totalAnsweredCount++;

    const squareColor: string = this.chess.square_color(this.currentSquare);
    if (squareColor === answer) {
      this.rightAnswerCount++;
      this.buttonsDisabled = false;
      this.selectRandomSquareFromSquareGroups();
    } else {
      this.endExercise();
    }

    this.loadSquareSubscription = this.loadSquareTimer$.subscribe(result => {
      this.buttonsDisabled = false;

      this.loadSquareSubscription.unsubscribe();
    });
  }

  async endExercise() {
    this.countdownSubscription.unsubscribe();

    // TODO: Need to force a button press on this (disable close on click-outside)
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
    this.rightAnswerCount = 0;
    this.totalExerciseTimeInSeconds = 60;
  }
}

export class SquareGroup {
  name: string;
  squarePool: Array<string> = [];
  constructor(name: string, squarePool: Array<string>) {
    this.name = name;
    this.squarePool = squarePool;
  }
}
