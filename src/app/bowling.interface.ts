/**
 * Interface that represents a Frame of the game.
 */
export interface IFrame {
  /** list of the struck pins in the frame, e.g. [5, 4] */
  rolledPins?: number[];
  /** current game count that is rendered inside the frame */
  gameCount?: number;
}
