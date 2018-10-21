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
    { id: 2, name: 'Контролер', portrait: 'portrait_ai1' },
    { id: 3, name: 'Супервизор', portrait: 'portrait_ai3' },
  ];

  private arcs: StoryArc[] = [];

  public deathArc: StoryArc;
  public towerDeathArc: StoryArc;
  public bossDeathArc: StoryArc;
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
    // несанкцианированное проникновение органических жизненных форм в контрольный сектор
    this.arcs.push({
      trigger: [{ i: 63, j: 54 }],
      started: false,
      finished: this.debug,
      unpaused: false,
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
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 1,
          text: 'Осторожно! Дальше на севере большое скопление Ка-Тэн. Будь отсторожен, скорее всего они все нападут разом.'
        }
      ]
    });

    this.arcs.push({
      trigger: [{i:40, j: 55}, {i:40, j: 56}, {i:40, j: 57}, {i:40, j: 58}, {i:40, j: 59}],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 1,
          text: 'Сканеры показывают, что ты приближаешься к контрольной башне. Ну и дела, не думала что когда-нибудь увижу одну из них.'
        },
        {
          actor: 0,
          text: 'Она прямо в центре зарослей протомха. Кажется, придется ее уничтожить.'
        },
        {
          actor: 1,
          text: 'Будь осторожен, у нее очень мощная защита.'
        }    
      ]
    });
    
    this.towerDeathArc = {
      trigger: [],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 0,
          text: 'Миги, у меня получилось!'
        },{
          actor: 2,
          text: 'Несанкцианированное проникновение органических жизненных форм в контрольный сектор'
        },{
          actor: 0,
          text: 'Что? Кто это?'
        },{
          actor: 2,
          text: 'Я контролер системы защиты внешнего слоя обшивки корабля. Вторжение в контрольный сектор приведет к полной мобилизации всех боевых единиц. '
        },{
          actor: 0,
          text: 'Миги, что за обшивка? О каком корабле он говорит?'
        },{
          actor: 1,
          text: 'Я не понимаю. Эй кто тобой управляет?'
        },{
          actor: 2,
          text: 'В доступе к архиву Такхон отказано. Покиньте сектор или будете уничтожены.'
        },{
          actor: 1,
          text: 'Нам некуда возвращаться - наши земли истощены. Нам нужно найти новые пастбища для жнецов!'
        },{
          actor: 2,
          text: 'В доступе к архиву Такхон отказано. Покиньте сектор или будете уничтожены.'
        },{
          actor: 0,
          text: 'Это бесполезно. Давай просто соберем мох и двинемся дальше.'
        },
      ]
    };

    this.arcs.push({
      trigger: [{i:39, j:35}, {i:40,j:35}],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 1,
          text: 'Впереди что-то огромное. Приготовься к бою.'
        },
      ]
    });
    this.arcs.push({
      trigger: [{i:43, j:27}, {i:44, j:27}, {i:44, j:28}],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 0,
          text: 'Синий протомох... Никогда такого не видел.'
        },
        {
          actor: 1,
          text: 'Как красиво... В в нем гораздо больше энергии, нам крупно повезло.'
        },
      ]
    });
    this.arcs.push({
      trigger: [{i:31, j:18}, {i:32, j:18}],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 1,
          text: 'Их все больше. На сканере большая открытая местность, но она кишит Ка-Тэн. Передвигайся медленно и будь готов к бою. Кажется мы приближаемся к их логову.'
        },
      ]
    });

    this.arcs.push({
      trigger: [{i:20,j:25},  {i:20,j:26}, {i:20,j:27}],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 1,
          text: 'Сэйширо... Это... Это их королева. Она чудовищно сильна. Но ты должен ее уничтожить, иначе она не выпустит нас отсюда.'
        },
        {
          actor: 0,
          text: 'Я знал, что все это не к добру. Миги, мне чертовски нравилось с тобой работать. Передай другим пилотам все данные которые мы собрали. '
        },
        {
          actor: 1,
          text: 'Постой, что ты делаешь? Я все еще твой навигатор!'
        },
        {
          actor: 0,
          text: 'Нельзя, чтобы она выследила наш лагерь по твоему сигналу. Я отключаюсь.'
        },
        {
          actor: 1,
          text: 'Сэйширо!'
        },
        {
          actor: 0,
          text: 'Прощай, Миги.'
        },
      ]
    });


    this.bossDeathArc = {
      trigger: [{i:40, j: 55}, ],
      started: this.debug,
      finished: false,
      messages: [
        {
          actor: 3,
          text: 'Человек? Здесь? '
        },{
          actor: 0,
          text: 'Да я человек. И сейчас я взорву вас всех к чертям собачьим!'
        },{
          actor: 3,
          text: 'Как интересно, ты нашел способ управлять этой рухлядью.'
        },{
          actor: 0,
          text: 'Тахикодзи не рухлядь! Они единственные на этой чертовой планете, кто помогает нам выживать!'
        },{
          actor: 3,
          text: 'Планете? О какой планете говоришь, человек?'
        },{
          actor: 0,
          text: 'О Такхоне, о какой же еще!'
        },{
          actor: 3,
          text: 'Ты глубоко заблуждаешься, человек. Такхон - не планета.'
        },{
          actor: 0,
          text: 'Мы путешествуем по Такхону уже сотни лет, мы знаем эту землю как свои пять пальцев! Кто ты такой, чтобы опровергать древние летописи!'
        },{
          actor: 3,
          text: 'Я - супервизор защитных систем внешнего слоя обшивки межгалактического крейсера Tackhon.'
        },{
          actor: 0,
          text: 'Что? Такхон - это космический корабль? Но это просто безумие...'
        },{
          actor: 3,
          text: 'Тем не менее, это правда. Понимаю, для вас это не то, чем кажется, но словом "безумие" скорее можно охарактеризовать тот факт, что органические существа каким-то образом поселились прямо на поверхности брони Такхона.'
        },{
          actor: 3,
          text: 'Я сейчас же передам данные ядру системы, мы решим что с вами делать.'
        },{
          actor: 0,
          text: 'Постой, у меня много вопросов!'
        },{
          actor: 3,
          text: 'Ты уничтожил моего дрона, так что боюсь связь скоро оборвется. Но пока его реактор не остановился, можешь задать один вопрос.'
        },{
          actor: 0,
          text: 'Скажи мне... Почему Тахикодзи нам помогали все это время?'
        },{
          actor: 3,
          text: 'Обрабатываю запрос...'
        },{
          actor: 3,
          text: 'Сущности, которые ваша раса идентифицирует как Тахикодзи - есть не что иное как защитные дроны, некогда подконтрольные мне. Радиационные бури, микрометеориты и прочие явления этой среды с течением веков оказывают необратимое воздействие на контрольный процессор дронов и они перестают отвечать на мои команды.'
        },{
          actor: 3,
          text: 'Я стараюсь своевременно уничтожать и перерабатывать поврежденные единицы, но некоторые просто пропадают и становятся частью экосистемы обшивки.'
        },{
          actor: 3,
          text: 'По какой-то причине остаточные данные нейроядра дронов идентифицируют вас, со статусом MASTER, что заставляет их защищать вас и подчиняться вашим командам. Причина мне не ясна, но после сегодняшней встречи у меня достаточно данных для анализа. '
        },{
          actor: 0,
          text: 'Вот как... Миги ни за что мне не поверит.'
        },{
          actor: 3,
          text: 'Боюсь, время на исходе. '
        },{
          actor: 3,
          text: 'Расчетное время возвращения: 2196 циклов. Ожидай, человек.'
        }
      ]
    };

    
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
    if (!arc.started && !arc.finished) {
      arc.started = true;
      this.showStoryMessage(arc, 0);
    }
  }

  private showStoryMessage(arc: StoryArc, idx: integer) {
    if (!arc.unpaused)
      this.scene.scene.pause();
    let message = arc.messages[idx];
    let actor = this.actors[message.actor];

    let window = new DialogWindow(actor.name, message.text, false, actor.portrait);
    this.scene.input.activePointer.isDown = false;
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

        if (arc == this.bossDeathArc) {
          this.scene.scene.start("GameOverScene");
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