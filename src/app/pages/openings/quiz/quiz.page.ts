import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseTypeConstants } from '../../../constants/exercise-type-constants';
import { PgnFilenameConstants } from '../../../constants/pgn-filename-constants';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss']
})
export class QuizPage {
  readonly exerciseTypeEnums = ExerciseTypeConstants.ExerciseType;
  readonly pgnFilenameConstants = PgnFilenameConstants;

  filename: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.filename = this.activatedRoute.snapshot.paramMap.get('filename');
  }


}
