
/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

import { GameObjects, Time, Input } from "phaser";

export class GameOverScene extends Phaser.Scene {


  private image: GameObjects.Image;



  constructor() {
    super({
      key: "GameOverScene"
    });
  }

  preload() {
    this.load.image("game_over", "./assets/game_over.png");
  }

  
  private onWindowResize(w: number, h: number) {
    this.cameras.main.setSize(w, h);
    if (w < 500) {
      this.cameras.main.zoom = 1;
    } else if (w <= 1280) {
      this.cameras.main.zoom = 2;
    } else  {
      this.cameras.main.zoom = 2;
    }
  }

private escKey: Phaser.Input.Keyboard.Key;
private spaceKey: Phaser.Input.Keyboard.Key;
  create(data): void {
    console.log('create logo scene');
   
    this.cameras.main.setBackgroundColor(0x000000);
    // this.cameras.main.setBackgroundColor(0xffffff);
    this.onWindowResize(window.innerWidth, window.innerHeight);
    this.events.on('resize', (w: number, h: number) => this.onWindowResize(w, h));
    
    this.escKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.ESC);
    this.spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    
    console.log('dfdsfsdf');
    this.image = this.makeCenteredImage("game_over");
  }

  update(): void {
    
    this.image.alpha += 0.01;

    let isDown = this.escKey.isDown || this.spaceKey.isDown;
    if (isDown) {
      this.scene.start("LogoScene");
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
