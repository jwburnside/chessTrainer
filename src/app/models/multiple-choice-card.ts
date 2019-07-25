import { MultipleChoiceItem } from './multiple-choice-item';

export class MultipleChoiceCard {
  multipleChoiceItems: Array<MultipleChoiceItem>;

  selectedAnswer: MultipleChoiceItem;

  constructor(multipleChoiceItems: Array<MultipleChoiceItem>, correctAnswer: string) {

    this.multipleChoiceItems = multipleChoiceItems;
  }

  public evaluateAnswer(answer: string): boolean {
    this.selectedAnswer = answer;
    return answer === this.correctAnswer;
  }
}
