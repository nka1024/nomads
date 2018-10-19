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
}

export class StoryModule {
  private actors: StoryActor[] = [
    { id: 0, name: 'Сэйширо', portrait: 'portrait_seyshiro' },
    { id: 1, name: 'Миги', portrait: 'portrait_migi' },
  ];

  private arc: StoryArc;
  private scene: Scene;
  private hero: Hero;

  constructor(scene: Phaser.Scene, hero: Hero) {
    this.scene = scene;
    this.hero = hero;

    this.initArc();
  }

  private initArc() {
    this.arc = {
      trigger: [],
      messages: [
        {
          actor: 0,
          text: 'Сэйширо, кажется мы нашли ее. Сканеры обнаружили слабое излучение к северу от твоей текущей позиции.'
        },
        {
          actor: 1,
          text: 'Думаешь это протомох?'
        },
        {
          actor: 0,
          text: '...'
        },
        {
          actor: 0,
          text: 'Нужно проверить. Направляйся туда и начинай сбор, я дам знать если замечу следы Ка-Тэн.'
        }
      ]
    }
  }

  public start() {
    this.startArc(this.arc);
  }

  public startArc(arc: StoryArc) {
    this.showStoryMessage(arc, 0);
  }

  private showStoryMessage(arc: StoryArc, idx: integer) {
    let message = arc.messages[idx];
    let actor = this.actors[message.actor];

    let window = new DialogWindow(actor.name, message.text, false, actor.portrait);
    window.show();
    window.onComplete = () => {
      // window.destroy();
      if (idx < arc.messages.length - 1) {
        this.showStoryMessage(arc, idx + 1);
      }
    };
    
    window.show();
  }
}