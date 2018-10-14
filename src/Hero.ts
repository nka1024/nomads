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
      health: 1,
      energy: 1,
      range: 1,
      quantity: 1,
    };
  }

  public static makeReconSquadConf(): UnitData {
    return {
      id: "recon_squad",
      name: "Scouts",
      icon: "infantry_1_icon",
      side: 'defend',
      type: "scout",
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
      health: 1,
      energy: 1,
      range: 2,
      quantity: 99
    };
  }

  private createTestData() {
    this.data = { units: [] };
    this.data.units.push({
      id: "type_1_unit_1",
      icon: "archers_1_icon",
      name: "Жнец",
      type: "harvester",
      side: 'defend',
      health: 1,
      energy: 1,
      range: 2,
      quantity: 1
    });

    this.data.units.push({
      id: 'type_2_unit_1',
      icon: "infantry_2_icon",
      name: "Билдер",
      type: "builder",
      side: 'defend',
      range: 1,
      health: 1,
      energy: 1,
      quantity: 2
    });
  }
}
