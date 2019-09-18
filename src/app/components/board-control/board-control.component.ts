import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform, ToastController } from '@ionic/angular';
import * as Chess from 'chess.js';
import { sampleSize } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { ChessboardComponent } from '../../chessboard';
import { ChessHeader } from '../../models/chess-header';
import { MultipleChoiceCard } from '../../models/multiple-choice-card';
import { MultipleChoiceItem } from '../../models/multiple-choice-item';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-board-control',
  templateUrl: './board-control.component.html',
  styleUrls: ['./board-control.component.scss']
})
export class BoardControlComponent implements OnInit {
  orientation = 'flip';
  moveInterval = 1000;
  multipleChoiceItemCount = 4;
  selectedIndex: number;
  pgns: Array<Array<string>> = [];
  shouldDisableStartButton = false;
  isFirstOpeningLoaded = false;
  multipleChoiceCard: MultipleChoiceCard;
  multipleChoiceForm: FormGroup;

  shouldDisplayCorrectAnswer: boolean;
  correctAnswer: string;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, this.moveInterval);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor(public formBuilder: FormBuilder, private toastCtrl: ToastController, private file: File) {
    this.multipleChoiceForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.loadPgns();
    this.chessboard.buildStartPosition();
    this.readPgn();
  }

  readPgn() {
    const fileName = 'logical_chess.pgn';
    const ROOT_DIRECTORY = this.file.applicationStorageDirectory;
    const downloadDirectoryName = 'tempDownloadDirectory';

    // Create a folder in memory location
    this.file
      .createDir(ROOT_DIRECTORY, downloadDirectoryName, true)
      .then(entry => {
        this.file.resolveDirectoryUrl(entry.toURL()).then(
          directoryEntry => {
            directoryEntry.getFile(fileName, { create: true, exclusive: false }, function(fileEntry) {
              console.log('fileEntry: ' + JSON.stringify(fileEntry));

              fileEntry.file(function(file) {
                const reader = new FileReader();
                reader.onloadend = function() {
                  console.log('Successful file read: ' + this.result);
                };

                reader.readAsText(file);
              }); // Need error handler
            }); // Need error handler
          },
          err => {
            // Handle error
          }
        );
      })
      .catch(error => {
        alert('2 error' + JSON.stringify(error));
      });
  }

  loadPgns() {
    // e4
    // this.pgns.push(['[OpeningName "Sicilian Defense"]', '1.e4 {This is a comment} c5']);
    // this.pgns.push(['[OpeningName "French Defense"]', '1.e4 e6']);
    // this.pgns.push(['[OpeningName "Ruy Lopez Opening"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5']);
    // this.pgns.push(['[OpeningName "Caro-Kann Defense"]', '1.e4 c6']);
    // this.pgns.push(['[OpeningName "Italian Game"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4']);
    // this.pgns.push(['[OpeningName "Sicilian Defense: Closed"]', '1.e4 c5 2.Nc3']);
    // this.pgns.push(['[OpeningName "Scandinavian Defense"]', '1.e4 d5']);
    // this.pgns.push(['[OpeningName "Pirc Defense: 2.d4 Nf6"]', '1.e4 d6 2.d4 Nf6']);
    // this.pgns.push(['[OpeningName "Sicilian Defense: Alapin Variation"]', '1.e4 c5 2.c3']);
    // this.pgns.push(['[OpeningName "Alekhine Defense"]', '1.e4 Nf6']);
    // this.pgns.push(['[OpeningName "King\'s Gambit"]', '1.e4 e5 2.f4']);
    // this.pgns.push(['[OpeningName "Scotch Game"]', '1.e4 e5 2.Nf3 Nc6 3.d4']);
    //
    // this.pgns.push(['[OpeningName "Queen\'s Gambit"]', '1.d4 d5 2.c4']);
    // this.pgns.push(['[OpeningName "Slav Defense"]', '1.d4 d5 2.c4 c6']);
    // this.pgns.push(['[OpeningName "King\'s Indian Defense"]', '1.d4 Nf6 2.c4 g6']);
    // this.pgns.push(['[OpeningName "Nimzo-Indian Defense"]', '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4']);
    // this.pgns.push(['[OpeningName "Queen\'s Indian Defense"]', '1.d4 Nf6 2.c4 e6 3.Nf3 b6']);
    // this.pgns.push(['[OpeningName "Bogo-Indian Defense"]', '1.d4 Nf6 2.c4 e6 3.Nf3 Bb4+']);
    // this.pgns.push(['[OpeningName "Gruenfeld Defense"]', '1.d4 Nf6 2.c4 g6 3.Nc3 d5']);
    // this.pgns.push(['[OpeningName "Dutch Defense"]', '1.d4 f5']);
    // this.pgns.push(['[OpeningName "Trompowsky Attack"]', '1.d4 Nf6 2.Bg5']);
    // this.pgns.push(['[OpeningName "Benko Gambit"]', '1.d4 Nf6 2.c4 c5 3.d5 b5']);
    // this.pgns.push(['[OpeningName "Queen\'s Pawn Opening: London System"]', '1.d4 d5 2.Nf3 Nf6 3.Bf4']);
    this.pgns.push([
      '[OpeningName "Benoni Defense: Modern Variation, 4.Nc3 exd5 5.cxd5 d6"]',
      '1.d4 {the first move was just made} Nf6 2.c4 c5 {2nd move for black} 3.d5 {third move for white} e6 4.Nc3 exd5 5.cxd5 {second to last} d6 {this is the last move}'
    ]);
    //
    // this.pgns.push(['[OpeningName "Catalan Opening"]', '1.d4 Nf6 2.c4 e6 3.g3']);
    // this.pgns.push(['[OpeningName "Reti Opening"]', '1.Nf3']);
    // this.pgns.push(['[OpeningName "English Opening"]', '1.c4']);
    // this.pgns.push(['[OpeningName "Bird\'s Opening"]', '1.f4']);
    // this.pgns.push(['[OpeningName "King\'s Indian Attack"]', '1.Nf3 d5 2.g3']);
    // this.pgns.push(['[OpeningName "Hungarian Opening"]', '1.g3']);
    // this.pgns.push(['[OpeningName "Nimzowitsch-Larsen Attack"]', '1.b3']);
    // this.pgns.push(['[OpeningName "Polish Opening"]', '1.b4']);
    // this.pgns.push(['[OpeningName "Grob Opening"]', '1.g4']);
  }

  process() {}

  buildBoardForPgn(pgn: Array<string>) {
    this.chessboard.buildPgn(pgn);
  }

  loadOpening() {
    console.log('loadOpening');
    this.selectedIndex = null;
    this.buildMultipleChoiceCard();
    const correctMultipleChoiceCard = this.multipleChoiceCard.multipleChoiceItems.find(mci => {
      return mci.isCorrectAnswer;
    });
    this.buildBoardForPgn(correctMultipleChoiceCard.pgn);

    if (this.orientation === 'flip') {
      this.chessboard.flipRandom();
    } else {
      this.chessboard.setOrientation(this.orientation);
    }

    // this.startMoving();
  }

  buildMultipleChoiceCard() {
    this.multipleChoiceCard = new MultipleChoiceCard(this.parsePgns());
  }

  parsePgns(): Array<MultipleChoiceItem> {
    const chess: Chess = new Chess();
    const multipleChoiceItems: Array<MultipleChoiceItem> = [];

    sampleSize(this.pgns, this.multipleChoiceItemCount).forEach(pgn => {
      chess.load_pgn(pgn.join('\n'));
      const multipleChoiceItem: MultipleChoiceItem = new MultipleChoiceItem();
      multipleChoiceItem.answer = new ChessHeader(chess.header()).openingName;
      multipleChoiceItem.pgn = pgn;
      multipleChoiceItems.push(multipleChoiceItem);
    });

    multipleChoiceItems[0].isCorrectAnswer = true;
    this.correctAnswer = multipleChoiceItems[0].answer;

    return multipleChoiceItems;
  }

  showNextPosition() {
    this.chessboard.showNextPosition();
  }

  showPreviousPosition() {
    this.chessboard.showPreviousPosition();
  }

  get comment(): string {
    return this.chessboard.getCommentForPosition();
  }

  startMoving() {
    this.shouldDisplayCorrectAnswer = false;
    this.shouldDisableStartButton = true;
    this.subscription = this.timer$.subscribe(result => {
      if (!this.chessboard.isShowingLastPosition()) {
        this.showNextPosition();
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

  reload() {
    this.chessboard.showFirstPosition();
  }

  stopMoving() {
    this.subscription.unsubscribe();
    this.shouldDisableStartButton = false;
    this.isFirstOpeningLoaded = true;
  }

  multipleChoiceItemSelected(multipleChoiceItem: MultipleChoiceItem, selectedIndex: number) {
    this.selectedIndex = selectedIndex;
  }

  onOrientationChangedHandler() {
    this.loadOpening();
  }
}
