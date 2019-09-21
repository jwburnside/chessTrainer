import { Component, OnInit, ViewChild } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { ToastController } from '@ionic/angular';
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

      // this.pgnLoaderService.test(PgnFilenameConstants.LOGICAL_CHESS);
        // this.pgnLoaderService.loadPgnFromAssets(PgnFilenameConstants.LOGICAL_CHESS);
      this.pgnLoaderService.loadPgnFromAssets(PgnFilenameConstants.LOGICAL_CHESS).subscribe(loadedGames => {

      this.loadedGames = loadedGames;
      console.log('loadedGames: ' + JSON.stringify(this.loadedGames));
      this.loadGameAndHeader();
    }, err => {
      console.log('err: ' + JSON.stringify(err.message));
    });
  }


  loadGameAndHeader() {
    this.chessboard.buildPgn(this.loadedGames[this.currentGameIndex]);
    this.currentGameHeader = JSON.stringify(this.chessboard.getHeader()['Event']);
    console.log('currentGameHeader: ' + this.currentGameHeader);
  }

  // TODO: These behaviors should be modified based on the exercise.
  handleRewindClicked() {
    this.chessboard.showPreviousPosition();
    // TODO: This can be moved to chessboard
    this.setCurrentComment();
  }

  handleSkipBackwardClicked() {
    if (this.currentGameIndex > 0) {
      this.currentGameIndex--;
      this.loadGameAndHeader();
    }
  }

  handleFastForwardClicked() {
    this.chessboard.showNextPosition();
    // this.setCurrentComment();
  }

  handleSkipForwardClicked() {
    if (this.currentGameIndex < this.loadedGames.length) {
      this.currentGameIndex++;
      this.loadGameAndHeader();
    }
  }

  handleReloadClicked() {
    this.chessboard.showFirstPosition();
  }


  getHeader(): string {
    return this.chessboard.getHeader();
  }

  setCurrentComment(): string {
    return this.chessboard.getCommentForPosition();
  }

  // TODO: Need a flip board button
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
    const toast = await this.toastCtrl.create({
      message: this.correctAnswer,
      duration: 2000
    });
    toast.present();
  }

  stopMoving() {
    this.subscription.unsubscribe();
    this.shouldDisableStartButton = false;
    this.isFirstOpeningLoaded = true;
  }
}
