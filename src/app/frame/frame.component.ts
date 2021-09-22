import { Component, Input } from "@angular/core";

@Component({
  selector: "app-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.scss"],
})
export class FrameComponent {
  /** Number input of first roll. */
  @Input() public set rollOne(roll: number) {
    this._rollOne = roll;
    this._frameAmount = roll;
  }
  public get rollOne(): number {
    return this._rollOne;
  }

  /** Number input of second roll. */
  @Input() public set rollTwo(roll: number) {
    this._rollTwo = roll;
    this._frameAmount = this._frameAmount + roll;
  }
  public get rollTwo(): number {
    return this._rollTwo;
  }

  /** Number input of third roll. */
  @Input() public set rollThree(roll: number) {
    this._rollThree = roll;
    this._frameAmount = this._frameAmount + roll;
  }
  public get rollThree(): number {
    return this._rollThree;
  }

  /** If true, the last roll box in the frame gets rendered. */
  @Input() public isLastFrame?: boolean = false;

  /** Number input of total game amount. */
  @Input() public gameAmount?: number;

  private _frameAmount = 0; // amount of struck pins in this frame
  private _rollOne = 0;
  private _rollTwo = 0;
  private _rollThree = 0;

  /**
   * Converts the rolled number into a string.
   * If 10 was rolled, "X" is returned.
   *
   * * @param roll - the rolled number
   */
  public convertToPossibleStrike(roll: number): string {
    let result = "";
    roll === 10 ? (result = "X") : (result = String(roll));

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
    this._frameAmount >= 10 ? (result = "/") : (result = String(roll));

    return result;
  }
}
