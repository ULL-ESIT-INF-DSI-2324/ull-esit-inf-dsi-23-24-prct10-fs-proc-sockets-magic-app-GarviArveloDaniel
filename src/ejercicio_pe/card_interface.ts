/**
 * Represents the possible colors of cards in the game.
 */
export enum Color {
  white = 'white',
  blue = 'blue',
  black = 'black',
  red = 'red',
  green = 'green',
  colorless = 'colorless',
  multi = 'multi'
}

/**
 * Represents the types of cards in the game.
 */
export enum CardType {
  land = 'land',
  creature = 'creature',
  enchantment = 'enchantment',
  conjure = 'conjure',
  instant = 'instant',
  artefact = 'artefact',
  planeswalker = 'planeswalker'
}

/**
 * Represents the possible rarities of cards in the game.
 */
export enum Rarity {
  common = 'common',
  uncommon = 'uncommon',
  rare = 'rare',
  mythic = 'mythic'
}

/**
 * Represents the strength and resistance of a creature card.
 */
export type StrengthResistanceType = [number, number];

/**
 * Represents the interface for a card in the game Magic
 */
export interface CardInterface {
  /**
   * The unique identifier of the card.
   */
  id: number;
  /**
   * The name of the card.
   */
  name: string;
  /**
   * The mana cost of the card.
   */
  manaCost: number;
  /**
   * The color of the card.
   */
  color: Color;
  /**
   * The type of the card.
   */
  type: CardType;
  /**
   * The rarity of the card.
   */
  rarity: Rarity;
  /**
   * The rules text of the card.
   */
  rulesText: string;
  /**
   * The market value of the card.
   */
  marketValue: number;
  /**
   * The strength and resistance type of the card (optional).
   */
  strengthResitance?: StrengthResistanceType;
  /**
   * The loyalty of the card (optional).
   */
  loyalty?: number;
}
