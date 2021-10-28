import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IFrame } from "../bowling.interface";

import { FrameComponent } from "./frame.component";

describe("FrameComponent", () => {
  let component: FrameComponent;
  let fixture: ComponentFixture<FrameComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  const framesGame = new Map<number, IFrame>([
    [0, { rolledPins: [7, 2], gameCount: 9 }],
    [1, { rolledPins: [10], gameCount: 31 }],
    [2, { rolledPins: [10], gameCount: 45 }],
    [3, { rolledPins: [2, 2], gameCount: 49 }],
    [4, { rolledPins: [3, 7], gameCount: 62 }],
    [5, { rolledPins: [3, 0], gameCount: 65 }],
    [9, { rolledPins: [7, 3, 10], gameCount: 123 }],
    [8, { rolledPins: [10, 10, 10], gameCount: 123 }],
    [7, { rolledPins: [10, 10, 3], gameCount: 123 }],
  ]);

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

    component.index = 0; // bc input is mandatory must set default value
    component.framesOfGame = framesGame;

    fixture.detectChanges();
  });

  describe("roll boxes", () => {
    describe("first roll box", () => {
      it("should render rolled number", () => {
        component.index = 0;
        fixture.detectChanges();

        const firstBox = element.querySelector(".roll-1");

        expect(firstBox.innerHTML).toBe("7");
      });

      it("should render 'X' if a 10 was rolled (STRIKE)", () => {
        component.index = 1;
        fixture.detectChanges();

        const firstBox = element.querySelector(".roll-1");

        expect(firstBox.innerHTML).toBe("X");
      });
    });

    describe("second roll box", () => {
      it("should render rolled number", () => {
        component.index = 0;
        fixture.detectChanges();

        const secondBox: HTMLElement = element.querySelector(".roll-2");

        expect(secondBox.innerHTML).toBe("2");
      });

      describe("in regular frame", () => {
        it(
          "should render '/' if first and second roll " +
            "sum up to 10 (SPARE)",
          () => {
            component.index = 4;
            fixture.detectChanges();

            const firstBox: HTMLElement = element.querySelector(".roll-1");
            const secondBox: HTMLElement = element.querySelector(".roll-2");

            expect(firstBox.innerHTML).toBe("3");
            expect(secondBox.innerHTML).toBe("/");
          }
        );

        it("should render nothing if first roll was strike", () => {
          component.index = 2;
          fixture.detectChanges();

          const firstBox: HTMLElement = element.querySelector(".roll-1");
          const secondBox: HTMLElement = element.querySelector(".roll-2");

          expect(firstBox.innerHTML).toBe("X");
          expect(secondBox.innerHTML).toBe("");
        });
      });

      describe("in last frame", () => {
        it(
          "should render '/' if first and second roll " +
            "sum up to 10 (SPARE)",
          () => {
            component.index = 9;
            component.isLastFrame = true;
            fixture.detectChanges();

            const firstBox: HTMLElement = element.querySelector(".roll-1");
            const secondBox: HTMLElement = element.querySelector(".roll-2");

            expect(firstBox.innerHTML).toBe("7");
            expect(secondBox.innerHTML).toBe("/");
          }
        );

        it(
          "should render 'X' if first roll was strike" +
            " and second is strike",
          () => {
            component.index = 8;
            component.isLastFrame = true;
            fixture.detectChanges();

            const firstBox: HTMLElement = element.querySelector(".roll-1");
            const secondBox: HTMLElement = element.querySelector(".roll-2");

            expect(firstBox.innerHTML).toBe("X");
            expect(secondBox.innerHTML).toBe("X");
          }
        );

        it("should render 'X' if all rolls strike", () => {
          component.index = 8;
          component.isLastFrame = true;
          fixture.detectChanges();

          const firstBox: HTMLElement = element.querySelector(".roll-1");
          const secondBox: HTMLElement = element.querySelector(".roll-2");
          const thirdBox: HTMLElement = element.querySelector(".roll-3");

          expect(firstBox.innerHTML).toBe("X");
          expect(secondBox.innerHTML).toBe("X");
          expect(thirdBox.innerHTML.trim()).toBe("X");
        });
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
        component.index = 7;
        fixture.detectChanges();

        const thirdBox: HTMLElement = element.querySelector(".roll-3");

        expect(thirdBox.innerHTML.trim()).toBe("3");
      });

      it("should render 'X' if 10 was rolled", () => {
        component.isLastFrame = true;
        component.index = 9;
        fixture.detectChanges();

        const thirdBox: HTMLElement = element.querySelector(".roll-3");

        expect(thirdBox.innerHTML.trim()).toBe("X");
      });
    });
  });

  describe("game total amount", () => {
    it("should be rendered", () => {
      component.index = 3;
      fixture.detectChanges();

      const gameAmount: HTMLElement = element.querySelector(".game-amount");

      expect(gameAmount.innerHTML).toBe("49");
    });
  });
});
