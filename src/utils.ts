import Phaser from "phaser";
import { SCREEN_CONFIG } from "./config";
import { Menu, MenuItem } from "./types";
import { MenuButton } from "./components/MenuButton";
import { MENU_BUTTONS_GAP } from "./styles";

export const debugDraw = (
  layer: Phaser.Tilemaps.TilemapLayer,
  scene: Phaser.Scene
) => {
  const debugGraphics = scene.add.graphics().setAlpha(0.7);
  layer.renderDebug(debugGraphics, {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
    faceColor: new Phaser.Display.Color(40, 39, 37, 255),
  });
};

export const createGameTextFromImage = (context: any, imageName: string) => {
  const textFromImage = context.add.image(
    context.screenCenter[0],
    context.screenCenter[1] - SCREEN_CONFIG.height * 0.2,
    imageName
  );

  const scaleX = context.cameras.main.width / (textFromImage.width * 2);
  const scaleY = context.cameras.main.height / (textFromImage.height * 2);
  const scale = Math.max(scaleX, scaleY);
  textFromImage.setScale(scale).setScrollFactor(0);
};

export const setupMenuEntryEvents = (
  menuItem: MenuItem & { textGO: any },
  context: any
) => {
  const textGO = menuItem.textGO;
  textGO.setInteractive();

  textGO.on("pointerup", () => {
    menuItem.scene && context.scene.start(menuItem.scene);
  });
};

export const createMenuEntries = (context: any, menu: Menu) => {
  let lastMenuPositionY = 0;

  menu.forEach((menuItem: any) => {
    const menuPosition = [
      context.screenCenter[0],
      context.screenCenter[1] + 20 + lastMenuPositionY,
    ];
    menuItem.textGO = context.add
      .dom(
        menuPosition[0],
        menuPosition[1],
        MenuButton({
          text: menuItem.text,
        }) as HTMLElement
      )
      .setOrigin(0.5, 1);

    lastMenuPositionY += MENU_BUTTONS_GAP;
    setupMenuEntryEvents(menuItem, context);
  });
};

export const getIsOnMobileBrowser = (): boolean => {
  const userAgent = navigator.userAgent;

  if (!userAgent) {
    return false;
  }

  const webMobileRegex = [
    /Android/i,
    /BlackBerry/i,
    /IEMobile/i,
    /iOS/i,
    /iPhone/i,
    /iPod/i,
    /Ipad/i,
    /Opera Mini/i,
    /webOS/i,
    /Windows Phone/i,
  ];

  return webMobileRegex.some((toMatchItem) => userAgent.match(toMatchItem));
};
