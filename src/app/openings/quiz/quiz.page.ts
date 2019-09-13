import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Chess from 'chess.js';
import { sampleSize } from 'lodash';
import { Observable, Subscription, timer } from 'rxjs';
import { ChessboardComponent } from '../../chessboard';
import { ChessHeader } from '../../models/chess-header';
import { MultipleChoiceCard } from '../../models/multiple-choice-card';
import { MultipleChoiceItem } from '../../models/multiple-choice-item';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss']
})
export class QuizPage {
  // readonly MULTIPLE_CHOICE_ITEM_COUNT = 4;
  // readonly MOVE_INTERVAL = 1000;
  //
  // orientation = 'flip';
  // selectedIndex: number;
  // pgns: Array<Array<string>> = [];
  // shouldDisableStartButton = false;
  // isFirstOpeningLoaded = false;
  // multipleChoiceCard: MultipleChoiceCard;
  // multipleChoiceForm: FormGroup;
  //
  // private subscription: Subscription;
  // private timer$: Observable<number> = timer(0, this.MOVE_INTERVAL);
  //
  // @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;
  //
  // constructor(public formBuilder: FormBuilder) {
  //   this.multipleChoiceForm = this.formBuilder.group({});
  // }
  //
  // ionViewDidEnter() {
  //   this.loadPgns();
  //   this.chessboard.buildStartPosition();
  // }
  //
  // loadPgns() {
  //   this.pgns.push(['[OpeningName "Ruy Lopez Opening"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5']);
  //   this.pgns.push(['[OpeningName "Italian Game"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4']);
  //   this.pgns.push(['[OpeningName "Four Knights Game"]', '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6']);
  //   this.pgns.push(['[OpeningName "Italian Game: Two Knights Defense (Fried Liver)"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6']);
  //   this.pgns.push(['[OpeningName "Queen\'s Gambit Accepted"]', '1.d4 d5 2.c4 dxc4']);
  //   this.pgns.push(['[OpeningName "Queen\'s Gambit Declined"]', '1.d4 d5 2.c4 e6']);
  //   this.pgns.push(['[OpeningName "Slav Defense"]', '1.d4 d5 2.c4 c6']);
  //   this.pgns.push(['[OpeningName "Petroff Defense"]', '1.e4 e5 2.Nf3 Nf6']);
  //   this.pgns.push(['[OpeningName "Ruy Lopez Opening: Morphy Defense, Closed Defense"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 0-0 8.c3 d6']);
  //   this.pgns.push(['[OpeningName "Ruy Lopez Opening: Marshall Attack"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5']);
  //   this.pgns.push(['[OpeningName "Scotch Game"]', '1.e4 e5 2.Nf3 Nc6 3.d4']);
  //   this.pgns.push(['[OpeningName "Scotch Game: Schmidt, Mieses Variation"]', '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5']);
  //   this.pgns.push(['[OpeningName "Scotch Game: Classical Variation"]', '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5']);
  //   this.pgns.push(['[OpeningName "Scotch Game: Steinitz Variation"]', '1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Qh4']);
  //   this.pgns.push(['[OpeningName "French Defense: Exchange Variation"]', '1.e4 e6 2.d4 d5 3.exd5']);
  //   this.pgns.push(['[OpeningName "French Defense: Winawer Variation"]', '1.e4 e6 2.d4 d5 3.Nc3 Bb4']);
  //   this.pgns.push(['[OpeningName "French Defense: Classical Variation, 4.Bg5"]', '1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5']);
  //   this.pgns.push(['[OpeningName "French Defense: Tarrasch Variation"]', '1.e4 e6 2.d4 d5 3.Nd2']);
  //   this.pgns.push(['[OpeningName "Caro-Kann Defense: Main Line"]', '1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4']);
  //   this.pgns.push(['[OpeningName "Caro-Kann Defense: Advance Variation"]', '1.e4 c6 2.d4 d5 3.e5']);
  //   this.pgns.push(['[OpeningName "Caro-Kann Defense: Accelerated Panov Attack"]', '1.e4 c6 2.c4']);
  //   this.pgns.push(['[OpeningName "Sicilian Defense: Open Variation"]', '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4']);
  //   this.pgns.push(['[OpeningName "Sicilian Defense: Closed"]', '1.e4 c5 2.Nc3']);
  //   this.pgns.push(['[OpeningName "Sicilian Defense: Smith-Morra Gambit"]', '1.e4 c5 2.d4']);
  //   this.pgns.push(['[OpeningName "Alekhine Defense"]', '1.e4 Nf6']);
  //   this.pgns.push(['[OpeningName "Scandinavian Defense"]', '1.e4 d5']);
  //   this.pgns.push(['[OpeningName "Pirc Defense"]', '1.e4 d6']);
  //   this.pgns.push(['[OpeningName "King\'s Gambit"]', '1.e4 e5 2.f4']);
  //   this.pgns.push(['[OpeningName "Nimzo-Indian Defense"]', '1.d4 Nf6 2.c4 e6 3.Nc3 Bb4']);
  //   this.pgns.push(['[OpeningName "Queen\'s Indian Defense"]', '1.d4 Nf6 2.c4 e6 3.Nf3 b6']);
  //   this.pgns.push(['[OpeningName "King\'s Indian Defense"]', '1.d4 Nf6 2.c4 g6']);
  //   this.pgns.push(['[OpeningName "Gruenfeld Defense"]', '1.d4 Nf6 2.c4 g6 3.Nc3 d5']);
  //   this.pgns.push(['[OpeningName "Benko Gambit"]', '1.d4 Nf6 2.c4 c5 3.d5 b5']);
  //   this.pgns.push(['[OpeningName "Benoni Defense: Modern Variation, 4.Nc3 exd5 5.cxd5 d6"]', '1.d4 Nf6 2.c4 c5 3.d5 e6 4.Nc3 exd5 5.cxd5 d6']);
  //   this.pgns.push(['[OpeningName "Slav Defense\n"]', '1.d4 d5 2.c4 c6']);
  //   this.pgns.push(['[OpeningName "Catalan Opening: Open Defense, Classical Line"]', '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Nf3 Be7']);
  //   this.pgns.push(['[OpeningName "Catalan Opening: Closed"]', '1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2']);
  //   this.pgns.push(['[OpeningName "English Opening: Symmetrical Variation"]', '1.c4 c5']);
  //   this.pgns.push(['[OpeningName "English Opening: Botvinnik System"]', '1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.e4']);
  //   this.pgns.push(['[OpeningName "Reti Opening"]', '1.Nf3']);
  //
  // }
  //
  // buildBoardForPgn(pgn: Array<string>) {
  //   this.chessboard.buildPgn(pgn);
  // }
  //
  // loadOpening() {
  //   this.selectedIndex = null;
  //   this.buildMultipleChoiceCard();
  //   const correctMultipleChoiceCard = this.multipleChoiceCard.multipleChoiceItems.find(mci => {
  //     return mci.isCorrectAnswer;
  //   });
  //   this.buildBoardForPgn(correctMultipleChoiceCard.pgn);
  //
  //   if (this.orientation === 'flip') {
  //     this.chessboard.flipRandom();
  //   } else {
  //     this.chessboard.setOrientation(this.orientation);
  //   }
  //
  //   this.startMoving();
  // }
  //
  // buildMultipleChoiceCard() {
  //   this.multipleChoiceCard = new MultipleChoiceCard(this.parsePgns());
  // }
  //
  // parsePgns(): Array<MultipleChoiceItem> {
  //   const chess: Chess = new Chess();
  //   const multipleChoiceItems: Array<MultipleChoiceItem> = [];
  //
  //   sampleSize(this.pgns, this.MULTIPLE_CHOICE_ITEM_COUNT).forEach(pgn => {
  //     chess.load_pgn(pgn.join('\n'));
  //     const multipleChoiceItem: MultipleChoiceItem = new MultipleChoiceItem();
  //     multipleChoiceItem.answer = new ChessHeader(chess.header()).openingName;
  //     multipleChoiceItem.pgn = pgn;
  //     multipleChoiceItems.push(multipleChoiceItem);
  //   });
  //
  //   multipleChoiceItems[0].isCorrectAnswer = true;
  //
  //   return multipleChoiceItems;
  // }
  //
  // showNextPosition() {
  //   this.chessboard.showNextPosition();
  // }
  //
  // startMoving() {
  //   this.shouldDisableStartButton = true;
  //   this.subscription = this.timer$.subscribe(result => {
  //     if (!this.chessboard.isShowingLastPosition()) {
  //       this.showNextPosition();
  //     } else {
  //       this.stopMoving();
  //     }
  //   });
  // }
  //
  // stopMoving() {
  //   this.subscription.unsubscribe();
  //   this.shouldDisableStartButton = false;
  //   this.isFirstOpeningLoaded = true;
  // }
  //
  // multipleChoiceItemSelected(multipleChoiceItem: MultipleChoiceItem, selectedIndex: number) {
  //   this.selectedIndex = selectedIndex;
  // }
  //
  // onOrientationChangedHandler() {
  //   this.loadOpening();
  // }
}
