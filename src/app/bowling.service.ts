import { Injectable } from "@angular/core";
import { IFrame } from "./bowling.interface";

@Injectable({
  providedIn: "root",
})
export class BowlingService {
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

  /** Returns true if second roll in frame. */
  public isSecondRoll(rollIdx: number): boolean {
    return rollIdx === 1;
  }

  /** Returns true if third roll in frame. */
  public isThirdRoll(rollIdx: number): boolean {
    return rollIdx === 2;
  }

  /** Returns true if first roll in frame was strike. */
  public isFirstRollStrike(rollIdx: number, frameAmount: number): boolean {
    return this.isSecondRoll(rollIdx) && frameAmount === 10;
  }

  /** Returns true if previous frame was spare. */
  public isPrevFrameSpare(
    framesGame: Map<number, IFrame>,
    frameIdx: number
  ): boolean {
    return (
      framesGame.get(frameIdx - 1) &&
      framesGame.get(frameIdx - 1).rolledPins.reduce((a, b) => a + b, 0) ===
        10 &&
      framesGame.get(frameIdx - 1).rolledPins[0] !== 10
    );
  }

  /** Returns true if previous frame was strike. */
  public isPrevFrameStrike(
    framesGame: Map<number, IFrame>,
    frameIdx: number
  ): boolean {
    return (
      framesGame.get(frameIdx - 1) &&
      framesGame.get(frameIdx - 1).rolledPins[0] === 10
    );
  }

  /** Returns true if previous of previous frame was strike. */
  public isPrevPrevFrameStrike(
    framesGame: Map<number, IFrame>,
    frameIdx: number
  ): boolean {
    return (
      framesGame.get(frameIdx - 2) &&
      framesGame.get(frameIdx - 2).rolledPins[0] === 10
    );
  }
}
