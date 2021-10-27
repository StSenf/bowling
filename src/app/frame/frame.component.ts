import { Component, Input } from "@angular/core";

import { IFrame } from "../bowling.interface";

@Component({
  selector: "bowling-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.scss"],
})
export class FrameComponent {
  /** Holds all frames with their rolled pins. */
  @Input() public framesOfGame: Map<number, IFrame>;

  /** Index of the frame in the game. */
  @Input() public index: number;

  /** If true, the last roll box in the frame gets rendered. */
  @Input() public isLastFrame?: boolean = false;

  /** Returns first roll of frame. */
  public get rollOneOfFrame(): number | undefined {
    return (
      this.framesOfGame &&
      this.framesOfGame.get(this.index).rolledPins &&
      this.framesOfGame.get(this.index).rolledPins[0]
    );
  }

  /** Returns second roll of frame. */
  public get rollTwoOfFrame(): number | undefined {
    return (
      this.framesOfGame &&
      this.framesOfGame.get(this.index).rolledPins &&
      this.framesOfGame.get(this.index).rolledPins[1]
    );
  }

  /** Returns third roll of frame. */
  public get rollThreeOfFrame(): number | undefined {
    return (
      this.framesOfGame &&
      this.framesOfGame.get(this.index).rolledPins &&
      this.framesOfGame.get(this.index).rolledPins[2]
    );
  }

  /** Returns the total amount of struck pins in this frame. */
  public get frameAmount(): number | undefined {
    return (
      this.framesOfGame.get(this.index).rolledPins &&
      this.framesOfGame.get(this.index).rolledPins.reduce((a, b) => a + b, 0)
    );
  }

  /** Returns the stored game count of each frame. */
  public get gameCountOfFrame(): number | undefined {
    return this.framesOfGame.get(this.index).gameCount;
  }

  private get _amountFirstSecond(): number | undefined {
    return (
      this.framesOfGame.get(this.index).rolledPins &&
      this.framesOfGame.get(this.index).rolledPins[0] +
        this.framesOfGame.get(this.index).rolledPins[1]
    );
  }

  private get _amountSecond(): number | undefined {
    return (
      this.framesOfGame.get(this.index).rolledPins &&
      this.framesOfGame.get(this.index).rolledPins[1]
    );
  }

  /**
   * Converts the rolled number into a string.
   * If 10 was rolled, "X" is returned.
   *
   * * @param roll - the rolled number
   */
  public convertToPossibleStrike(roll: number | undefined): string {
    let result = "";

    switch (roll) {
      case 10:
        result = "X";
        break;
      case undefined:
        result = "";
        break;
      default:
        result = String(roll);
    }

    return result;
  }

  /**
   * Converts the rolled number into a string.
   * If the frame amount is 10, "/" is returned.
   * If in last frame and amount is 20, "X" is returned.
   *
   * @param roll - the rolled number
   */
  public convertToPossibleSpare(roll: number | undefined): string {
    let result = "";

    if (this.isLastFrame && this._amountSecond === 10 && roll !== undefined) {
      result = "X";
    } else if (
      roll !== undefined &&
      ((this.isLastFrame && this._amountFirstSecond === 10) ||
        this.frameAmount === 10)
    ) {
      result = "/";
    } else if (
      roll === undefined ||
      (!this.isLastFrame && this.frameAmount >= 10)
    ) {
      result = "";
    } else {
      result = String(roll);
    }

    return result;
  }
}
