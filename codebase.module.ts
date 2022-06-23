import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { AccordionComponent } from "./components/accordion/accordion.component";
import { IconComponent } from "./components/icon/icon.component";
import { IconBubbleComponent } from "./components/helpbubble/helpbubble.component";
import { ScreenFilterComponent } from "./components/screenfilter/screenfilter.component";

@NgModule({
  imports: [CommonModule],
  declarations: [
    DropdownComponent,
    AccordionComponent,
    IconComponent,
    IconBubbleComponent,
    ScreenFilterComponent,
  ],
  exports: [
    DropdownComponent,
    AccordionComponent,
    IconComponent,
    IconBubbleComponent,
    ScreenFilterComponent,
  ],
})
export class CodebaseModule {}
