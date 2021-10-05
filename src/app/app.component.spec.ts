import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AppComponent } from "./app.component";
import { FrameComponent } from "./frame/frame.component";
import { RollButtonComponent } from "./roll-button/roll-button.component";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, FrameComponent, RollButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("perfect game reaches end score 300", () => {
    // 10 frames plus 2 extra rolls in last frame
    for (let i = 0; i < 12; i++) {
      component.playBowling(10);
    }

    expect(component.getGameCountOfFrame(9)).toBe(300);
    expect(component.getGameCountOfFrame(8)).toBe(270);
    expect(component.getGameCountOfFrame(7)).toBe(240);
    expect(component.getGameCountOfFrame(6)).toBe(210);
    expect(component.getGameCountOfFrame(5)).toBe(180);
    expect(component.getGameCountOfFrame(4)).toBe(150);
    expect(component.getGameCountOfFrame(3)).toBe(120);
    expect(component.getGameCountOfFrame(2)).toBe(90);
    expect(component.getGameCountOfFrame(1)).toBe(60);
    expect(component.getGameCountOfFrame(0)).toBe(30);
  });

  it("random game with only ones", () => {
    // 20rolls in normal game
    for (let i = 0; i < 20; i++) {
      component.playBowling(1);
    }

    expect(component.getGameCountOfFrame(9)).toBe(20);
  });

  it("random game with strike followed by spare", () => {
    component.playBowling(10);
    component.playBowling(5);
    component.playBowling(5);
    component.playBowling(7);
    for (let i = 4; i < 20; i++) {
      component.playBowling(0);
    }

    expect(component.getGameCountOfFrame(0)).toBe(20);
    expect(component.getGameCountOfFrame(1)).toBe(37);
    expect(component.getGameCountOfFrame(2)).toBe(44);
    expect(component.getGameCountOfFrame(9)).toBe(44);
  });

  it("random game with strike followed by normal rolls", () => {
    component.playBowling(10);
    component.playBowling(2);
    component.playBowling(3);
    for (let i = 3; i < 20; i++) {
      component.playBowling(0);
    }

    expect(component.getGameCountOfFrame(0)).toBe(15);
    expect(component.getGameCountOfFrame(1)).toBe(20);
    expect(component.getGameCountOfFrame(9)).toBe(20);
  });

  it("random game with 2 strikes followed by normal rolls", () => {
    component.playBowling(10);
    component.playBowling(10);
    component.playBowling(3);
    component.playBowling(2);
    for (let i = 4; i < 20; i++) {
      component.playBowling(0);
    }

    expect(component.getGameCountOfFrame(0)).toBe(23);
    expect(component.getGameCountOfFrame(1)).toBe(38);
    expect(component.getGameCountOfFrame(2)).toBe(43);
    expect(component.getGameCountOfFrame(9)).toBe(43);
  });
  it("random game with 3 strikes followed by normal rolls", () => {
    component.playBowling(10);
    component.playBowling(10);
    component.playBowling(10);
    component.playBowling(5);
    component.playBowling(1);
    for (let i = 5; i < 20; i++) {
      component.playBowling(0);
    }

    expect(component.getGameCountOfFrame(0)).toBe(30);
    expect(component.getGameCountOfFrame(1)).toBe(55);
    expect(component.getGameCountOfFrame(2)).toBe(71);
    expect(component.getGameCountOfFrame(3)).toBe(77);
    expect(component.getGameCountOfFrame(9)).toBe(77);
  });

  it("random game with spare", () => {
    component.playBowling(1);
    component.playBowling(1);
    component.playBowling(5);
    component.playBowling(5);
    component.playBowling(4);
    component.playBowling(3);
    for (let i = 6; i < 20; i++) {
      component.playBowling(0);
    }

    expect(component.getGameCountOfFrame(0)).toBe(2);
    expect(component.getGameCountOfFrame(1)).toBe(16);
    expect(component.getGameCountOfFrame(2)).toBe(23);
    expect(component.getGameCountOfFrame(9)).toBe(23);
  });
});
