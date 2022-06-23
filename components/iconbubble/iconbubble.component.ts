import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
} from "@angular/core";

@Component({
  selector: "codebase-helpbubble",
  templateUrl: "./helpbubble.component.html",
  styleUrls: ["./_helpbubble.scss"],
})
export class IconBubbleComponent implements AfterViewInit {
  @Input() body: string;
  @ViewChild("button") button: ElementRef;
  @Input() left: boolean = false; // whether or not this should render on the left

  constructor() {}

  ngAfterViewInit() {}

  // separate values for hover/clicked so that
  // we don't end up with weird behaviors
  hovered = false;
  clicked = false;

  // toggle the click event
  toggleClick() {
    this.clicked = !this.clicked;

    // check the position on the screen
    this.checkPosition();
  }

  // toggle hovered class
  toggleHover(hovering) {
    // hovering bool passed by component.html telling whether
    // this is a mouseover or mouseout event
    // and we add/remove the class as needed
    if (hovering) {
      this.hovered = true;
    } else {
      this.hovered = false;
    }

    // check the position on screen
    this.checkPosition();
  }

  // checks the helpbubble's position on-screen so we can know whether
  // to have the bubble go to the right or the left
  checkPosition() {
    // get helpbubble's x position
    const xPos = this.button.nativeElement.getBoundingClientRect().left,
      // get screen size
      windowWidth = window.innerWidth,
      // and divide it in half so we can get our limit
      limit = windowWidth / 2;

    // if we are greater than the limit...
    if (xPos > limit) {
      // it's pointing to the left
      this.left = true;
    } else {
      // otherwise, it's pointing to the right
      this.left = false;
    }
  }
}
