/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { Hero } from "../../Hero";
import { Scene } from "phaser";
import { DialogWindow } from "../../windows/DialogWindow";
import { Tile } from "../../types/Position";
import { HeroUnit } from "../../actors/HeroUnit";
import { CONST } from "../../const/const";

declare type StoryActor = {
  id: integer,
  name: string,
  portrait: string
}

declare type StoryMessage = {
  actor: integer,
  text: string
}

declare type StoryArc = {
  messages: StoryMessage[],
  trigger: Tile[],
  started?: boolean,
  finished?: boolean,
  unpaused?: boolean
}

export class StoryModule {
  private actors: StoryActor[] = [
    { id: 0, name: 'Сэйширо', portrait: 'portrait_seyshiro' },
    { id: 1, name: 'Миги', portrait: 'portrait_migi' },
  ];

  private arcs: StoryArc[] = [];

  public deathArc: StoryArc;
  private scene: Scene;
  private hero: Hero;
  private player: HeroUnit;
  private debug: boolean = CONST.DEV;

  constructor(scene: Phaser.Scene, hero: Hero) {
    this.scene = scene;
    this.hero = hero;
    this.initArc();
  }

  public injectDependencies(player: HeroUnit) {
    this.player = player;

  }

  private initArc() {
    this.arcs.push({
      trigger: [{ i: 63, j: 54 }],
      started: false,
      finished: this.debug,
      unpaused: true,
      messages: [
        {
          actor: 1,
          text: 'Сэйширо, кажется мы нашли ее. Сканеры обнаружили слабое излучение к западу от твоей текущей позиции.'
        },
        {
          actor: 0,
          text: 'Думаешь это протомох?'
        },
        {
          actor: 1,
          text: '...'
        },
        {
          actor: 1,
          text: 'Нужно проверить. Направляйся туда и начинай сбор, я дам знать если замечу следы Ка-Тэн.'
        }
      ]
    });

    this.arcs.push({
      trigger: [{ i: 62, j: 61 }, { i: 63, j: 61 },{ i: 64, j: 61 },{ i: 65, j: 61 },{ i: 66, j: 61 }],
      started: false,
      finished: this.debug,
      messages: [
        {
          actor: 1,
          text: 'Здесь немного, но это хоть что-то. Выпускай жнеца и направляй его прямо в заросли. Он сам разберется что делать.'
        },
        {
          actor: 0,
          text: 'Принято, выпускаю жнеца.'
        }
      ]
    });

    this.arcs.push({
      trigger: [{ i: 62, j: 69 }, { i: 63, j: 69 },{ i: 64, j: 69 },{ i: 65, j: 69 },{ i: 66, j: 69 }],
      started: false,
      finished: this.debug,
      messages: [
        {
          actor: 1,
          text: 'Осторожнее, сканеры показывают наличие Ка-Тэн поблизости.'
        },
        {
          actor: 0,
          text: 'Вот черт. Сколько их?'
        },
        {
          actor: 1,
          text: 'Похоже, он один. Твоего вооружения должно быть достаточно чтобы отбиться.'
        }
      ]
    });

    this.arcs.push({
      trigger: [{ i: 60, j: 81 },{ i: 61, j: 81 },{ i: 62, j: 81 }, { i: 63, j: 81 },{ i: 64, j: 81 },{ i: 65, j: 81 },{ i: 66, j: 81 }, {i: 59, j: 72},{i: 59, j: 73},{i: 59, j: 74},{i: 59, j: 75},{i: 59, j: 76},{i: 59, j: 77}],
      started: false,
      finished: this.debug,
      messages: [
        {
          actor: 0,
          text: 'Миги, ты что-нибудь видишь поблизости? '
        },
        {
          actor: 1,
          text: 'Кажется севернее находится реактор переработки энергии, там ты сможешь призвать новых Тахикодзи. Советую первым делом взять Строителя - он сможет починить твою броню.'
        },
        {
          actor: 0,
          text: 'Отлично. Надеюсь, он активен.'
        },
      ]
    });


    this.arcs.push({
      trigger: [{i: 50, j: 72}, {i: 50, j: 73}, {i: 50, j: 74}, {i: 50, j: 75}, {i: 50, j: 76}, {i: 50, j: 77}, {i: 50, j: 78}, {i: 50, j: 79}, {i: 50, j: 80}, {i: 50, j: 81}, {i: 50, j: 82}, {i: 49, j: 70}, {i: 49, j: 71}, {i: 48, j: 70}, {i: 47, j: 70}, {i: 46, j: 70}, {i: 45, j: 70}, {i: 44, j: 70}, {i: 44, j: 71}, {i: 44, j: 72},{i: 44, j: 73},{i: 44, j: 74},{i: 44, j: 75},{i: 44, j: 76},{i: 44, j: 77}],
      started: false,
      finished: false,
      messages: [
        {
          actor: 0,
          text: 'Миги, ты это видишь? Заброшенное поселение кочевников...'
        },
        {
          actor: 1,
          text: 'Похоже, до нас здесь было другое племя. Интересно, что с ними стало...'
        }
      ]
    });


    this.arcs.push({
      trigger: [{i: 48, j: 65},{i: 48, j: 66},{i: 48, j: 67},{i: 48, j: 68},{i: 48, j: 69},{i: 48, j: 70},{i: 48, j: 71},{i: 48, j: 72},{i: 48, j: 72}] ,
      started: false,
      finished: false,
      messages: [
        {
          actor: 1,
          text: 'Осторожно! Дальше на севере большое скопление Ка-Тэн. Будь отсторожен, скорее всего они все нападут разом.'
        }
      ]
    });


    this.deathArc = {
      trigger: [{ i: 63, j: 54 }],
      started: false,
      finished: false,
      messages: [
        {
          actor: 0,
          text: 'Кажется, это конец... Прости, Миги...'
        },
        {
          actor: 1,
          text: 'Сэйширо! НЕЕЕТ!!'
        },
      ]
    }
  }

  public startArc(arc: StoryArc) {
    arc.started = true;
    this.showStoryMessage(arc, 0);
  }

  private showStoryMessage(arc: StoryArc, idx: integer) {
    if (!arc.unpaused)
      this.scene.scene.pause();
    let message = arc.messages[idx];
    let actor = this.actors[message.actor];

    let window = new DialogWindow(actor.name, message.text, false, actor.portrait);
    window.show();
    window.onComplete = () => {
      if (!arc.unpaused)
        this.scene.scene.resume();

      if (idx < arc.messages.length - 1) {
        this.showStoryMessage(arc, idx + 1);
      } else {
        arc.finished = true;
        if (arc == this.deathArc) {
          this.scene.scene.start("LogoScene");
        }
      }
    };

    window.show();
  }

  private updateInterval: number = -50;
  public update() {
    this.updateInterval++
    if (this.updateInterval > 20) {
      this.updateInterval = 0;
      this.updateTriggers();
    }
  }

  private updateTriggers() {
    let tile = this.player.tile;
    for (let arc of this.arcs) {
      if (!arc.started && !arc.finished) {
        for (let trigger of arc.trigger) {
          if (tile.i == trigger.i && tile.j == trigger.j) {
            this.startArc(arc);
            return;
          }
        }
      }
    }
  }

}