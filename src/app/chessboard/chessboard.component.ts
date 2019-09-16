import { Component, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as Chess from 'chess.js';
import { random } from 'lodash';
import { ChessHeader } from '../models/chess-header';
import { Configuration, ConfigurationService } from '../shared';

declare var ChessBoard: any;
declare var $: any;

@Component({
  selector: 'chessboard',
  templateUrl: 'chessboard.component.html',
  styleUrls: ['chessboard.component.scss']
})
export class ChessboardComponent {
  private configuration: Configuration;
  private board: any;
  private chess: Chess = new Chess();
  private originalFen: string;
  private fenHistory: string[];
  private fenPointer: number;
  private originalPlayer: string;
  private player: string;
  private initializing = false;
  public literales: any;

  constructor(
    private configurationService: ConfigurationService,
    public translate: TranslateService,
    public modalController: ModalController
  ) {
    this.configurationService.initialize().then(config => {
      this.configuration = config;
    });
  }

  private uglyForceBoardRedraw() {
    window.setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    window.setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (this.board) {
      this.board.resize(event);
    }
  }

  buildStartPosition() {
    const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const self = this;
    this.initializing = true;
    if (this.board) {
      this.board.destroy();
    }
    this.board = ChessBoard('__chessboard__', {
      position: startingFen,
      pieceTheme: function(piece) {
        // TODO: self.configuration was null for some reason
        // return '/assets/pieces/' + self.configuration.pieceTheme + '/' + piece + '.svg';
        return '/assets/pieces/cburnett/' + piece + '.svg';
      },
      draggable: false
    });
    this.chess.load(startingFen);
    this.translate
      .get([
        'chessboard.stalemate',
        'chessboard.insufficent-material',
        'chessboard.three-repetition',
        'chessboard.rule-fifty',
        'chessboard.game-over',
        'chessboard.mate-in',
        'chessboard.receive-mate-in',
        'chessboard.unfeasible-mate',
        'chessboard.white-advantage',
        'chessboard.black-advantage',
        'chessboard.querying-syzygy',
        'chessboard.syzygy-error'
      ])
      .subscribe(async res => {
        this.literales = res;
      });

    this.uglyForceBoardRedraw();
  }

  buildPgn(pgn: Array<string>) {
    const self = this;
    this.initializing = true;
    if (this.board) {
      this.board.destroy();
    }

    this.chess.load_pgn(pgn.join('\n'));

    const movesAsFens = this.getMovesAsFENs();

    this.originalFen = movesAsFens[0];
    this.fenHistory = movesAsFens;

    this.board = ChessBoard('__chessboard__', {
      position: this.originalFen,
      pieceTheme: function(piece) {
        return '/assets/pieces/' + self.configuration.pieceTheme + '/' + piece + '.svg';
      },
      draggable: false
    });

    this.originalPlayer = this.chess.turn();
    this.player = this.originalPlayer;
    this.translate
      .get([
        'chessboard.stalemate',
        'chessboard.insufficent-material',
        'chessboard.three-repetition',
        'chessboard.rule-fifty',
        'chessboard.game-over',
        'chessboard.mate-in',
        'chessboard.receive-mate-in',
        'chessboard.unfeasible-mate',
        'chessboard.white-advantage',
        'chessboard.black-advantage',
        'chessboard.querying-syzygy',
        'chessboard.syzygy-error'
      ])
      .subscribe(async res => {
        this.literales = res;
      });

    this.showFirstPosition();

    this.uglyForceBoardRedraw();
  }



  getMovesAsFENs() {
    const chessObj: Chess = new Chess();
    const fens: Array<string> = this.chess.history().map(function(move) {
      chessObj.move(move);
      return chessObj.fen();
    });
    fens.unshift('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    return fens;
  }

  getHeader() {
    return this.chess.header();
  }

  getChessHeader(): ChessHeader {
    return new ChessHeader(this.chess.header());
  }

  history() {
    return this.chess.history();
  }

  flip() {
    this.board.flip();
  }

  flipRandom() {
    if (random(1)) {
      this.flip();
    }
  }

  setOrientation(orientation: string) {
    this.board.orientation(orientation);
  }

  showFirstPosition() {
    if (this.fenPointer === 0) {
      return;
    }
    this.fenPointer = 0;
    this.showFenPointer();
  }

  showPreviousPosition() {
    if (this.fenPointer === 0) {
      return;
    }
    this.fenPointer--;
    this.showFenPointer();
  }

  showNextPosition() {
    if (this.fenPointer === this.fenHistory.length - 1) {
      return;
    }
    this.fenPointer++;
    this.showFenPointer();
  }

  showLastPosition() {
    if (this.fenPointer === this.fenHistory.length - 1) {
      return;
    }
    this.fenPointer = this.fenHistory.length - 1;
    this.showFenPointer();
  }

  isShowingFirstPosition() {
    return this.fenPointer === 0;
  }

  isShowingLastPosition() {
    return this.fenPointer === this.fenHistory.length - 1;
  }

  getCommentForPosition() {
    const comment = this.chess.comments()[this.fenPointer - 1];
    return comment === ',' ? null : comment;
  }

  fen() {
    return this.chess.fen();
  }

  private showFenPointer() {
    this.board.position(this.fenHistory[this.fenPointer], true);
  }
}
