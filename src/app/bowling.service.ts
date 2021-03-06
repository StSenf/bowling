import { Injectable } from "@angular/core";
import { ICurrentFrameCount, IFrame } from "./bowling.interface";

/**
 * helper functions for the Bowling game.
 */
@Injectable({
  providedIn: "root",
})
export class BowlingService {
  /** Returns the total amount of struck pins in this frame. */
  public getFrameAmount(
    framesOfGame: Map<number, IFrame>,
    index: number
  ): number | undefined {
    return (
      framesOfGame.get(index).rolledPins &&
      framesOfGame.get(index).rolledPins.reduce((a, b) => a + b, 0)
    );
  }

  /** Returns true if NOT first or last frame. */
  public isRegularFrame(frameIdx: number): boolean {
    return frameIdx > 0 && frameIdx < 9;
  }

  /** Returns true if last frame. */
  public isLastFrame(frameIdx: number): boolean {
    return frameIdx === 9;
  }

  /** Returns true if first frame. */
  public isFirstFrame(frameIdx: number): boolean {
    return frameIdx === 0;
  }

  /** Returns true if first roll in frame. */
  public isFirstRoll(rollIdx: number): boolean {
    return rollIdx === 0;
  }

  /** Returns true if second roll in frame. */
  public isSecondRoll(rollIdx: number): boolean {
    return rollIdx === 1;
  }

  /** Returns true if third roll in frame. */
  public isThirdRoll(rollIdx: number): boolean {
    return rollIdx === 2;
  }

  /** Returns true if first roll in frame was strike. */
  public isFirstRollStrike(currentFrame: ICurrentFrameCount): boolean {
    return (
      this.isFirstRoll(currentFrame.rollIndex) && currentFrame.amount === 10
    );
  }

  /** Returns true if previous frame was spare. */
  public isPrevFrameSpare(
    framesGame: Map<number, IFrame>,
    currentFrame: ICurrentFrameCount
  ): boolean {
    return (
      framesGame.get(currentFrame.index - 1) &&
      framesGame
        .get(currentFrame.index - 1)
        .rolledPins.reduce((a, b) => a + b, 0) === 10 &&
      framesGame.get(currentFrame.index - 1).rolledPins[0] !== 10
    );
  }

  /** Returns true if previous frame was strike. */
  public isPrevFrameStrike(
    framesGame: Map<number, IFrame>,
    currentFrame: ICurrentFrameCount
  ): boolean {
    return (
      framesGame.get(currentFrame.index - 1) &&
      framesGame.get(currentFrame.index - 1).rolledPins[0] === 10
    );
  }

  /** Returns true if previous of previous frame was strike. */
  public isPrevPrevFrameStrike(
    framesGame: Map<number, IFrame>,
    currentFrame: ICurrentFrameCount
  ): boolean {
    return (
      framesGame.get(currentFrame.index - 2) &&
      framesGame.get(currentFrame.index - 2).rolledPins[0] === 10
    );
  }

  /** Returns true if the last roll in frame is reached. */
  public isLastRollInFrameReached(currentFrame: ICurrentFrameCount): boolean {
    return (
      (this.isFirstFrame(currentFrame.index) ||
        this.isRegularFrame(currentFrame.index)) &&
      (this.isSecondRoll(currentFrame.rollIndex) ||
        this.isFirstRollStrike(currentFrame))
    );
  }

  /** Returns true if last roll in last frame is reached. */
  public isLastRollInLastFrameReached(
    currentFrame: ICurrentFrameCount
  ): boolean {
    return (
      (this.isLastFrame(currentFrame.index) &&
        this.isSecondRoll(currentFrame.rollIndex) &&
        currentFrame.amount < 10) ||
      (this.isLastFrame(currentFrame.index) &&
        this.isThirdRoll(currentFrame.rollIndex))
    );
  }
}
