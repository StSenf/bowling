import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "bowling-roll-button",
  templateUrl: "./roll-button.component.html",
  styleUrls: ["./roll-button.component.scss"],
})
export class RollButtonComponent {
  /** Maximum amount of pins that can be rolled. */
  @Input() public max = 10;

  /** If true the button gets disabled and can't be interacted with. */
  @Input() public disabled: boolean;

  /** Emits the currently rolled pin amount. */
  @Output() public rolledPin: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Methode to strike pins.
   */
  public strikePins(): void {
    const roll: number = this.rollIntegerInRange(0, this.max);
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
