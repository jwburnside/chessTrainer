export class MultipleChoiceCard {

    answerChoices: Array<string>;
    selectedAnswer: string;
    correctAnswer: string;

    constructor(answerChoices: Array<string>, correctAnswer: string) {
        this.answerChoices = answerChoices;
        this.correctAnswer = correctAnswer;
    }

    evaluateAnswer(answer: string): boolean {
        this.selectedAnswer = answer;
        return answer === this.correctAnswer;
    }
}
