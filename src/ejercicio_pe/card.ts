import { CardInterface, Color, CardType, Rarity, StrengthResistanceType } from "./card_interface.js";

/**
 * Represents a card in a card game.
 */
export class Card implements CardInterface {
  /**
   * Creates a new instance of the Card class.
   * @param id - The unique identifier of the card.
   * @param name - The name of the card.
   * @param manaCost - The mana cost of the card.
   * @param color - The color of the card.
   * @param type - The type of the card.
   * @param rarity - The rarity of the card.
   * @param rulesText - The rules text of the card.
   * @param marketValue - The market value of the card.
   * @param strengthResitance - The strength and resistance type of the card (optional).
   * @param loyalty - The loyalty of the card (optional).
   */
  constructor(
    public id: number,
    public name: string,
    public manaCost: number,
    public color: Color,
    public type: CardType,
    public rarity: Rarity,
    public rulesText: string,
    public marketValue: number,
    public strengthResitance?: StrengthResistanceType,
    public loyalty?: number
  ) {}
}
