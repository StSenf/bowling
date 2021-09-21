import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public title = "bowling-tdd";
  public foo = {
    bar: "This is a bar.",
    baz: { qux: "This is a qux" },
    difficult: "to read",
  };
}
