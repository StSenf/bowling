import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-roll-button",
  templateUrl: "./roll-button.component.html",
  styleUrls: ["./roll-button.component.scss"],
})
export class RollButtonComponent {
  /** Maximum amount of pins that can be rolled. */
  @Input() public set max(val: number) {
    this._max = val;
  }
  public get max(): number {
    return this._max;
  }

  /** If true the button gets disabled and can't be interacted with. */
  @Input() public disabled: boolean;

  /** Emits the currently rolled pin amount. */
  @Output() public rolledPin: EventEmitter<number> = new EventEmitter<number>();

  private _max = 10;

  /**
   * Methode to strike pins.
   */
  public strikePins(): void {
    const roll: number = this.rollIntegerInRange(0, this._max);
    this.rolledPin.emit(roll);
  }

  /**
   * Returns a random integer in range of a minimum and maximum.
   * The returned value is no lower than (and may possibly equal) min, and is
   * less or equal than max.
   */
  private rollIntegerInRange(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }
}
