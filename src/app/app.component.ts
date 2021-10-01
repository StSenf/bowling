import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  /** If true the game is over and roll button is disabled. */
  public isGameOver = false;

  /** Holds all frames with their rolled pins. */
  public framesOfGame = new Map<number, number[]>([
    [0, []],
    [1, []],
    [2, []],
    [3, []],
    [4, []],
    [5, []],
    [6, []],
    [7, []],
    [8, []],
    [9, []],
  ]);

  /** Maximum amount of pins that can be rolled in the frame. */
  public set currentFrameRemainingPins(val: number) {
    this._currentFrameRemainingPins = val;
  }
  public get currentFrameRemainingPins(): number {
    return this._currentFrameRemainingPins;
  }

  /** Returns the total amount of struck pins in this frame. */
  public getFrameAmount(index: number): number {
    return this.framesOfGame.get(index).reduce((a, b) => a + b, 0);
  }

  /** Returns first roll of frame or 0. */
  public getRollOneOfFrame(index: number): number | undefined {
    return this.framesOfGame.get(index)[0];
  }

  /** Returns second roll of frame or 0. */
  public getRollTwoOfFrame(index: number): number | undefined {
    return this.framesOfGame.get(index)[1];
  }

  /** Returns third roll of frame or 0. */
  public getRollThreeOfFrame(index: number): number | undefined {
    return this.framesOfGame.get(index)[2];
  }

  private _currentFrameIdx = 0; // frame we are currently at
  private _currentFrameAmount = 0;
  private _currentFrameRollIdx = 0;
  private _currentFrameRolledPins: number[] = [];
  private _currentFrameRemainingPins = 10;
  private _currentGameAmountInFrame = 0;

  public doMagic(rolledPin: number): void {
    const isRegularFrame: boolean = this._currentFrameIdx < 9;
    const isLastFrame: boolean = this._currentFrameIdx === 9;
    const isSecondRoll: boolean = this._currentFrameRollIdx === 1;
    const isThirdRoll: boolean = this._currentFrameRollIdx === 2;
    const isFirstRollStrike: boolean =
      isSecondRoll && this._currentFrameAmount === 10;

    if (isRegularFrame && (isThirdRoll || isFirstRollStrike)) {
      this.gotToNextFrame();
      this.clearInternalFrameCounts();
    }

    this._currentFrameRolledPins.push(rolledPin);
    this._currentFrameAmount = this._currentFrameAmount + rolledPin;
    this.framesOfGame.set(this._currentFrameIdx, this._currentFrameRolledPins);

    if (
      (isLastFrame && isSecondRoll && this._currentFrameAmount < 10) ||
      (isLastFrame && isThirdRoll)
    ) {
      this.finishGame();
    } else {
      this.gotToNextRoll();
    }

    this.currentFrameRemainingPins = this.getRemainingPins(
      this._currentFrameRollIdx,
      this._currentFrameAmount
    );
  }

  /**
   * Counts up the current frame index.
   * The frame index is used to save the rolls to the correct
   * position of the 'framesOfGame' Map.
   */
  private gotToNextFrame(): void {
    this._currentFrameIdx++;
  }

  /**
   * Clears all internal frame counts for the new frame we are located at.
   */
  private clearInternalFrameCounts(): void {
    this._currentFrameAmount = 0;
    this._currentFrameRollIdx = 0;
    this._currentFrameRolledPins = [];
    this._currentGameAmountInFrame = 0;
    this._currentFrameRemainingPins = 10;
  }

  /** Counts up the current roll index. */
  private gotToNextRoll(): void {
    this._currentFrameRollIdx++;
  }

  /**
   * Finishes game by setting boolean flag to true.
   * Button can't be clicked anymore.
   */
  private finishGame(): void {
    this.isGameOver = true;
  }

  /**
   * Returns how many pins are still standing resp. are there to strike.
   *
   * 1st roll: 10 pins are there.
   * 2nd roll: 10 pins are there if first was strike, or 10 - frameAmount.
   * 3rd roll: 10 pins are there if first and second are spare or 2 strikes,
   * or 20 - frameAmount
   */
  private getRemainingPins(rollIdx: number, frameAmount: number): number {
    let remainingPins = 10 - frameAmount;

    // third roll in last frame
    if (this._currentFrameIdx === 9 && rollIdx === 2 && frameAmount >= 10) {
      if (frameAmount === 10 || frameAmount === 20) {
        remainingPins = 10;
      } else {
        remainingPins = 20 - frameAmount;
      }
    }

    return remainingPins;
  }
}
