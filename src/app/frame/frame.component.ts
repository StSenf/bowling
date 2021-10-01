import { Component, Input } from "@angular/core";

@Component({
  selector: "app-frame",
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

  /** Number input of total game amount. */
  @Input() public gameAmount?: number;

  /**
   * Converts the rolled number into a string.
   * If 10 was rolled, "X" is returned.
   *
   * * @param roll - the rolled number
   */
  public convertToPossibleStrike(roll: number): string {
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
   * If the frame amount is 10 or higher (could happen in last frame),
   * "/" is returned.
   *
   * @param roll - the rolled number
   */
  public convertToPossibleSpare(roll: number): string {
    let result = "";

    if (this.frameAmount >= 10 && roll !== undefined) {
      result = "/";
    } else if (roll === undefined) {
      result = "";
    } else {
      result = String(roll);
    }

    return result;
  }
}
