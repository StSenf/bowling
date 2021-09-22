import { Component, Input } from "@angular/core";

@Component({
  selector: "app-roll-button",
  templateUrl: "./roll-button.component.html",
  styleUrls: ["./roll-button.component.scss"],
})
export class RollButtonComponent {
  /** If true, it is possible to roll three times. */
  @Input() public set isLastFrame(val: boolean) {
    this._isLastFrame = val;
  }
  public get isLastFrame(): boolean {
    return this._isLastFrame;
  }

  private _isLastFrame = false;
  private _rollCount = 0;
  private _rolledPins: number[] = [];
  private _frameAmount = 0; // total amount of struck pins in this frame

  /**
   * Methode to strike pins.
   */
  public strikePins(): void {
    const isFirstRoll: boolean = this._rollCount === 0;
    const isSecondRoll: boolean = this._rollCount === 1;
    // third roll in last frame only if spare or strike was done before
    const isThirdRoll: boolean =
      this._rollCount === 2 && this._isLastFrame && this._frameAmount >= 10;

    // first roll
    if (isFirstRoll) {
      const firstRoll: number = this.rollIntegerInRange(0, 10);
      this.accumulatePins(firstRoll);
      this._rollCount++;

      // ToDo: send rolled pins array to the world

      console.log(this._rolledPins);
    }

    // second roll
    if (isSecondRoll) {
      let secondRoll: number;

      // if first was strike
      if (this._frameAmount === 10) {
        secondRoll = this.rollIntegerInRange(0, 10);
      } else {
        secondRoll = this.rollIntegerInRange(0, 10 - this._frameAmount);
      }

      this.accumulatePins(secondRoll);
      this._rollCount++;
      console.log(this._rolledPins);

      // ToDo: send rolled pins array to the world

      // if no third roll is possible
      if (this._isLastFrame && this._frameAmount < 10) {
        this.clearInternalCounts();
      }
    }

    // third roll
    if (isThirdRoll) {
      let thirdRoll: number;

      // if first and second are spare or 2 strikes
      if (this._frameAmount === 10 || this._frameAmount === 20) {
        thirdRoll = this.rollIntegerInRange(0, 10);
      } else {
        thirdRoll = this.rollIntegerInRange(0, 20 - this._frameAmount);
      }

      this.accumulatePins(thirdRoll);
      this._rollCount++;
      console.log(this._rolledPins);

      // ToDo: send rolled pins array to the world
      this.clearInternalCounts();
    }
  }

  /**
   * Returns a random integer in range of a minimum and maximum.
   * The returned value is no lower than (and may possibly equal) min, and is
   * less or equal than max.
   */
  private rollIntegerInRange(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  /**
   * Fills inner array with rolled pins (e.g. [8, 1]).
   * Counts the struck pins for the frame together.
   */
  private accumulatePins(roll: number): void {
    this._rolledPins.push(roll);
    this._frameAmount = this._frameAmount + roll;
  }
  /**
   * Clear roll count.
   * Clear rolled pins array.
   * Clear frame amount.
   */
  private clearInternalCounts(): void {
    this._rollCount = 0;
    this._rolledPins = [];
    this._frameAmount = 0;
  }
}
