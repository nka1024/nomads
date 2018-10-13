/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/

export class GameobjectClicksModule extends Phaser.Events.EventEmitter{
  private scene: Phaser.Scene;
  private groups: Array<Phaser.GameObjects.Group>;

  public get objectClickedInThisFrame():boolean { return this._objectClickedInThisTime; };
  private _objectClickedInThisTime: boolean;


  constructor(scene: Phaser.Scene) {
    super();
    this.groups = [];
    this.scene = scene;
  }

  private trackClicks(object: Phaser.GameObjects.GameObject) {
    object.on('click_32', () => {
      this._objectClickedInThisTime = true      
      this.emit('click', object);
    })
  }

  private untrackClicks(object: Phaser.GameObjects.GameObject) {
    object.off('click_32', null, null, false);
  }

  public addObjectsGroup(group: Phaser.GameObjects.Group) {
    this.groups.push(group);

    group.createCallback = (item: Phaser.GameObjects.GameObject) => {
      this.trackClicks(item);
    };
    group.removeCallback = (item: Phaser.GameObjects.GameObject) => {
      this.untrackClicks(item);
    };
  }

  public removeObjectsGroup(group: Phaser.GameObjects.Group) {
    // remove listeners from all objects in group
    for (let object of group.children.entries) {
      this.untrackClicks(object);
    }
    // remove group from groups array
    this.groups = this.groups.filter((grp, idx, array) => {
      return grp != group;
    });
  }

  public update() {
    if (!this.scene.input.activePointer.isDown) {
      this._objectClickedInThisTime = false;
    }
  }
}