/**
 * Interface that represents a Frame of the game.
 */
export interface IFrame {
  /** list of the struck pins in the frame, e.g. [5, 4] */
  rolledPins?: number[];
  /** current game count that is rendered inside the frame */
  gameCount?: number;
}

/**
 * Interface that is used during the game for
 * calculation and storing of all frames.
 */
export interface ICurrentFrame extends IFrame {
  /** index of the frame in the game */
  index: number;
  /** sum of rolled pins of the current frame */
  amount: number;
  /**
   * roll index in current frame
   * can only be 0 or 1 (in last frame 2 is also possible)
   */
  rollIndex: number;
}
