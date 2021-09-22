import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RollButtonComponent } from "./roll-button.component";

fdescribe("RollButtonComponent", () => {
  let component: RollButtonComponent;
  let fixture: ComponentFixture<RollButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RollButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RollButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
