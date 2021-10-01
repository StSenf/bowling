import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrameComponent } from "./frame.component";

fdescribe("FrameComponent", () => {
  let component: FrameComponent;
  let fixture: ComponentFixture<FrameComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrameComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  describe("roll boxes", () => {
    describe("first roll box", () => {
      it("should render rolled number", () => {
        component.rollOne = 7;
        fixture.detectChanges();

        const firstBox = element.querySelector(".roll-1");

        expect(firstBox.innerHTML).toBe("7");
      });

      it("should render 'X' if a 10 was rolled (STRIKE)", () => {
        component.rollOne = 10;
        fixture.detectChanges();

        const firstBox = element.querySelector(".roll-1");

        expect(firstBox.innerHTML).toBe("X");
      });
    });

    describe("second roll box", () => {
      it("should render rolled number", () => {
        component.rollTwo = 2;
        fixture.detectChanges();

        const secondBox: HTMLElement = element.querySelector(".roll-2");

        expect(secondBox.innerHTML).toBe("2");
      });

      it(
        "should render '/' if first and second roll " + "sum up to 10 (SPARE)",
        () => {
          component.rollOne = 1;
          component.rollTwo = 9;
          component.frameAmount = 10;
          fixture.detectChanges();

          const firstBox: HTMLElement = element.querySelector(".roll-1");
          const secondBox: HTMLElement = element.querySelector(".roll-2");

          expect(firstBox.innerHTML).toBe("1");
          expect(secondBox.innerHTML).toBe("/");
        }
      );

      it("should render nothing if first roll was strike", () => {
        component.rollOne = 10;
        component.frameAmount = 10;
        fixture.detectChanges();

        const firstBox: HTMLElement = element.querySelector(".roll-1");
        const secondBox: HTMLElement = element.querySelector(".roll-2");

        expect(firstBox.innerHTML).toBe("X");
        expect(secondBox.innerHTML).toBe("");
      });
    });

    describe("third roll box", () => {
      it("should be rendered if configured", () => {
        component.isLastFrame = true;
        fixture.detectChanges();

        const thirdBox: HTMLElement = element.querySelector(".roll-3");

        expect(thirdBox).not.toBeNull();
      });

      it("should not be rendered if not configured", () => {
        component.isLastFrame = false;
        fixture.detectChanges();

        const thirdBox: HTMLElement = element.querySelector(".roll-3");

        expect(thirdBox).toBeNull();
      });

      it("should render rolled number", () => {
        component.isLastFrame = true;
        component.rollThree = 2;
        fixture.detectChanges();

        const thirdBox: HTMLElement = element.querySelector(".roll-3");

        expect(thirdBox.innerHTML).toBe("2");
      });
    });
  });

  describe("game total amount", () => {
    it("should be rendered", () => {
      component.gameAmount = 56;
      fixture.detectChanges();

      const gameAmount: HTMLElement = element.querySelector(".game-amount");

      expect(gameAmount.innerHTML).toBe("56");
    });
  });
});
