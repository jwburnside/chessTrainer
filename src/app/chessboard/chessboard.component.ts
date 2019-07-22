import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as Chess from 'chess.js';
import { Howl, Howler } from 'howler';
import { Subscription } from 'rxjs';
import { Configuration, ConfigurationService, StockfishService } from '../shared';
import { PromotionDialog } from './promotion.dialog';

export class ChessHeader {
  event: string;
  openingName: string;

  constructor(stringHeader: any) {
    this.event = stringHeader.Event;
    this.openingName = stringHeader.OpeningName;
  }
}

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
      draggable: true,
      onDragStart: function(source, piece, position, orientation) {
        return self.onDragStart(source, piece, position, orientation);
      },
      onDrop: function(source, target, piece, newPos, oldPos, orientation) {
        return self.onDrop(source, target, piece, newPos, oldPos, orientation);
      },
      onMoveEnd: function(source, target) {
        self.onMoveEnd(source, target);
      },
      onMouseoutSquare: function(square, piece, position, orientation) {
        self.onMouseoutSquare(square, piece, position, orientation);
      },
      onMouseoverSquare: function(square, piece, position, orientation) {
        self.onMouseoverSquare(square, piece, position, orientation);
      },
      onSnapEnd: function(source, target, piece) {
        self.onSnapEnd(source, target, piece);
      }
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

  getHeaderValue(theKey: string): ChessHeader {
    const header: any = this.chess.header();
    header.valueOf();
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
    console.log('fenHistory: ' + JSON.stringify(this.fenHistory));
    console.log('fenPointer: ' + JSON.stringify(this.fenPointer));
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

  private messageReceived(message) {
    if (this.initializing) {
      return;
    }
    if ('uciok' === message) {
      this.engineReady.emit();
      return;
    }
    let match;
    if ((match = message.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/))) {
      if (this.hinting) {
        this.showHint(match[1], match[2], match[3], 2);
        return;
      }
      this.chess.move({ from: match[1], to: match[2], promotion: match[3] });

      this.board.position(this.chess.fen(), false);
      if (this.originalPlayer !== this.player) {
        this.playerMoved.emit();
      }
      this.fenHistory.push(this.chess.fen());
      this.highlightSquares(match[1], match[2]);
      if (this.chess.game_over()) {
        let message;
        if (this.chess.in_checkmate()) message = 'Checkmate';
        else if (this.chess.in_stalemate()) message = this.literales['chessboard.stalemate'];
        else if (this.chess.insufficient_material()) message = this.literales['chessboard.insufficent-material'];
        else if (this.chess.in_threefold_repetition()) message = this.literales['chessboard.three-repetition'];
        else if (this.chess.in_draw()) message = this.literales['chessboard.rule-fifty'];
        else message = this.literales['chessboard.game-over'];
        this.autosolve = false;
        this.fenPointer = this.fenHistory.length - 1;

        this.gameOver.emit(message);
        return;
      }
      if (this.autosolve || this.player !== this.originalPlayer) {
        if (this.player === 'w') {
          this.player = 'b';
        } else {
          this.player = 'w';
        }
        this.prepareMove();
      } else {
        if (this.squareSelected) {
          document.querySelector('.square-' + this.squareSelected).classList.add('highlight-square');
        }
        this.engineEndThinking.emit();
      }
    } else if ((match = message.match(/^info .*\bscore (\w+) (-?\d+)/))) {
      const score = parseInt(match[2]) * (this.chess.turn() == 'w' ? 1 : -1);
      let engineScore;
      /// Is it measuring in centipawns?
      if (match[1] == 'cp') {
        engineScore = (score / 100.0).toFixed(2);
        /// Did it find a mate?
      } else if (match[1] == 'mate') {
        if ((this.originalPlayer === 'w' && score > 0) || (this.originalPlayer === 'b' && score < 0)) {
          this.engineInfo.emit(this.literales['chessboard.mate-in'] + ' ' + Math.abs(score));
        } else {
          this.engineInfo.emit(this.literales['chessboard.receive-mate-in']);
        }
        return;
      }
      /// Is the score bounded?
      let bound = '';
      if ((match = message.match(/\b(upper|lower)bound\b/))) {
        bound = (match[1] == 'upper') == (this.chess.turn() == 'w') ? '<= ' : '>= ';
      }
      if ('0.00' === engineScore) {
        this.engineInfo.emit(this.literales['chessboard.unfeasible-mate']);
      } else if (parseFloat(engineScore) > 0) {
        this.engineInfo.emit(this.literales['chessboard.white-advantage'] + ': ' + bound + engineScore);
      } else {
        this.engineInfo.emit(this.literales['chessboard.black-advantage'] + ': ' + bound + engineScore);
      }
    } else if ((match = message.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))) {
      this.engineInfo.emit('Depth: ' + match[1] + ' Nps: ' + match[2]);
    }
  }

  private async promoteDialog(): Promise<string> {
    return new Promise<string>(async resolve => {
      const modal = await this.modalController.create({
        component: PromotionDialog,
        componentProps: { turn: this.originalPlayer }
      });
      modal.present();
      const { data } = await modal.onDidDismiss();
      if (data == undefined) {
        resolve(null);
      } else {
        resolve(data.piece);
      }
    });
  }

  private onDragStart(source, piece, position, orientation) {
    const re = this.player == 'w' ? /^b/ : /^w/;
    if (this.chess.game_over() || piece.search(re) !== -1 || this.chess.turn() !== this.player) {
      return false;
    }
    this.drawGreySquares(source);
  }

  private onDrop(source, target, piece, newPos, oldPos, orientation) {
    this.removeGreySquares();
    if (source == target) {
      this.squareSelected = source;
      this.drawGreySquares(source);
      return;
    }
    // validate move
    const move = this.chess.move({
      from: source,
      to: target,
      promotion: 'q'
    });
    if (move === null) return 'snapback';
    this.chess.undo();
    this.squareSelected = target;
    // check promotion
    if (this.chess.get(source).type == 'p' && (target.charAt(1) == '8' || target.charAt(1) == '1')) {
      this.promoteDialog().then(promotion => {
        if (promotion) {
          this.registerMove(source, target, promotion);
        }
        this.board.position(this.chess.fen(), false);
      });
    } else {
      this.registerMove(source, target, 'q');
    }
  }

  private registerMove(source, target, promotion) {
    this.chess.move({
      from: source,
      to: target,
      promotion: promotion
    });

    this.fenHistory.push(this.chess.fen());
    this.playerMoved.emit();
    this.initializing = false;
    this.prepareMove();
  }

  private showHint(from, to, promotion, count) {
    const self = this;
    const currentFen = this.chess.fen();

    this.chess.move({ from: from, to: to, promotion: promotion });
    this.board.position(this.chess.fen(), true);
    setTimeout(function() {
      self.chess.undo();
      self.board.position(currentFen, true);
      count--;
      if (count >= 0) {
        setTimeout(function() {
          self.showHint(from, to, promotion, count - 1);
        }, 500);
      } else {
        self.hinting = false;
        self.engineEndThinking.emit();
      }
    }, 500);
  }

  private onMoveEnd(source, target) {}

  private onMouseoutSquare(square, piece, position, orientation) {
    this.removeGreySquares();
  }

  private onMouseoverSquare(square, piece, position, orientation) {
    if (this.chess.turn() !== this.player) {
      return;
    }
    if (this.squareSelected) {
      this.onDrop(this.squareSelected, square, piece, null, null, orientation);
      this.board.position(this.chess.fen(), false);
      this.squareSelected = square;
    } else if (piece) {
      this.drawGreySquares(square);
    }
  }

  private onSnapEnd(source, target, piece) {
    this.highlightSquares(source, target);
  }

  private cleanHighlights() {
    document.querySelectorAll('.highlight-square').forEach(square => {
      square.classList.remove('highlight-square');
    });
  }

  private highlightSquares(source, target) {
    this.cleanHighlights();
    document.querySelector('.square-' + source).classList.add('highlight-square');
    document.querySelector('.square-' + target).classList.add('highlight-square');
  }

  private getStockfishMove() {
    this.stockfish.postMessage('position fen ' + this.chess.fen());
    this.stockfish.postMessage('go depth ' + this.configuration.stockfishDepth);
  }

  private getSyzygyMove() {
    this.engineInfo.emit(this.literales['chessboard.querying-syzygy']);
    this.http.get<any>(`http://tablebase.lichess.ovh/standard?fen=${this.chess.fen()}`).subscribe(
      data => {
        if (this.initializing) {
          return;
        }
        const bestmove = data.moves[0].uci;
        //('draw' === this.target ? data.moves[data.moves.length - 1].uci : data.moves[0].uci)
        let match = bestmove.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/);
        if (this.hinting) {
          if (data.dtm) {
            if (data.dtm > 0) {
              this.engineInfo.emit(
                this.literales['chessboard.mate-in'] + ' ' + Math.abs((data.dtm % 2 === 0 ? data.dtm : data.dtm + 1) / 2)
              );
            } else {
              this.engineInfo.emit(this.literales['chessboard.receive-mate-in']);
            }
          } else {
            this.engineInfo.emit(this.literales['chessboard.unfeasible-mate']);
          }
          this.showHint(match[1], match[2], match[3], 2);
          return;
        }

        this.chess.move({ from: match[1], to: match[2], promotion: match[3] });
        this.board.position(this.chess.fen(), false);
        if (this.originalPlayer !== this.player) {
          this.playerMoved.emit();
        }
        this.fenHistory.push(this.chess.fen());
        this.highlightSquares(match[1], match[2]);
        if (this.chess.game_over()) {
          let message;
          if (this.chess.in_checkmate()) message = 'Checkmate';
          else if (this.chess.in_stalemate()) message = this.literales['chessboard.stalemate'];
          else if (this.chess.insufficient_material()) message = this.literales['chessboard.insufficent-material'];
          else if (this.chess.in_threefold_repetition()) message = this.literales['chessboard.three-repetition'];
          else if (this.chess.in_draw()) message = this.literales['chessboard.rule-fifty'];
          else message = this.literales['chessboard.game-over'];
          this.autosolve = false;
          this.fenPointer = this.fenHistory.length - 1;
          this.gameOver.emit(message);
          return;
        } else {
          if (data.dtm) {
            if (data.dtm < 0) {
              this.engineInfo.emit(
                this.literales['chessboard.mate-in'] + ' ' + Math.abs((data.dtm % 2 === 0 ? data.dtm : data.dtm + 1) / 2)
              );
            } else {
              this.engineInfo.emit(this.literales['chessboard.receive-mate-in']);
            }
          } else {
            this.engineInfo.emit(this.literales['chessboard.unfeasible-mate']);
          }
        }
        if (this.autosolve || this.player !== this.originalPlayer) {
          if (this.player === 'w') {
            this.player = 'b';
          } else {
            this.player = 'w';
          }
          this.prepareMove();
        } else {
          if (this.squareSelected) {
            document.querySelector('.square-' + this.squareSelected).classList.add('highlight-square');
          }
          this.engineEndThinking.emit();
        }
      },
      error => {
        this.useSyzygy = false;
        this.engineInfo.emit(this.literales['syzygy-error']);
        this.getStockfishMove();
      }
    );
  }

  private numberOfPieces(fen) {
    return fen
      .substring(0, fen.indexOf(' '))
      .replace(/\d/g, '')
      .replace(/\//g, '').length;
  }

  private getEngineMove() {
    if (this.useSyzygy && this.numberOfPieces(this.chess.fen()) <= 7) {
      this.getSyzygyMove();
    } else {
      this.getStockfishMove();
    }
  }

  private prepareMove() {
    if (!this.chess.game_over()) {
      if (this.chess.turn() !== this.player) {
        this.engineStartThinking.emit();
        this.getEngineMove();
      }
    } else {
      this.autosolve = false;
      if (this.chess.game_over()) {
        let message;
        if (this.chess.in_checkmate()) message = 'Checkmate';
        else if (this.chess.in_stalemate()) message = this.literales['chessboard.stalemate'];
        else if (this.chess.insufficient_material()) message = this.literales['chessboard.insufficent-material'];
        else if (this.chess.in_threefold_repetition()) message = this.literales['chessboard.three-repetition'];
        else if (this.chess.in_draw()) message = this.literales['chessboard.rule-fifty'];
        else message = this.literales['chessboard.game-over'];
        this.fenPointer = this.fenHistory.length - 1;
        this.gameOver.emit(message);
        return;
      }
    }
  }

  private drawGreySquares(square) {
    return false;
    // if (!this.configuration.highlightSquares) {
    //     return;
    // }
    // // get list of possible moves for this square
    // const moves = this.chess.moves({ square: square, verbose: true });
    // // exit if there are no moves available for this square
    // if (moves.length === 0) return;
    // //this.removeGreySquares();
    // // highlight the square they moused over
    // this.greySquare(square);
    // // highlight the possible squares for this piece
    // moves.forEach(move => {
    //     this.greySquare(move.to);
    // });
  }

  private greySquare(square) {
    if (!this.configuration.highlightSquares) {
      return;
    }
    const squareEl = document.querySelector(`#__chessboard__ .square-${square}`) as HTMLElement;
    if (squareEl.classList.contains('black-3c85d')) {
      squareEl.style.setProperty('background-color', '#999999', 'important');
    } else {
      squareEl.style.setProperty('background-color', '#ffffff', 'important');
    }
  }

  private removeGreySquares() {
    if (!this.configuration.highlightSquares) {
      return;
    }
    $('#__chessboard__ .square-55d63').css('background', '');
  }
}
