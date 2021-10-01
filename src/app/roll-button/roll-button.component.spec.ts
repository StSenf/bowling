import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

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

  it("emits 'rolledPin' event when button gets clicked", () => {
    spyOn(component.rolledPin, "emit");

    const rollBtn: HTMLElement = element.querySelector("button");
    rollBtn.click();

    expect(component.rolledPin.emit).toHaveBeenCalled();
  });
});
