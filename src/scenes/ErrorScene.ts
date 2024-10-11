import { ErrorMessage } from "../components/ErrorMessage";

import BaseScene from "./BaseScene";

export default class ErrorScene extends BaseScene {
  constructor() {
    super("Error");
  }

  create() {
    this.createTextFromComponent();
  }

  private createTextFromComponent(): void {
    this.add
      .dom(
        this.screenCenter[0],
        this.screenCenter[1],
        ErrorMessage({
          mainText: "Oops, something went wrong!",
          subText:
            "It seems like the game is not supported on your browser. Please try again on a different browser or device.",
        }) as HTMLElement
      )
      .setOrigin(0.5, 1);
  }
}
