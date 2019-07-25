import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Chess from 'chess.js';
import { sampleSize, shuffle, random } from 'lodash';
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
export class QuizPage implements OnInit {
  moveInterval: number = 1000;
  multipleChoiceItemCount: number = 4;
  selectedIndex: number;
  pgns: Array<Array<string>> = [];
  shouldDisplayStartButton: boolean = true;
  isFirstOpeningLoaded: boolean = false;
  multipleChoiceCard: MultipleChoiceCard;
  multipleChoiceForm: FormGroup;

  private subscription: Subscription;
  private timer$: Observable<number> = timer(0, this.moveInterval);

  @ViewChild('chessboard', { static: true }) chessboard: ChessboardComponent;

  constructor(public formBuilder: FormBuilder) {
    this.multipleChoiceForm = this.formBuilder.group({});
  }

  ngOnInit() {
    // TODO: Make sure you check these.
    // Only go as deep as the named opening. "Four Knights Game: Double Spanish Variation, 5.O-O O-O" should end with the 4th move, etc.
    this.pgns.push(['[OpeningName "Ruy Lopez Opening: Morphy Defense, Closed"]', '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7']);
    this.pgns.push(['[OpeningName "Giuoco Piano Game: Center Attack, 5...exd4"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4']);
    this.pgns.push(['[OpeningName "Italian Game: Two Knights Defense, 5...exd4"]', '1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6']);
    this.pgns.push([
      '[OpeningName "Four Knights Game: Double Spanish Variation, 5.O-O O-O"]',
      '1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bb4 5.O-O O-O'
    ]);

    this.chessboard.buildStartPosition();
  }

  buildBoardForPgn(pgn: string) {
    this.chessboard.buildPgn(pgn);
  }

  startTraining() {
    this.selectedIndex = null;
    this.buildMultipleChoiceCard();
    const correctMultipleChoiceCard = this.multipleChoiceCard.multipleChoiceItems.find(mci => {
      return mci.isCorrectAnswer;
    });
    this.buildBoardForPgn(correctMultipleChoiceCard.pgn);
    this.randomizeFlip();
    this.startMoving();
  }

  buildMultipleChoiceCard() {
    this.multipleChoiceCard = new MultipleChoiceCard(this.parsePgns());
  }

  parsePgns(): Array<MultipleChoiceItem> {
    const chess: Chess = new Chess();
    const multipleChoiceItems: MultipleChoiceItem = [];

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
    this.shouldDisplayStartButton = false;
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
    this.shouldDisplayStartButton = true;
    this.isFirstOpeningLoaded = true;
  }

  multipleChoiceItemSelected(multipleChoiceItem: MultipleChoiceItem, selectedIndex: number) {
    this.selectedIndex = selectedIndex;
  }
  
  randomizeFlip() {
    if (random(1)) {
      this.flipBoard();
    }
  }

  flipBoard() {
    this.chessboard.flip();
  }
}
