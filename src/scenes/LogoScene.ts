
/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { GameObjects, Time, Input } from "phaser";

export class LogoScene extends Phaser.Scene {

  private timer1: Time.TimerEvent;

  private logo1: GameObjects.Image;
  private logo2: GameObjects.Image;
  private logo3: GameObjects.Image;
  private cutsceneFrame: GameObjects.Image;
  private cutsceneText: GameObjects.Image;
  private cutsceneBackground: GameObjects.Image;

  private currentImage: GameObjects.Image;

  private logoFinished: boolean = false;

  private storyIdx: number = 0;
  private spaceKey: Input.Keyboard.Key;

  private desiredBgScroll: number = 0;
  constructor() {
    super({
      key: "LogoScene"
    });
  }

  preload() {
    this.load.image("cutscene_0_1", "./assets/cutscene_0_1.png");
    this.load.image("cutscene_0_2", "./assets/cutscene_0_2.png");
    this.load.image("cutscene_0_3", "./assets/cutscene_0_3.png");
    this.load.image("cutscene_1_text", "./assets/cutscene_1_text.png");
    this.load.image("cutscene_2_text", "./assets/cutscene_2_text.png");
    this.load.image("cutscene_3_text", "./assets/cutscene_3_text.png");
    this.load.image("cutscene_4_text", "./assets/cutscene_4_text.png");
    this.load.image("cutscene_2", "./assets/cutscene_2.png");
    this.load.image("cutscene_3", "./assets/cutscene_3.png");
    this.load.image("cutscene_4", "./assets/cutscene_4.png");
    this.load.image("cutscene_frame", "./assets/cutscene_frame.png");
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
    this.timer1.destroy();

    this.currentImage.alpha = 1;
    if (!this.logoFinished) {
      if (this.logo2.alpha < 1 ) {
        this.currentImage = this.logo2
      } else if(this.logo3.alpha < 1) {
        this.currentImage = this.logo3
      } else {
        this.logo1.destroy();
        this.logo2.destroy();
        this.logo3.destroy();
        this.logoFinished = true;
        this.currentImage = null;
      }
    }

    if (this.logoFinished) {
      this.storyIdx++;

      this.cutsceneFrame.alpha = 1;
      this.cutsceneFrame.depth = 1;

      if (this.cutsceneBackground) this.cutsceneBackground.destroy();
      if (this.cutsceneText) this.cutsceneText.destroy();

      if (this.storyIdx <= 4) {
        this.cutsceneText = this.makeCenteredImage('cutscene_' + this.storyIdx + '_text');
        this.cutsceneText.depth = 2

        if (this.storyIdx != 1) {
          this.cutsceneBackground = this.makeCenteredImage('cutscene_' + this.storyIdx);
          this.cutsceneBackground.depth = 0;

          if (this.storyIdx == 2) {
            this.desiredBgScroll = this.cutsceneBackground.y + 50;
            this.cutsceneBackground.y -= 40
          } else if (this.storyIdx == 3) {
            this.cutsceneBackground.y -= 40
            this.desiredBgScroll = this.cutsceneBackground.y - 50;
          } else if (this.storyIdx == 4) {
            this.cutsceneBackground.y -= 60
            this.desiredBgScroll = this.cutsceneBackground.x - 50;
          }
        }

        this.currentImage = this.cutsceneText;
      } else {
        this.scene.start("GameplayRootScene");
      }
        

      //   this.scene.start("GameplayRootScene");
      // } else {
      //   this.makeCenteredImage('story'+this.storyIdx);
      // }
  
    }
  
    
  }

  create(data): void {
    this.cameras.main.setBackgroundColor(0x000000);
    // this.cameras.main.setBackgroundColor(0xffffff);
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

    this.logo1 = this.makeCenteredImage("cutscene_0_1");
    this.logo2 = this.makeCenteredImage("cutscene_0_2");
    this.logo3 = this.makeCenteredImage("cutscene_0_3");
    this.currentImage = this.logo1;

    this.cutsceneFrame = this.makeCenteredImage("cutscene_frame");
  }

  update(): void {
    
    let speed = 0.05
    this.currentImage.alpha += 0.01;
    if (this.cutsceneBackground) {
      this.cutsceneBackground.alpha +=  0.01
      if (this.storyIdx == 2 && this.cutsceneBackground.y < this.desiredBgScroll) {
        this.cutsceneBackground.y += speed;
      } else if (this.storyIdx == 3 && this.cutsceneBackground.y > this.desiredBgScroll) {
        this.cutsceneBackground.y -= speed;
      } else if (this.storyIdx == 4 && this.cutsceneBackground.x > this.desiredBgScroll) {
        this.cutsceneBackground.x -= speed;
      }
    }




    let isDown = this.spaceKey.isDown || this.input.activePointer.isDown
    if (isDown && this.currentImage.alpha > 0.2) {
      this.nextSlide();
    }
  }

  makeCenteredImage(img: string): GameObjects.Image {
    var bgX = this.sys.canvas.width / 2;
    var bgY = this.sys.canvas.height / 2;
    let image = new GameObjects.Image(this, bgX, bgY, img);
    image.alpha = 0;
    this.add.existing(image);
    return image;
  }
}
