import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconBubbleComponent } from "./helpbubble.component";

describe("IconBubbleComponent", () => {
  let component: IconBubbleComponent;
  let fixture: ComponentFixture<IconBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconBubbleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
