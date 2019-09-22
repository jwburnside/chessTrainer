import { Component } from '@angular/core';
import { ExerciseTypeConstants } from '../../constants/exercise-type-constants';
import { PgnFilenameConstants } from '../../constants/pgn-filename-constants';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss']
})
export class QuizPage {
  readonly exerciseTypeEnums = ExerciseTypeConstants.ExerciseType;
  readonly pgnFilenameConstants = PgnFilenameConstants;
}
