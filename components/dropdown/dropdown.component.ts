import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";


@Component({
  selector: "codebase-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./_dropdown.scss"],
})
export class DropdownComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Input() carat: boolean = true;
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit() {
    // runs after everything loads but before DOM finishes rendering
  }

  animationAdded = false;

  toggle(e) {
    e.preventDefault();
    
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);

    // add animation if this is the first click
    if (!this.animationAdded) {
      this.animationAdded = true;
    }
  }
}
