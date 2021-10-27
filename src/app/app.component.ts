import { Component } from "@angular/core";

import { ICurrentFrameCount, IFrame } from "./bowling.interface";
import { BowlingService } from "./bowling.service";

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
    [0, { rolledPins: [] }],
    [1, { rolledPins: [] }],
    [2, { rolledPins: [] }],
    [3, { rolledPins: [] }],
    [4, { rolledPins: [] }],
    [5, { rolledPins: [] }],
    [6, { rolledPins: [] }],
    [7, { rolledPins: [] }],
    [8, { rolledPins: [] }],
    [9, { rolledPins: [] }],
  ]);

  /** Maximum amount of pins that can be rolled. */
  public set availablePins(val: number) {
    this._availablePins = val;
  }
  public get availablePins(): number {
    return this._availablePins;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(private _bwSrv: BowlingService) {}

  // internal frame counts
  private _availablePins = 10;
  private _currentFrame: ICurrentFrameCount = {
    amount: 0,
    index: 0,
    rollIndex: 0,
  };

  public playBowling(rolledPin: number): void {
    // sum up frame amount
    this._currentFrame.amount = this._currentFrame.amount + rolledPin;

    // save the rolled pins and calculated game count
    const frameData = this.framesGame.get(this._currentFrame.index);
    this.framesGame.set(this._currentFrame.index, {
      rolledPins: [...frameData.rolledPins, rolledPin],
      gameCount: this.calculateGameCountInFrame(rolledPin),
    });

    // calculate available pins for next roll
    this.availablePins = this.getAvailablePins(this._currentFrame);

    if (this._bwSrv.isLastRollInLastFrameReached(this._currentFrame)) {
      this.finishGame();
    }

    if (this._bwSrv.isLastRollInFrameReached(this._currentFrame)) {
      this.gotToNextFrame();
    } else {
      this.gotToNextRoll();
    }
  }

  /**
   * Calculates the current game count.
   * Calculates therefore the game count of previous frame and sums up
   * with current frame amount.
   *
   * @param rolledPin - rolled pin number
   */
  private calculateGameCountInFrame(rolledPin: number): number {
    let result: number;

    // if SPARE
    if (
      this._bwSrv.isPrevFrameSpare(this.framesGame, this._currentFrame) &&
      this._bwSrv.isFirstRoll(this._currentFrame.rollIndex)
    ) {
      this.addBonusPinToPrecedingFrame(rolledPin, 1);
    }

    // if 2 STRIKES follow each other
    // e.g. [[10], [10], [3,2]]
    if (
      this._bwSrv.isPrevPrevFrameStrike(this.framesGame, this._currentFrame) &&
      this._bwSrv.isPrevFrameStrike(this.framesGame, this._currentFrame) &&
      this._bwSrv.isFirstRoll(this._currentFrame.rollIndex)
    ) {
      this.addBonusPinToPrecedingFrame(rolledPin, 2);
      this.addBonusPinToPrecedingFrame(rolledPin, 1);
    }

    // if STRIKE
    // e.g. [[10], [2,3]]
    if (
      this._bwSrv.isPrevFrameStrike(this.framesGame, this._currentFrame) &&
      !this._bwSrv.isThirdRoll(this._currentFrame.rollIndex)
    ) {
      this.addBonusPinToPrecedingFrame(rolledPin, 1);
    }

    // Sum up
    if (this._bwSrv.isFirstFrame(this._currentFrame.index)) {
      result = this._currentFrame.amount;
    } else {
      result = this.sumUpCurrentGameCountWithFrameAmount(
        this._currentFrame.amount
      );
    }

    return result;
  }

  /**
   * Adds the rolled pin as a bonus to a preceding frame.
   *
   * @param rolledPin - the rolled pin number
   * @param predecessor - how many steps back we should go
   */
  private addBonusPinToPrecedingFrame(
    rolledPin: number,
    predecessor: number
  ): void {
    const precedingFrame: IFrame = this.framesGame.get(
      this._currentFrame.index - predecessor
    );
    this.framesGame.set(this._currentFrame.index - predecessor, {
      ...precedingFrame,
      gameCount: precedingFrame.gameCount + rolledPin,
    });
  }

  /**
   * Sums up the current game amount (located in the prev frame object) with
   * the amount of the frame.
   * @param frameAmount - current total count in frame
   */
  private sumUpCurrentGameCountWithFrameAmount(frameAmount: number): number {
    return (
      this.framesGame.get(this._currentFrame.index - 1).gameCount + frameAmount
    );
  }

  /**
   * Returns how many pins are still standing resp. are there to strike.
   *
   * 1st roll: 10
   * 2nd roll: 10 - struck pins
   * 3rd roll: 10 (if 1st and 2nd are spare or 2 strikes), or 20 - struck pins
   */
  private getAvailablePins(currentFrame: ICurrentFrameCount): number {
    let availablePins = 10; // at start always 10 available

    if (
      this._bwSrv.isFirstRoll(currentFrame.rollIndex) &&
      currentFrame.amount !== 10
    ) {
      availablePins = 10 - currentFrame.amount;
    }

    // for third roll in last frame
    if (
      this._bwSrv.isLastFrame(currentFrame.index) &&
      this._bwSrv.isSecondRoll(currentFrame.rollIndex) &&
      currentFrame.amount >= 10
    ) {
      if (currentFrame.amount === 10 || currentFrame.amount === 20) {
        availablePins = 10;
      } else {
        availablePins = 20 - currentFrame.amount;
      }
    }

    return availablePins;
  }

  /**
   * Counts up the current frame index and clears
   * the internal counts for the new index.
   */
  private gotToNextFrame(): void {
    const index: number = this._currentFrame.index + 1;
    this._currentFrame = {
      amount: 0,
      index,
      rollIndex: 0,
    };
  }

  /** Counts up the current roll index. */
  private gotToNextRoll(): void {
    this._currentFrame.rollIndex++;
  }

  /**
   * Finishes game by setting boolean flag to true.
   * Button can't be clicked anymore.
   */
  private finishGame(): void {
    this.isGameOver = true;
  }
}
