import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public framesOfGame: number[][] = [
    [1, 8],
    [5, 1],
  ];

  /** Returns first roll of frame or 0. */
  public getRollOneOfFrame(index: number): number {
    let result: number;
    this.framesOfGame[index]
      ? (result = this.framesOfGame[index][0])
      : (result = 0);

    return result;
  }

  /** Returns second roll of frame or 0. */
  public getRollTwoOfFrame(index: number): number {
    let result: number;
    this.framesOfGame[index]
      ? (result = this.framesOfGame[index][1])
      : (result = 0);

    return result;
  }

  /** Returns third roll of frame or 0. */
  public getRollThreeOfFrame(index: number): number {
    let result: number;
    this.framesOfGame[index]
      ? (result = this.framesOfGame[index][2])
      : (result = 0);

    return result;
  }
}
