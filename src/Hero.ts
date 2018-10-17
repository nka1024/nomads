/**
* @author       Kirill Nepomnyaschiy <nka1024@gmail.com>
* @copyright    nka1024
* @description  nomads
* @license      Apache 2.0
*/


export type UnitData = {
  id: string;
  icon: string;
  name: string;
  side: string;
  armor: number;
  attack: number;
  defense: number;
  health: number;
  energy: number;
  range: number;
  quantity: number;
  type: string // archers, infantry, hero, scout
}

export type HeroData = {
  units: Array<UnitData>;
}

export class Hero {
  public resources: number = 0;
  public data: HeroData;
  constructor() {
    this.createTestData();
  }

  public static makeHeroConf(): UnitData {
    return {
      id: "hero_squad",
      name: "Hiro",
      icon: "infantry_1_icon",
      type: "hero",
      side: 'defend',
      armor: 50,
      attack: 4,
      defense: 2,
      health: 0.2,
      energy: 1,
      range: 1,
      quantity: 1,
    };
  }

  public static makeSentryConf(): UnitData {
    return {
      id: 'type_3_unit_1',
      icon: "infantry_3_icon",
      name: "Турель",
      type: "sentry",
      side: 'defend',
      armor: 20,
      attack: 3,
      defense: 1,
      range: 2,
      health: 1,
      energy: 1,
      quantity: 3
    };
  }
  public static makeReconSquadConf(): UnitData {
    return {
      id: "recon_squad",
      name: "Scouts",
      icon: "infantry_1_icon",
      side: 'defend',
      type: "scout",
      armor: 1,
      attack: 0,
      defense: 0,
      health: 1,
      energy: 1,
      range: 1,
      quantity: 1
    };
  }

  public static makeRogueSquadConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      name: "Rogues",
      side: 'attack',
      type: "infantry",
      armor: 30,
      attack: 2,
      defense: 1,
      health: 1,
      energy: 1,
      range: 2,
      quantity: 99
    };
  }


  public static makeBossSquadConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      name: "Rogues",
      side: 'attack',
      type: "infantry",
      armor: 100,
      attack: 2,
      defense: 1,
      health: 1,
      energy: 1,
      range: 1,
      quantity: 99
    };
  }

  public static makeTowerConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      name: "Rogues",
      side: 'attack',
      type: "infantry",
      armor: 100,
      attack: 1,
      defense: 1,
      health: 1,
      energy: 1,
      range: 1,
      quantity: 99
    };
  }

  public static makeReactorConf(): UnitData {
    return {
      id: "type_0_reactor",
      icon: "infantry_2_icon",
      name: "Реактор",
      side: 'defense',
      type: "reactor",
      armor: 100000,
      attack: 0,
      defense: 100,
      health: 1,
      energy: 1,
      range: 0,
      quantity: 99
    };
  }


  private createTestData() {
    this.data = { units: [] };
    this.data.units.push({
      id: "type_1_unit_1",
      icon: "icon_harvester",
      name: "Жнец",
      type: "harvester",
      side: 'defend',
      armor: 30,
      attack: 0,
      defense: 0,
      health: 1,
      energy: 1,
      range: 2,
      quantity: 1
    });

    this.data.units.push({
      id: 'type_2_unit_1',
      icon: "icon_builder",
      name: "Билдер",
      type: "builder",
      side: 'defend',
      armor: 40,
      attack: 0,
      defense: 1,
      range: 1,
      health: 1,
      energy: 1,
      quantity: 2
    });
    this.data.units.push(Hero.makeGuardianConf());
  }

  private static guardianIdx: number = 0;
  public static makeGuardianConf() {
    return {
      id: 'type_3_unit_' + this.guardianIdx++,
      icon: "icon_guardian",
      name: "Страж",
      type: "guardian",
      side: 'defend',
      armor: 40,
      attack: 3,
      defense: 1,
      range: 2,
      health: 1,
      energy: 1,
      quantity: 4
    }
  };
}
