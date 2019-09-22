import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { random } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { ChessboardComponent } from '../../chessboard';
import { PgnFilenameConstants } from '../../constants/pgn-filename-constants';
import { PgnLoaderService } from '../../services/pgn-loader.service';

/**
 * Manages the display of the appropriate controls required for the selected exercise. For example:
 * 1). Openings quiz displays play, reload, skip-forward and skip-backward buttons.
 * 2). Book Explorer displays rewind, skip-backward, fast-forward, skip-forward, reload, and help.
 * You should rename the button handling to handleSkipForward(), etc, and modify the behavior based on the exercise.
 */

@Component({
  selector: 'app-board-control',
  templateUrl: './board-control.component.html',
  styleUrls: ['./board-control.component.scss']
})
export class BoardControlComponent implements OnInit {
  moveInterval = 1000;

  shouldDisableStartButton = false;
  isFirstOpeningLoaded = false;
  currentGameIndex = 0;
  // TODO: This can probably be string.
  currentGameHeader: any;
  currentComment: string;
  loadedGames: Array<string> = [];
  shouldDisplayCorrectAnswer: boolean;
  correctAnswer: string;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, this.moveInterval);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor(private toastCtrl: ToastController, private pgnLoaderService: PgnLoaderService) {}

  ngOnInit(): void {
    this.pgnLoaderService.loadPgnFromAssets(PgnFilenameConstants.OPENINGS_LEVEL_1).subscribe(
      loadedGames => {
        this.loadedGames = loadedGames;
        this.loadRandomGame();
        this.startMoving();
      },
      err => {
        console.log('err: ' + JSON.stringify(err.message));
      }
    );
  }

  loadRandomGame() {
    this.randomizeCurrentGameIndex();
    this.loadGameAtCurrentIndex();
    this.randomizeBoardOrientation();
  }

  loadGameAtCurrentIndex() {
    this.chessboard.buildPgn(this.loadedGames[this.currentGameIndex]);
    this.currentGameHeader = JSON.stringify(this.chessboard.getHeader()['OpeningName']);
    if (this.currentGameHeader === undefined) {
      this.currentGameHeader = JSON.stringify(this.chessboard.getHeader()['Event']);
    }
  }

  // TODO: These behaviors should be modified based on the exercise.
  handleRewindClicked() {
    this.chessboard.showPreviousPosition();
    // TODO: This can be moved to chessboard
    this.setCurrentComment();
  }

  handleSkipBackwardClicked() {
    this.shouldDisplayCorrectAnswer = false;
    if (this.currentGameIndex > 0) {
      this.currentGameIndex--;
      this.loadGameAtCurrentIndex();
    }
  }

  handleFastForwardClicked() {
    this.chessboard.showNextPosition();
    // this.setCurrentComment();
  }

  handleSkipForwardClicked() {
    this.shouldDisplayCorrectAnswer = false;
    if (this.currentGameIndex < this.loadedGames.length) {
      this.currentGameIndex++;
      this.loadGameAtCurrentIndex();
    }
  }

  randomizeCurrentGameIndex() {
    this.currentGameIndex = random(0, this.loadedGames.length - 1);
  }

  randomizeBoardOrientation() {
    this.chessboard.flipRandom();
  }

  handleShuffleClicked() {
    this.loadRandomGame();
    this.startMoving();
  }

  handleReloadClicked() {
    this.chessboard.showFirstPosition();
    this.startMoving();
  }

  getHeader(): string {
    return this.chessboard.getHeader();
  }

  setCurrentComment(): string {
    return this.chessboard.getCommentForPosition();
  }

  flipBoard() {
    this.chessboard.flip();
  }

  startMoving() {
    this.shouldDisplayCorrectAnswer = false;
    this.shouldDisableStartButton = true;
    this.subscription = this.timer$.subscribe(result => {
      if (!this.chessboard.isShowingLastPosition()) {
        this.handleFastForwardClicked();
      } else {
        this.stopMoving();
      }
    });
  }

  async displayAnswer() {
    this.shouldDisplayCorrectAnswer = true;
  }

  stopMoving() {
    this.subscription.unsubscribe();
    this.shouldDisableStartButton = false;
    this.isFirstOpeningLoaded = true;
  }
}
