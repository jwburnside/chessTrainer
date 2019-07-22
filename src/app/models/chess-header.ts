export class ChessHeader {
  event: string;
  openingName: string;

  constructor(stringHeader: any) {
    this.event = stringHeader.Event;
    this.openingName = stringHeader.OpeningName;
  }
}
