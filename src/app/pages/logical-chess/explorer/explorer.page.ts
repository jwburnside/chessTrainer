import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciseTypeConstants } from '../../../constants/exercise-type-constants';
import { PgnFilenameConstants } from '../../../constants/pgn-filename-constants';

@Component({
  selector: 'explorer-quiz',
  templateUrl: './explorer.page.html',
  styleUrls: ['./explorer.page.scss']
})
export class ExplorerPage {
  readonly exerciseTypeEnums = ExerciseTypeConstants.ExerciseType;
  readonly pgnFilenameConstants = PgnFilenameConstants;

  filename: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.filename = this.activatedRoute.snapshot.paramMap.get('filename');
  }

}
