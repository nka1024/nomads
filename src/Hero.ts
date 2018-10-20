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
  attackBonus: number;
  defense: number;
  defenseBonus: number;
  harvest?: number;
  harvestBonus?: number;
  repair?: number;
  repairBonus?: number;

  health: number;
  energy: number;
  range: number;
  level: number;
  experience: number;
  type: string // archers, infantry, hero, scout
}

export type HeroData = {
  units: Array<UnitData>;
}

export class Hero {
  public static expTable = [10, 300, 1000, 2000, 10000];

  public static expHeroAttack = [4, 5, 6, 10, 12];
  public static expHeroDefense = [1, 1, 2, 2, 3];
  public static expHeroArmor = [50, 300, 1000, 2000, 10000];

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
      experience: 0,
      level: 1,
      attackBonus: 0,
      defenseBonus: 0
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
      experience: 0,
      level: 3,
      attackBonus: 0,
      defenseBonus: 0
    };
  }
  
  public static makeK10SquadConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      name: "Rogues",
      side: 'attack',
      type: "k10",
      armor: 30,
      attack: 2,
      defense: 1,
      health: 1,
      energy: 1,
      range: 2,
      experience: 0,
      level: 99,
      attackBonus: 0,
      defenseBonus: 0
    };
  }

  public static makeK11SquadConf(): UnitData {
    return {
      id: "enemy_squad",
      icon: "infantry_2_icon",
      name: "Rogues",
      side: 'attack',
      type: "k11",
      armor: 100,
      attack: 10,
      defense: 5,
      health: 1,
      energy: 1,
      range: 2,
      experience: 0,
      level: 99,
      attackBonus: 0,
      defenseBonus: 0
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
      experience: 0,
      level: 99,
      attackBonus: 0,
      defenseBonus: 0
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
      experience: 0,
      level: 99,
      attackBonus: 0,
      defenseBonus: 0
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
      experience: 0,
      level: 99,
      attackBonus: 0,
      defenseBonus: 0
    };
  }


  private createTestData() {
    this.data = { units: [] };
    this.data.units.push(Hero.makeHarvesterConf());
    this.data.units.push(Hero.makeBuilderConf());
    this.data.units.push(Hero.makeGuardianConf());
  }

  private static guardianIdx: number = 0;
  public static makeGuardianConf(): UnitData {
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
      experience: 0,
      level: 1,
      attackBonus: 0,
      defenseBonus: 0
    }
  };

  private static harvesterIdx: number = 0;
  public static makeHarvesterConf(): UnitData {
    return {
      id: "type_1_unit_" + Hero.harvesterIdx,
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
      experience: 0,
      level: 1,
      attackBonus: 0,
      defenseBonus: 0,
      harvest: 1,
      harvestBonus: 0,
    }
  };

  private static builderIdx: number = 0;
  public static makeBuilderConf(): UnitData {
    return {
      id: 'type_2_unit_' + this.builderIdx,
      icon: "icon_builder",
      name: "Строитель",
      type: "builder",
      side: 'defend',
      armor: 40,
      attack: 0,
      defense: 1,
      range: 1,
      health: 1,
      energy: 1,
      experience: 0,
      level: 1,
      attackBonus: 0,
      defenseBonus: 0,
      repair: 1,
      repairBonus: 0
    }
  };


  public static printHTMLData(conf: UnitData) {
    let lvl = conf.level;
    let exp = conf.experience + ' / ' + Hero.expTable[conf.level - 1];;
    let atk = conf.attack;
    let atkBonus = conf.attackBonus > 0 ? '+' + conf.attackBonus : ''
    let def = conf.defense;
    let defBonus = conf.defenseBonus > 0 ? '+' + conf.defenseBonus : ''
    let hp = Math.floor(conf.armor * conf.health) + ' / ' + conf.armor;
    let makeRow = (attr, base, bonus) => {
      return '<tr><td >' + attr + '</td>' +
        '<td >&nbsp;</td>' +
        '<td style="text-align: right">' + base + '</td>' +
        '<td style="color: #23c600">' + bonus + '</td></tr>';
    }
    let optional = '';

    if (conf.type == 'builder') {
      optional = makeRow('Ремонт', conf.repair, conf.repairBonus > 0 ? '+' + conf.repairBonus : '');
    } else if (conf.type == 'harvester') {
      optional = makeRow('Сбор', conf.harvest, conf.harvestBonus > 0 ? '+' + conf.harvestBonus : '');
    }
    let result = '<table style="left: 0; right: 0; margin-left: auto; margin-right: auto;">' +
      makeRow('Уровень', lvl, '') +
      makeRow('Опыт', exp, '') +
      makeRow('&nbsp', '', '') +
      optional +
      makeRow('Атака', atk, atkBonus) +
      makeRow('Защита', def, defBonus) +
      makeRow('Структура', hp, '') +
      '</table>';
    return result;
  }
}
