import { MultipleChoiceItem } from './multiple-choice-item';

export class MultipleChoiceCard {
  multipleChoiceItems: Array<MultipleChoiceItem>;

  constructor(multipleChoiceItems: Array<MultipleChoiceItem>) {
    this.multipleChoiceItems = multipleChoiceItems;
  }
}
