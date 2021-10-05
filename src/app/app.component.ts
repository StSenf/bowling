import { Component } from "@angular/core";

interface IFrame {
  /** list of the struck pins in the frame, e.g. [5, 4] */
  rolledPins?: number[];
  /** current game count that is rendered inside the frame */
  gameCount?: number;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  /** If true the game is over and roll button is disabled. */
  public isGameOver = false;

  /** Holds all frames with their rolled pins. */
  public framesGame = new Map<number, IFrame>([
    [0, {}],
    [1, {}],
    [2, {}],
    [3, {}],
    [4, {}],
    [5, {}],
    [6, {}],
    [7, {}],
    [8, {}],
    [9, {}],
  ]);

  /** Maximum amount of pins that can be rolled. */
  public set availablePins(val: number) {
    this._availablePins = val;
  }
  public get availablePins(): number {
    return this._availablePins;
  }

  /** Returns the total amount of struck pins in this frame. */
  public getFrameAmount(index: number): number | undefined {
    return (
      this.framesGame.get(index).rolledPins &&
      this.framesGame.get(index).rolledPins.reduce((a, b) => a + b, 0)
    );
  }

  /** Returns the stored game count of each frame. */
  public getGameCountOfFrame(index: number): number | undefined {
    return this.framesGame.get(index).gameCount;
  }

  /** Returns first roll of frame. */
  public getRollOneOfFrame(index: number): number | undefined {
    return (
      this.framesGame.get(index).rolledPins &&
      this.framesGame.get(index).rolledPins[0]
    );
  }

  /** Returns second roll of frame. */
  public getRollTwoOfFrame(index: number): number | undefined {
    return (
      this.framesGame.get(index).rolledPins &&
      this.framesGame.get(index).rolledPins[1]
    );
  }

  /** Returns third roll of frame. */
  public getRollThreeOfFrame(index: number): number | undefined {
    return (
      this.framesGame.get(index).rolledPins &&
      this.framesGame.get(index).rolledPins[2]
    );
  }

  // internal frame counts
  private _currentFrameIdx = 0;
  private _currentFrameAmount = 0;
  private _currentFrameRollIdx = 0;
  private _currentFrameRolledPins: number[] = [];
  private _availablePins = 10;
  private _currentGameCountInFrame = 0;

  public playBowling(rolledPin: number): void {
    if (
      (this.isFirstFrame() || this.isRegularFrame()) &&
      (this.isThirdRoll() || this.isFirstRollStrike())
    ) {
      this.gotToNextFrame();
      this.clearInternalFrameCounts();
    }

    this._currentFrameRolledPins.push(rolledPin);
    this._currentFrameAmount = this._currentFrameAmount + rolledPin;

    // save the rolled pins
    this.framesGame.set(this._currentFrameIdx, {
      rolledPins: this._currentFrameRolledPins,
    });

    // calculate the game count
    this._currentGameCountInFrame = this.calculateGameCountInFrame(
      this._currentFrameAmount,
      rolledPin,
      this._currentFrameRollIdx
    );

    // save the game count
    const frameData = this.framesGame.get(this._currentFrameIdx);
    this.framesGame.set(this._currentFrameIdx, {
      ...frameData,
      gameCount: this._currentGameCountInFrame,
    });

    if (
      (this.isLastFrame() &&
        this.isSecondRoll() &&
        this._currentFrameAmount < 10) ||
      (this.isLastFrame() && this.isThirdRoll())
    ) {
      this.finishGame();
    } else {
      this.gotToNextRoll();
    }

    this.availablePins = this.getAvailablePins(this._currentFrameAmount);
  }

  /**
   * Counts up the current frame index.
   * The frame index is used to save the rolls to the correct
   * position of the Map.
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
    this._currentGameCountInFrame = 0;
    this._availablePins = 10;
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
  private getAvailablePins(frameAmount: number): number {
    let availablePins = 10; // at start always 10 available

    if (this.isSecondRoll() && frameAmount !== 10) {
      availablePins = 10 - frameAmount;
    }

    // third roll in last frame
    if (this.isLastFrame() && this.isThirdRoll() && frameAmount >= 10) {
      if (frameAmount === 10 || frameAmount === 20) {
        availablePins = 10;
      } else {
        availablePins = 20 - frameAmount;
      }
    }

    return availablePins;
  }

  /**
   * Calculates the current game count.
   * Calculates therefore the game count of previous frame and sums up
   * with current frame amount.
   */
  private calculateGameCountInFrame(
    frameAmount: number,
    rolledPin: number,
    frameRollIdx: number
  ): number {
    let result: number = frameAmount; // first frame default

    if (this.isRegularFrame() || this.isLastFrame()) {
      if (
        (this.isPrevFrameSpare() && frameRollIdx === 0) ||
        this.isPrevFrameStrike()
      ) {
        this.addBonusPinToPrevFrame(rolledPin);
      }
      result = this.sumUpCurrentGameCountWithFrameAmount(frameAmount);
    }

    return result;
  }

  /** Returns true if NOT first or last frame. */
  private isRegularFrame(): boolean {
    return this._currentFrameIdx > 0 && this._currentFrameIdx < 9;
  }

  /** Returns true if last frame. */
  private isLastFrame(): boolean {
    return this._currentFrameIdx === 9;
  }

  /** Returns true if first frame. */
  private isFirstFrame(): boolean {
    return this._currentFrameIdx === 0;
  }

  /** Returns true if second roll in frame. */
  private isSecondRoll(): boolean {
    return this._currentFrameRollIdx === 1;
  }

  /** Returns true if third roll in frame. */
  private isThirdRoll(): boolean {
    return this._currentFrameRollIdx === 2;
  }

  /** Returns true if first roll in frame was strike. */
  private isFirstRollStrike(): boolean {
    return this.isSecondRoll() && this._currentFrameAmount === 10;
  }

  /** Returns true if previous frame was spare. */
  private isPrevFrameSpare(): boolean {
    return (
      this.framesGame
        .get(this._currentFrameIdx - 1)
        .rolledPins.reduce((a, b) => a + b, 0) === 10 &&
      this.framesGame.get(this._currentFrameIdx - 1).rolledPins[0] !== 10
    );
  }

  /** Returns true if previous frame was strike. */
  private isPrevFrameStrike(): boolean {
    return this.framesGame.get(this._currentFrameIdx - 1).rolledPins[0] === 10;
  }

  /**
   * Adds the rolled pin as a bonus to the previous frame.
   * Needed to add pins if prev frame was strike or spare.
   */
  private addBonusPinToPrevFrame(rolledPin: number): void {
    const prevFrame: IFrame = this.framesGame.get(this._currentFrameIdx - 1);

    this.framesGame.set(this._currentFrameIdx - 1, {
      ...prevFrame,
      gameCount: prevFrame.gameCount + rolledPin,
    });
  }

  /**
   * Sums up the current game amount (located in the prev frame object) with
   * the amount of the frame.
   */
  private sumUpCurrentGameCountWithFrameAmount(frameAmount: number): number {
    return (
      this.framesGame.get(this._currentFrameIdx - 1).gameCount + frameAmount
    );
  }
}
