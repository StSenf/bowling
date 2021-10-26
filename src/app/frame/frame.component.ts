import { Component, Input } from "@angular/core";

@Component({
  selector: "bowling-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.scss"],
})
export class FrameComponent {
  /** Number input of first roll. */
  @Input() public rollOne: number | undefined;

  /** Number input of second roll. */
  @Input() public rollTwo: number | undefined;

  /** Number input of third roll. */
  @Input() public rollThree: number | undefined;

  /** Amount of struck pins in this frame. */
  @Input() public frameAmount: number;

  /** If true, the last roll box in the frame gets rendered. */
  @Input() public isLastFrame?: boolean = false;

  /** Number input of total game count. */
  @Input() public gameCount?: number | undefined;

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

    if (this.isLastFrame && this.frameAmount >= 20 && roll !== undefined) {
      result = "X";
    } else if (this.frameAmount === 10 && roll !== undefined) {
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
