import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";


@Component({
  selector: "codebase-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./_accordion.scss"],
})
export class AccordionComponent implements AfterViewInit {

  @Input() isOpen: boolean = false;
  @Input() callback: (isOpen: boolean) => void;

  constructor() {}

  ngAfterViewInit(): void {
    
  }

  // get the accordion-body element
  @ViewChild("body") body: ElementRef;

  toggle(e) {
    // in the event this is nestled in a form,
    // we want to prevent default button behavior
    e.preventDefault();
    
    // get the height of the accordion-body
    const height = this.body.nativeElement.offsetHeight,
      // get the transition duration from CSS
      transitionDuration = getComputedStyle(this.body.nativeElement).getPropertyValue("transition-duration"),
      // and parse it into milliseconds
      delay = parseFloat(transitionDuration.replace("s","")) * 1000;

    // if the accordion-body isn't open
    if(!this.isOpen) {
      // set the accordion-body to the exact pixel height
      // after a minor delay
      setTimeout(() => {
        this.body.nativeElement.style.height = height + "px";
      }, 10);

      // change the isOpen bool so that the accordion-body gets
      // the open class
      this.isOpen = !this.isOpen;

      // and run the callback, if any
      if(this.callback !== undefined) {
        this.callback(this.isOpen);
      }

      // and after the transition duration, change the inline
      // height to "auto" so that we aren't stuck at a pixel height
      setTimeout(() => {
        this.body.nativeElement.style.height = "auto";
      }, delay);
    // otherwise
    } else {
      // set the accordion-body's height property back
      // to the actual current pixel height
      this.body.nativeElement.style.height = height + "px";
      
      // then after a short timeout, set it to null so as
      // to trigger the transition
      setTimeout(() => {
        this.body.nativeElement.style.height = null;
      }, 10);

      // and then after the transition duration, turn isOpen bool
      // back to false so as to remove the open class from the
      // accordion-body
      setTimeout(() => {
        this.isOpen = !this.isOpen;

        // and run the callback, if any
        if(this.callback !== undefined) {
          this.callback(this.isOpen);
        } 
      }, delay);
    }
  }
}
