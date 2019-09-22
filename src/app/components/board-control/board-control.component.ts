import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { random } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { ChessboardComponent } from '../../chessboard';
import { ExerciseTypeConstants } from '../../constants/exercise-type-constants';
import { PgnLoaderService } from '../../services/pgn-loader.service';
import ExerciseType = ExerciseTypeConstants.ExerciseType;

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
  @Input()
  filename: string;

  @Input()
  exerciseType: ExerciseType;

  readonly exerciseTypeEnums = ExerciseTypeConstants.ExerciseType;
  moveInterval = 1000;
  shouldDisableStartButton = false;
  isFirstOpeningLoaded = false;
  currentGameIndex = 0;
  currentGameHeader: any;
  loadedGames: Array<string> = [];
  shouldDisplayCorrectAnswer: boolean;
  correctAnswer: string;
  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, this.moveInterval);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor(private toastCtrl: ToastController, private pgnLoaderService: PgnLoaderService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pgnLoaderService.loadPgnFromAssets(this.filename).subscribe(
      loadedGames => {
        this.loadedGames = loadedGames;
        this.loadRandomGame();
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
    this.startMoving();
  }

  loadGameAtCurrentIndex() {
    this.chessboard.buildPgn(this.loadedGames[this.currentGameIndex]);
    this.currentGameHeader = JSON.stringify(this.chessboard.getHeader()['OpeningName']);
    if (this.currentGameHeader === undefined) {
      this.currentGameHeader = JSON.stringify(this.chessboard.getHeader()['Event']);
    }
  }

  // TODO: These methods should fire outputs, let the container handle the behavior.
  handleRewindClicked() {
    this.chessboard.showPreviousPosition();
    this.cdRef.detectChanges();
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
    this.cdRef.detectChanges();
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
  }

  handleReloadClicked() {
    this.chessboard.showFirstPosition();
    this.startMoving();
  }

  getHeader(): string {
    return this.chessboard.getHeader();
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

  get commentForPosition() {
    return this.chessboard.getCommentForPosition();
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
