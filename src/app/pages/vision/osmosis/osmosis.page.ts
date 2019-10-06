import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { sample } from 'lodash';

@Component({
  selector: 'app-osmosis',
  templateUrl: './osmosis.page.html',
  styleUrls: ['./osmosis.page.scss']
})
export class OsmosisPage implements OnInit, OnDestroy {
  loadSquareSubscription: Subscription;
  loadSquareTimer$: Observable<number> = timer(100, 8000);
  currentSquare: string;

  readonly DARK_SQUARES: Array<string> = ['a1', 'c1', 'e1', 'g1', 'b2', 'd2', 'f2', 'h2', 'a3', 'c3', 'e3', 'g3', 'b4', 'd4', 'f4', 'h4', 'a5', 'c5', 'e5', 'g5', 'b6', 'd6', 'f6', 'h6', 'a7', 'c7', 'e7', 'g7', 'b8', 'd8', 'f8', 'h8'];

  constructor() {}

  ngOnInit(): void {
    this.loadSquareSubscription = this.loadSquareTimer$.subscribe(result => {
      this.currentSquare = sample(this.DARK_SQUARES);
    });
  }

  ngOnDestroy(): void {
    this.loadSquareSubscription.unsubscribe();
  }
}
