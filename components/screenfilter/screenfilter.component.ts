import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: "codebase-screenfilter",
  templateUrl: "./screenfilter.component.html",
  styleUrls: ["./_screenfilter.scss"],
})
export class ScreenFilterComponent implements AfterViewInit { 
  @ViewChild('pageFilterQuery') pageFilterQuery: ElementRef;


  constructor() {}

  ngAfterViewInit() {}

  filterOpen = false;

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  filterPage() {
    // this is dirty, we'll make it better later
    const tileRows = document.querySelectorAll("app-tile-row"),
      query = this.pageFilterQuery.nativeElement.value;

    tileRows.forEach(tileRow => {
      if(tileRow.textContent.toLowerCase().includes(query.toLowerCase())) {
        tileRow.classList.remove("filtered");
      } else {
        tileRow.classList.add("filtered");
      }
    });
  }
}
