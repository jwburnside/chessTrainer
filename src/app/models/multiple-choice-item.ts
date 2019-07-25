export class MultipleChoiceItem {
    answer: string;
    pgn: string;
    isCorrectAnswer: true;
    constructor(answer: string, pgn: string, isCorrectAnswer: boolean = false) {
        this.answer = answer;
    }
}
