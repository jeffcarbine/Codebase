import { Component, OnInit, Input } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import * as icons from './_icon-list.json';

@Component({
  selector: "codebase-icon",
  templateUrl: "./icon.component.svg",
  styleUrls: ["./_icon.scss"],
})
export class IconComponent implements OnInit {
  @Input() iconName: string;
  @Input() fill: string = "inherit";
  icon: SafeHtml;
  @Input() fillColor: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const iconName = this.iconName,
      icon = icons[iconName];

    this.icon = this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
