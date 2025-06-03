const UNAVAILABLE_ITEMS = [
    'wraith_pact',
    'helm_of_the_overlord',
    'trident',  // Kaya + Sange + Yasha combo
    'vampire_fangs',
    'helm_of_the_undying',
    'third_eye',
    'royal_jelly',
    'witless_shako',
    'princes_knife',
    'repair_kit',
    'greater_faerie_fire',
    'minotaur_horn',
    'poor_mans_shield',
    'iron_talon',
    'ring_of_aquila',
    'arcane_ring',
    'imp_claw',
    'ballista',
    'woodland_striders',
    'mind_breaker',
    'orb_of_destruction',
    'titan_sliver',
    'stormcrafter',
    'penta_edged_sword',
    'elven_tunic',
    'necronomicon',  // Removed Necronomicon item
    'necronomicon_1',  // Different level versions of Necronomicon
    'necronomicon_2',
    'necronomicon_3',
    'undefined',     // Remove undefined item
    'aghanims_blessing_roshan', // Aghanim's Blessing from Roshan
    // Basic components to exclude
    'sacred_relic',  // Sacred Relic
    'mystic_staff',  // Mystic Staff
    'reaver',        // Reaver
    'eagle',     // Eaglesong
    'relic',     // Sacred Relic
    'ultimate_scepter_roshan', // Aghanim's Scepter from Roshan
    'ultimate_orb',  // Ultimate Orb
    'soul_booster'   // Soul Booster
  ];
  
  // Component items to filter out (typically not purchased as final items)
  const COMPONENT_ITEM_NAMES = [
    'relic', 'eaglesong', 'reaver', 'mystic_staff', 'hyperstone',
    'void_stone', 'platemail', 'talisman_of_evasion', 'staff_of_wizardry',
    'claymore', 'blade_of_alacrity', 'ogre_axe', 'mithril_hammer',
    'ultimate_orb', 'demon_edge', 'broadsword', 'quarterstaff',
    'javelin', 'ring_of_health', 'void_stone', 'vitality_booster',
    'energy_booster', 'point_booster', 'vitality_booster', 'oblivion_staff'
  ];

  const EXCLUDED_HEROES = [
    'npc_dota_hero_broodmother',  // Broodmother
    'npc_dota_hero_meepo',        // Meepo
    'npc_dota_hero_chen',         // Chen
    'npc_dota_hero_visage',       // Visage
    'npc_dota_hero_arc_warden'    // Arc Warden
  ];

  const HEROES_URL = 'https://api.opendota.com/api/heroes';
  
  const ITEMS_URL = 'https://api.opendota.com/api/constants/items';


  module.exports = {
    UNAVAILABLE_ITEMS,
    COMPONENT_ITEM_NAMES,
    EXCLUDED_HEROES,
    HEROES_URL,
    ITEMS_URL
  }