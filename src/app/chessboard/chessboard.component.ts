import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as Chess from 'chess.js';
import { Howl, Howler } from 'howler';
import { Subscription } from 'rxjs';
import { ChessHeader } from '../models/chess-header';
import { Configuration, ConfigurationService, StockfishService } from '../shared';
import { PromotionDialog } from './promotion.dialog';

declare var ChessBoard: any;
declare var $: any;

@Component({
  selector: 'chessboard',
  templateUrl: 'chessboard.component.html',
  styleUrls: ['chessboard.component.scss']
})
export class ChessboardComponent implements OnInit, OnDestroy {
  private configuration: Configuration;
  private onConfigChangeSubscription: Subscription;
  private board: any;
  private chess: Chess = new Chess();
  private originalFen: string;
  private fenHistory: string[];
  private fenPointer: number;
  private target: string;
  private originalPlayer: string;
  private player: string;
  private autosolve = false;
  private hinting = false;
  private initializing = false;
  private useSyzygy = false;
  private squareSelected;
  private onStockfishMessageSubscription: Subscription;
  public literales: any;
  private ooopsPlayed = false;

  @Output() engineReady: EventEmitter<void> = new EventEmitter<void>();
  @Output() engineStartThinking: EventEmitter<void> = new EventEmitter<void>();
  @Output() engineEndThinking: EventEmitter<void> = new EventEmitter<void>();
  @Output() engineInfo: EventEmitter<string> = new EventEmitter<string>();
  @Output() playerMoved: EventEmitter<void> = new EventEmitter<void>();
  @Output() gameOver: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private configurationService: ConfigurationService,
    private stockfish: StockfishService,
    public translate: TranslateService,
    public modalController: ModalController,
    private http: HttpClient,
    private platform: Platform
  ) {
    this.configurationService.initialize().then(config => {
      this.configuration = config;
      this.useSyzygy = this.configuration.useSyzygy;
    });
  }

  ngOnInit() {
    this.onConfigChangeSubscription = this.configurationService.onChange$.subscribe(event => this.configurationChanged(event));
    this.onStockfishMessageSubscription = this.stockfish.onMessage$.subscribe(event => this.messageReceived(event));
  }

  ngOnDestroy() {
    this.onConfigChangeSubscription.unsubscribe();
    this.onStockfishMessageSubscription.unsubscribe();
  }

  private uglyForceBoardRedraw() {
    window.setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    window.setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
  }

  private configurationChanged(config) {
    this.configuration = config;
    this.useSyzygy = this.configuration.useSyzygy;
    this.uglyForceBoardRedraw();
  }

  @HostListener('window:resize', ['$event']) onResize(event) {
    if (this.board) this.board.resize(event);
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
        return '/assets/pieces/' + self.configuration.pieceTheme + '/' + piece + '.svg';
      },
      draggable: false
    });
    this.chess.load(startingFen);
    this.cleanHighlights();
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

  build(fen: string, target) {
    const self = this;
    this.initializing = true;
    this.target = target;
    this.autosolve = false;
    this.originalFen = fen;
    this.fenHistory = [fen];
    this.ooopsPlayed = false;
    if (this.board) {
      this.board.destroy();
    }
    this.board = ChessBoard('__chessboard__', {
      position: fen,
      pieceTheme: function(piece) {
        return '/assets/pieces/' + self.configuration.pieceTheme + '/' + piece + '.svg';
      },
      draggable: true
    });
    this.chess.load(fen);
    this.cleanHighlights();
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

    this.uglyForceBoardRedraw();
  }

  buildPgn(pgn: Array<string>) {
    const self = this;
    this.initializing = true;
    this.autosolve = false;
    this.ooopsPlayed = false;
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

    this.cleanHighlights();
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
    console.log('history:' + JSON.stringify(this.chess.history()));
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

  rewind() {
    this.cleanHighlights();
    this.board.position(this.originalFen);
    this.chess.load(this.originalFen);
    this.fenHistory = [this.originalFen];
    this.player = this.chess.turn();
    this.ooopsPlayed = false;
  }

  undo() {
    this.cleanHighlights();
    this.chess.undo();
    this.chess.undo();
    this.fenHistory.pop();
    this.fenHistory.pop();
    this.board.position(this.chess.fen());
    this.ooopsPlayed = false;
  }

  history() {
    return this.chess.history();
  }

  solve() {
    this.removeGreySquares();
    this.initializing = false;
    this.autosolve = true;
    if (this.player === 'w') {
      this.player = 'b';
    } else {
      this.player = 'w';
    }
    this.prepareMove();
  }

  hint() {
    this.removeGreySquares();
    this.initializing = false;
    this.hinting = true;
    this.getEngineMove();
    this.engineStartThinking.emit();
  }

  flip() {
    this.board.flip();
  }

  stop() {
    if (this.autosolve) {
      this.autosolve = false;
    }
    this.stockfish.postMessage('stop');
  }

  winner() {
    if (this.chess.in_checkmate()) {
      return this.chess.turn() === 'w' ? 'black' : 'white';
    } else {
      return null;
    }
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

  showLatestPosition() {
    if (this.fenPointer === this.fenHistory.length - 1) {
      return;
    }
    this.fenPointer = this.fenHistory.length - 1;
    this.showFenPointer();
  }

  isShowingFirstPosition() {
    return this.fenPointer === 0;
  }

  isShowingLatestPosition() {
    return this.fenPointer === this.fenHistory.length - 1;
  }

  fen() {
    return this.chess.fen();
  }

  private showFenPointer() {
    this.cleanHighlights();
    this.board.position(this.fenHistory[this.fenPointer], true);
  }

  private cleanHighlights() {
    document.querySelectorAll('.highlight-square').forEach(square => {
      square.classList.remove('highlight-square');
    });
  }












}
