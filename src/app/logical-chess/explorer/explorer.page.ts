import { Component } from '@angular/core';
import { ExerciseTypeConstants } from '../../constants/exercise-type-constants';
import { PgnFilenameConstants } from '../../constants/pgn-filename-constants';

@Component({
  selector: 'explorer-quiz',
  templateUrl: './explorer.page.html',
  styleUrls: ['./explorer.page.scss']
})
export class ExplorerPage {
  readonly exerciseTypeEnums = ExerciseTypeConstants.ExerciseType;
  readonly pgnFilenameConstants = PgnFilenameConstants;

}
