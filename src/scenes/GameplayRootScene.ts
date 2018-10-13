/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/


import { WindowManager } from "../windows/WindowManager";
import { AssetsLoader } from "../AssetsLoader";
import { TileGrid } from "../TileGrid";
import { UnitsPanel } from "../windows/UnitsPanel";

import { HeroUnit } from "../actors/HeroUnit";
import { SquadUnit } from "../actors/SquadUnit";

import { CameraDragModule } from "../modules/scene/CameraDragModule";
import { SceneCursorModule } from "../modules/scene/SceneCursorModule";
import { MapImporterModule } from "../modules/scene/MapImporterModule";
import { ContextMenuModule } from "../modules/scene/ContextMenuModule";
import { GameobjectClicksModule } from "../modules/scene/GameobjectClicksModule";
import { BaseUnit } from "../actors/BaseUnit";
import { Hero, UnitData } from "../Hero";
import { HarvesterUnit } from "../actors/HarvesterUnit";
import { GameObjects } from "phaser";
import { ResourcesPanel } from "../windows/ResourcesPanel";


export class GameplayRootScene extends Phaser.Scene {

  private grid: TileGrid;

  // objects
  public player: HeroUnit;
  public hero: Hero;
  private unitsGrp: Phaser.GameObjects.Group;
  private deployedSquads: Array<SquadUnit> = [];
  private selectedUnit: BaseUnit;

  // windows
  private unitsPanel: UnitsPanel;

  // modules
  private cameraDragModule: CameraDragModule;
  private mapImporterModule: MapImporterModule;
  private contextMenuModule: ContextMenuModule;
  private cursorModule: SceneCursorModule;
  private clicksTracker: GameobjectClicksModule;

  constructor() {
    super({
      key: "GameplayRootScene"
    });
  }

  preload() {
    AssetsLoader.preload(this);
  }

  injectDependencies() {
    this.grid = new TileGrid(this);
    this.cameraDragModule = new CameraDragModule(this);
    this.clicksTracker = new GameobjectClicksModule(this);
    this.contextMenuModule = new ContextMenuModule(this, this.clicksTracker);
    this.cursorModule = new SceneCursorModule(this, this.grid);
    this.mapImporterModule = new MapImporterModule(this, this.grid);
  }

  create(data): void {
    this.injectDependencies();
    this.cameras.main.setBackgroundColor(0x1f1f1f);
    this.cameras.main.zoom = 2;

    let mapsize = this.grid.gridSize * this.grid.tileSize;
    this.cameras.main.setBounds(0,0, mapsize, mapsize);

    this.events.on('resize', (h: number, w: number) => {
      this.cameras.main.setSize(h, w);
    });
    WindowManager.initialize();

    this.grid.createFog();

    let player = new HeroUnit(this, 0, 0, this.grid, Hero.makeHeroConf());
    this.hero = new Hero();

    let resourcePanel = new ResourcesPanel();
    resourcePanel.populate(this.hero);
    resourcePanel.show();

    this.cursorModule.onClick = (cursor) => {
      if (!this.cameraDragModule.isDrag && !this.clicksTracker.objectClickedInThisFrame) {
        let squad = this.selectedUnit;
        if (squad) {
          if (squad.state.isFighting) {
            squad.combat.stopFight('command');
          }
          if (squad.state.isChasing) {
            squad.chase.stop();
          }
          squad.mover.moveTo(cursor);
        } else {
          if (player.state.isFighting) {
            player.combat.stopFight('command');
          }
          player.mover.moveTo(cursor);
        }
      }
    };

    this.mapImporterModule.grassHandler = (o: GameObjects.Image, item: any) => {
      let tile = this.grid.worldToGrid({x: o.x, y: o.y - o.height/2});
      this.grid.addGrass(o, tile, 100);
    };
    this.mapImporterModule.importMap(this.cache.json.get('map'));

    this.unitsGrp = this.add.group();
    this.unitsGrp.runChildUpdate = true;
    this.clicksTracker.addObjectsGroup(this.unitsGrp);


    this.add.existing(player);
    this.player = player;
    player.selection.showHard();
    this.selectedUnit = player;


    player.mover.placeToTile({ i: 8, j: 12 });
    this.cameras.main.centerOn(player.x, player.y);
    this.unitsGrp.add(this.player);
    this.unitsPanel = new UnitsPanel();
    this.unitsPanel.populate(this.hero.data.units);
    this.unitsPanel.show();
    this.unitsPanel.onUnitAttack = (conf: UnitData) => {
      let squad = this.findOrDeploySquad(conf);
      squad.chase.deployDefender(player);

      this.add.existing(squad);
      this.unitsGrp.add(squad);
      this.deployedSquads.push(squad);
    }
    this.unitsPanel.onUnitRecall = (conf: UnitData) => {
      for (let squad of this.deployedSquads) {
        if (squad.conf.id == conf.id) {
          this.recallSquad(squad);
        }
      }
    }

    
    this.clicksTracker.on('click', (object: BaseUnit) => {
      // deselect old
      let squad: SquadUnit = (object as SquadUnit)
      if (squad) {
        if (this.selectedUnit && this.selectedUnit.active) {
          this.selectedUnit.selection.hideHard();
        }
        this.selectedUnit = squad
        squad.selection.showHard();
      }

      if (object.conf.id.indexOf('enemy') == -1) {
        return;
      }
    });

    // this.createEnemy(8, 11);
    // this.createEnemy(13, 18);
    // this.createEnemy(8, 19);
    // this.createEnemy(15, 10);
    // this.createEnemy(20, 9);
    // this.createEnemy(14, 1);

    this.contextMenuModule.onReturnClicked = (object: BaseUnit) => {
      this.recallSquad(object as SquadUnit);
    };
    this.contextMenuModule.onMoveClicked = (object: BaseUnit) => {
      this.selectedUnit = object as SquadUnit;
    };

  }

  private recallSquad(squad: SquadUnit) {
    // stop fighting
    if (squad.state.isFighting) {
      squad.combat.stopFight('return');
    }
    // deselect tile
    if (this.selectedUnit == squad) {
      squad.selection.hideHard();
      this.selectedUnit = this.player;
      this.player.selection.showHard();
    }
    // deselect unit item
    this.unitsPanel.deselect(squad);


    // squad.chase.start(this.player, () => {
    console.log('returned');
    this.unitsGrp.remove(squad, true);
    this.deployedSquads = this.deployedSquads.filter((o, i, arr) => { return o != squad });
    squad.destroy();
    // });
  }

  private createEnemy(i: number, j: number) {
    let worldPos = this.grid.gridToWorld({ i: i, j: j });
    let enemyUnit = new SquadUnit(this, worldPos.x + 16, worldPos.y + 16, this.grid, Hero.makeRogueSquadConf());
    enemyUnit.mover.placeToTile(enemyUnit.tile);
    this.add.existing(enemyUnit);
    this.unitsGrp.add(enemyUnit);
    enemyUnit.events.addListener('death', () => { this.handleUnitDeath(enemyUnit); });
  }

  private findOrDeploySquad(conf: UnitData) {
    let squad: SquadUnit = null;
    for (let s of this.deployedSquads) {
      if (s.conf.id == conf.id) {
        // found deployed squad
        squad = s;
        break;
      }
    }
    if (!squad) {
      let from = this.grid.snapToGrid(this.player);
      if (conf.type == 'harvester') {
        squad = new HarvesterUnit(this, from.x + 16, from.y + 16, this.grid, conf);
      } else {
        squad = new SquadUnit(this, from.x + 16, from.y + 16, this.grid, conf);
      }
      squad.events.addListener('death', () => { this.handleUnitDeath(squad); });
    }
    return squad;
  }

  private handleUnitDeath(unit: BaseUnit) {
     // deselect tile
     if (this.selectedUnit == unit) {
      unit.selection.hideHard();
      this.selectedUnit = this.player;
      this.player.selection.showHard();
    }
    // deselect unit item
    this.unitsPanel.deselect(unit);

    this.unitsGrp.remove(unit, true);
    unit.destroy();
  }

  private fogUpdateCnt:number = 60;
  update(): void {
    this.contextMenuModule.update();
    // dont handle touches if context window is shown
    if (!this.contextMenuModule.isContextWindowActive) {
      this.cursorModule.update();
      this.cameraDragModule.update();
    }
    this.clicksTracker.update();

    if (this.grid) {
      this.fogUpdateCnt++
      if (this.fogUpdateCnt > 60) {
        this.fogUpdateCnt = 0;
        this.grid.updateFog(this.player.tile);
      }
      this.grid.update();
    }

  }

}
