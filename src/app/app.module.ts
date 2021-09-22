import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { FrameComponent } from "./frame/frame.component";
import { RollButtonComponent } from './roll-button/roll-button.component';

@NgModule({
  declarations: [AppComponent, FrameComponent, RollButtonComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
