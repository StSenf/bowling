import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { take } from "rxjs/operators";

import { RollButtonComponent } from "./roll-button.component";

describe("RollButtonComponent", () => {
  let component: RollButtonComponent;
  let fixture: ComponentFixture<RollButtonComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RollButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollButtonComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  it("only roles numbers less or equal max", (done: DoneFn) => {
    const testMaxArray = [5, 10, 1];

    testMaxArray.forEach((max: number) => {
      component.max = max;

      component.rolledPin.pipe(take(1)).subscribe((pin: number) => {
        expect(pin).toBeLessThanOrEqual(max);
        done();
      });

      component.strikePins();
    });
  });

  it("is disabled when configured as disabled", () => {
    component.disabled = true;
    fixture.detectChanges();

    const rollBtn: HTMLElement = element.querySelector("button");

    expect(rollBtn.getAttribute("disabled")).not.toBeNull();
  });

  it("emits 'rolledPin' event when button gets clicked", () => {
    spyOn(component.rolledPin, "emit");

    const rollBtn: HTMLElement = element.querySelector("button");
    rollBtn.click();

    expect(component.rolledPin.emit).toHaveBeenCalled();
  });
});
