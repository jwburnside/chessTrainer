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
  selector: 'explorer-quiz',
  templateUrl: './explorer.page.html',
  styleUrls: ['./explorer.page.scss']
})
export class ExplorerPage {
  orientation = 'flip';
  moveInterval = 1000;
  multipleChoiceItemCount = 4;
  selectedIndex: number;
  pgns: Array<Array<string>> = [];
  shouldDisableStartButton = false;
  isFirstOpeningLoaded = false;
  multipleChoiceCard: MultipleChoiceCard;
  multipleChoiceForm: FormGroup;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, this.moveInterval);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor(public formBuilder: FormBuilder) {
    this.multipleChoiceForm = this.formBuilder.group({});
  }

  ionViewDidEnter() {
    this.loadPgns();
    this.chessboard.buildStartPosition();
  }

  loadPgns() {
    this.pgns.push(['[OpeningName "Petrov Defense"]', '1. e4 e5 2. Nf3 Nf6 {This is the main line in the Petrov defense.} 3. Nxe5 Nxe4 {Blacks worst move.} 4. Qe2 {...Nd6 or Nf6 loses to 5 Nc6} 4... d5 5. d3 Nf6 {Same thing here, 6 Nc6 loses for black.}']);
    // this.pgns.push(['[OpeningName "Italian Game"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4']);
    // this.pgns.push(['[OpeningName "Four Knights Opening"]', '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6']);
    // this.pgns.push(['[OpeningName "Italian Game: Two Knights Defense (Fried Liver)"]', '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6']);
    // this.pgns.push(['[OpeningName "Queen\'s Gambit Accepted"]', '1.d4 d5 2.c4 dxc4']);
    // this.pgns.push(['[OpeningName "Queen\'s Gambit Declined"]', '1.d4 d5 2.c4 e6']);
    // this.pgns.push(['[OpeningName "Slav Defense"]', '1.d4 d5 2.c4 c6']);
  }

  buildBoardForPgn(pgn: Array<string>) {
    this.chessboard.buildPgn(pgn);
  }

  loadOpening() {
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

    this.startMoving();
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

    return multipleChoiceItems;
  }

  showNextPosition() {
    this.chessboard.showNextPosition();
  }

  startMoving() {
    this.shouldDisableStartButton = true;
    this.subscription = this.timer$.subscribe(result => {
      if (!this.chessboard.isShowingLastPosition()) {
        this.showNextPosition();
      } else {
        this.stopMoving();
      }
    });
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
