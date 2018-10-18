/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { ContextMenuWindow } from "../../windows/ContextMenuWindow";
import { GameobjectClicksModule } from "./GameobjectClicksModule";
import { TargetListPanel } from "../../windows/TargetsListPanel";
import { BaseUnit } from "../../actors/BaseUnit";
import { Point } from "../../types/Position";
import { BuilderUnit } from "../../actors/BuilderUnit";
import { OkPopup } from "../../windows/OkPopup";
import { MessageWindow } from "../../windows/MessageWindow";
import { UnitData, Hero } from "../../Hero";
import { CONST } from "../../const/const";

export class ContextMenuModule {

  // Public
  public onSummonClicked: (source: BaseUnit, conf: UnitData) => void;
  public onReconClicked: (object: BaseUnit) => void;
  public onReturnClicked: (object: BaseUnit) => void;
  public onMoveClicked: (object: BaseUnit) => void;

  public repairWindow: MessageWindow;
  public reactorWindow: MessageWindow;

  // Private
  private contextWindow: ContextMenuWindow;

  // Dependencies 
  private scene: Phaser.Scene;
  private hero: Hero;
  private clicksTracker: GameobjectClicksModule;

  constructor(scene: Phaser.Scene, hero: Hero, clicksTracker: GameobjectClicksModule) {
    this.scene = scene;
    this.hero = hero;
    this.clicksTracker = clicksTracker;
    this.clicksTracker.on('click', (object: BaseUnit) => {
      this.handleClick(object);
    });
  }


  // Public

  public update() {
    // close context window if clicked outside of it
    if (this.scene.input.activePointer.justDown && !this.clicksTracker.objectClickedInThisFrame) {
      this.destroyContextWindow();
    }
  }

  public get isContextWindowActive(): boolean {
    return this.contextWindow != null;
  }

  // Private

  private handleClick(object: BaseUnit) {
    // if (!this.targetList.isTargeted(object)) {
    let currentObj = null;
    if (this.contextWindow) {
      currentObj = this.contextWindow.object;
      this.destroyContextWindow();
    }

    if (object.selection.isHard && object != currentObj) {
      this.showContextWindowForObject(object);
    }
    if (this.repairWindow) {
      let builder: BuilderUnit = this.repairWindow.owner;
      builder.startRepair(object);

      this.repairWindow.destroy();
      this.repairWindow = null;
    }
  }

  private worldToScreen(p: Point): Point {
    let camera = this.scene.cameras.main;
    let x = (p.x - camera.midPoint.x) * camera.zoom;
    let y = (p.y - camera.midPoint.y) * camera.zoom;
    let halfW = camera.width / 2;
    let halfH = camera.height / 2;

    return { x: halfW + x, y: halfH + y };
  }

  private showContextWindowForObject(object: BaseUnit) {
    this.destroyContextWindow();

    if (object.conf.type == 'reactor') { 
      this.contextWindow = this.makeReactorWindow(object);
    } else if (object.conf.type == 'builder') { 
      this.contextWindow = this.makeBuilderSquadWindow(object);
    } else if (object.conf.id.indexOf('type') != -1) {
      this.contextWindow = this.makeHeroSquadWindow(object);
    } else {
      this.contextWindow = this.makeEnemySquadWindow(object);
    }
    this.contextWindow.object = object;

    this.contextWindow.onDestroy = (w) => {
      this.contextWindow = null
    };
    this.contextWindow.show();
    this.scene.input.activePointer.isDown = false;
  }

  private makeHeroSquadWindow(object: BaseUnit): ContextMenuWindow {
    let p = this.worldToScreen(object);
    let buttons = ["Move", "Вернуть"];
    let window = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    window.buttons[0].addEventListener('click', () => {
      this.onMoveClicked(object);
    });
    window.buttons[1].addEventListener('click', () => {
      this.onReturnClicked(object);
    });
    return window
  }

  private makeEnemySquadWindow(object: BaseUnit): ContextMenuWindow {
    let buttons = ["Scout"];
    let p = this.worldToScreen(object);
    let window = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    window.buttons[0].addEventListener('click', () => {
      if (this.onReconClicked) {
        this.onReconClicked(object);
      }
    });
    return window;
  }

  private makeBuilderSquadWindow(object: BaseUnit): ContextMenuWindow {
    let builder = object as BuilderUnit;
    let p = this.worldToScreen(object);
    let buttons = ["Строить", "Ремонт", "Вернуть"];
    let window = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    window.buttons[0].addEventListener('click', () => {
      builder.startBuild();
    });
    window.buttons[1].addEventListener('click', () => {
      this.repairWindow = new MessageWindow('', 'Выберите цель ремонта');
      this.repairWindow.top = 0
      this.repairWindow.owner = object;
      // this.repairWindow.left = 0;
      this.repairWindow.addButton('отмена', () => {
        this.repairWindow.destroy()
        this.repairWindow = null;
      });
      this.repairWindow.show();
    });
    window.buttons[2].addEventListener('click', () => {
      this.onReturnClicked(object);
    });
    return window
  }


  private makeReactorWindow(object: BaseUnit): ContextMenuWindow {
    let addButton = (name1: string, name2: string, conf: UnitData, cost: number ) => {
      this.reactorWindow.addButton(name1 +' [' + cost + ']', () => {
        if (this.hero.resources >= cost) {
          this.hero.resources -= cost;
          this.reactorWindow.destroy()
          this.reactorWindow = null;
          this.onSummonClicked(object, conf);
        } else {
          let popup = new MessageWindow(
            "Недостаточно ресурсов", 
            'Для призыва ' + name2 + ' требуется ' + cost + ' едениц протоэнергии', 
            true);
          popup.addButton('Ok',() => {popup.destroy();});
          popup.show();
        }
      });
    }
    let p = this.worldToScreen(object);
    let buttons = ["Призыв"];
    let menu = new ContextMenuWindow(p.x - ContextMenuWindow.defaultWidth / 2, p.y + 16, buttons);
    menu.buttons[0].addEventListener('click', () => {
      this.reactorWindow = new MessageWindow('', 'Реактор переработки протоэнергии');
      this.reactorWindow.owner = object;
      this.reactorWindow.image = "portrait_reactor";
      addButton('Жнец', 'Жнеца', Hero.makeHarvesterConf(), CONST.HARVESTER_COST);
      addButton('Строитель', 'Строителя', Hero.makeHarvesterConf(), CONST.BUILDER_COST);
      addButton('Страж', 'Стража', Hero.makeGuardianConf(), CONST.GUARDIAN_COST);
      
      this.reactorWindow.addButton('Отмена', () => {
        this.reactorWindow.destroy()
        this.reactorWindow = null;
      });

      this.reactorWindow.show();
    });
    return menu;
  }


  private destroyContextWindow() {
    if (this.contextWindow != null) {
      this.contextWindow.show();
      this.contextWindow.destroy();
      this.contextWindow = null;
    }
  }

}