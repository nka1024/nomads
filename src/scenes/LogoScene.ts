
/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { GameObjects, Time, Input } from "phaser";

export class LogoScene extends Phaser.Scene {

  private timer1: Time.TimerEvent;
  private logo: GameObjects.Image;
  private storyIdx: number = 0;
  private spaceKey: Input.Keyboard.Key;

  constructor() {
    super({
      key: "LogoScene"
    });
  }

  preload() {
    this.load.image("story0", "./assets/story0.png");
    this.load.image("story1", "./assets/story1.png");
    this.load.image("story2", "./assets/story2.png");
    this.load.image("story3", "./assets/story3.png");
    this.load.image("story4", "./assets/story4.png");
  }

  private onWindowResize(w: number, h: number) {
    this.cameras.main.setSize(w, h);
    if (w < 500) {
      this.cameras.main.zoom = 1;
    } else if (w <= 1280) {
      this.cameras.main.zoom = 2;
    } else  {
      this.cameras.main.zoom = 3;
    }
  }

  private nextSlide() {
    this.storyIdx++;

    if (this.storyIdx > 4) {

      this.scene.start("GameplayRootScene");
    } else {
      this.addLogo('story'+this.storyIdx);
    }

    this.timer1.destroy();

    // this.timer1 = this.time.addEvent({
    //   delay: 10000,
    //   callback: this.onTimerComplete,
    //   callbackScope: this,
    //   loop: true,
    //   paused: false
    // });
  }

  create(data): void {
    this.cameras.main.setBackgroundColor(0x191919);
    this.onWindowResize(window.innerWidth, window.innerHeight);
    this.events.on('resize', (w: number, h: number) => this.onWindowResize(w, h));

    
    this.spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.timer1 = this.time.addEvent({
      delay: 5000,
      callback: this.nextSlide,
      callbackScope: this,
      loop: true,
      paused: false
    });

    

    this.addLogo("story0");
  }

  update(): void {
    this.logo.alpha += 0.01;

    let isDown = this.spaceKey.isDown || this.input.activePointer.isDown
    if (isDown && this.logo.alpha > 0.5) {
      this.nextSlide();
    }
  }

  addLogo(img: string) {
    if (this.logo) 
      this.logo.destroy();

    var bgX = this.sys.canvas.width / 2;
    var bgY = this.sys.canvas.height / 2;
    this.logo = new GameObjects.Image(this, bgX, bgY, img);
    this.logo.alpha = 0;
    this.add.existing(this.logo);
  }
}
