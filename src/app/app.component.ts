import { Component } from "@angular/core";
import { IFrame } from "./bowling.interface";
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

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(private _bwSrv: BowlingService) {}

  // internal frame counts
  private _currentFrameIdx = 0;
  private _currentFrameAmount = 0;
  private _currentFrameRollIdx = 0;
  private _currentFrameRolledPins: number[] = [];
  private _availablePins = 10;
  private _currentGameCountInFrame = 0;

  public playBowling(rolledPin: number): void {
    // check if we should go to next frame
    if (
      (this._bwSrv.isFirstFrame(this._currentFrameIdx) ||
        this._bwSrv.isRegularFrame(this._currentFrameIdx)) &&
      (this._bwSrv.isThirdRoll(this._currentFrameRollIdx) ||
        this._bwSrv.isFirstRollStrike(
          this._currentFrameRollIdx,
          this._currentFrameAmount
        ))
    ) {
      this.gotToNextFrame();
      this.clearInternalFrameCounts();
    }

    // ToDo: reduce/map statt push?
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

    // Check if game should finish
    // or if one more roll in frame
    // ToDo: rollIdx++ beißt sich mit should we go to next frame?
    if (
      (this._bwSrv.isLastFrame(this._currentFrameIdx) &&
        this._bwSrv.isSecondRoll(this._currentFrameRollIdx) &&
        this._currentFrameAmount < 10) ||
      (this._bwSrv.isLastFrame(this._currentFrameIdx) &&
        this._bwSrv.isThirdRoll(this._currentFrameRollIdx))
    ) {
      this.finishGame();
    } else {
      this.gotToNextRoll();
    }

    // calculate available pins for next roll
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
   * 1st roll: 10
   * 2nd roll: 10 - struck pins
   * 3rd roll: 10 (if 1st and 2nd are spare or 2 strikes), or 20 - struck pins
   *
   * @param frameAmount - current total count in frame
   */
  private getAvailablePins(frameAmount: number): number {
    let availablePins = 10; // at start always 10 available

    if (
      this._bwSrv.isSecondRoll(this._currentFrameRollIdx) &&
      frameAmount !== 10
    ) {
      availablePins = 10 - frameAmount;
    }

    // third roll in last frame
    if (
      this._bwSrv.isLastFrame(this._currentFrameIdx) &&
      this._bwSrv.isThirdRoll(this._currentFrameRollIdx) &&
      frameAmount >= 10
    ) {
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
   *
   * @param frameAmount - current total count in frame
   * @param rolledPin - rolled pin number
   * @param frameRollIdx - index of the current roll in frame
   */
  private calculateGameCountInFrame(
    frameAmount: number,
    rolledPin: number,
    frameRollIdx: number
  ): number {
    let result: number;

    // if SPARE
    if (
      this._bwSrv.isPrevFrameSpare(this.framesGame, this._currentFrameIdx) &&
      frameRollIdx === 0
    ) {
      this.addBonusPinToPrecedingFrame(rolledPin, 1);
    }

    // if 2 STRIKES follow each other
    // e.g. [[10], [10], [3,2]]
    if (
      this._bwSrv.isPrevPrevFrameStrike(
        this.framesGame,
        this._currentFrameIdx
      ) &&
      this._bwSrv.isPrevFrameStrike(this.framesGame, this._currentFrameIdx) &&
      frameRollIdx === 0
    ) {
      this.addBonusPinToPrecedingFrame(rolledPin, 2);
      this.addBonusPinToPrecedingFrame(rolledPin, 1);
    }

    // if STRIKE
    // e.g. [[10], [2,3]]
    if (
      this._bwSrv.isPrevFrameStrike(this.framesGame, this._currentFrameIdx) &&
      !this._bwSrv.isThirdRoll(this._currentFrameRollIdx)
    ) {
      this.addBonusPinToPrecedingFrame(rolledPin, 1);
    }

    // Sum up
    if (this._bwSrv.isFirstFrame(this._currentFrameIdx)) {
      result = frameAmount;
    } else {
      result = this.sumUpCurrentGameCountWithFrameAmount(frameAmount);
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
      this._currentFrameIdx - predecessor
    );

    this.framesGame.set(this._currentFrameIdx - predecessor, {
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
      this.framesGame.get(this._currentFrameIdx - 1).gameCount + frameAmount
    );
  }
}
