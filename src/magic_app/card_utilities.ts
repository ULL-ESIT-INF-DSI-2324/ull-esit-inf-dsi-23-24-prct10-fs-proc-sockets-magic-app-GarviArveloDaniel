import chalk from 'chalk';
import { CardInterface } from "./card_interface.js";

/**
 * Prints the details of a card.
 * 
 * @param card - The card object to be printed.
 */
export function printCard(card: CardInterface) {
  console.log(chalk.white.underline.bgBlack("Card Details"));
  console.log(`Card ID: ${card.id}`);
  console.log(`Card Name: ${card.name}`);
  console.log(`Card Color: ${colorString(card.color, card.color)}`);
  console.log(`Card Type: ${card.type}`);
  console.log(`Card Rarity: ${card.rarity}`);
  console.log(`Card Market Value: ${card.marketValue}`);
  console.log(`Card Rules Text: ${card.rulesText}`);
  if(card.strengthResitance) {
    console.log(`Card Strength: ${card.strengthResitance[0]}`);
    console.log(`Card Resistance: ${card.strengthResitance[1]}`);
  }
  if(card.loyalty) {
    console.log(`Card Loyalty: ${card.loyalty}`);
  }
  console.log('---------------------------------');
}

/**
 * Applies a color to a given string.
 * 
 * @param color - The color to apply. Possible values are 'white', 'blue', 'black', 'red', 'green', 'colorless', and 'multi'.
 * @param cadena - The string to apply the color to.
 * @returns The colored string.
 */
export function colorString(color:string, cadena:string) {
  switch(color) {
    case 'white':
      return chalk.white(cadena);
    case 'blue':
      return chalk.blue(cadena);
    case 'black':
      return chalk.black(cadena);
    case 'red':
      return chalk.red(cadena);
    case 'green':
      return chalk.green(cadena);
    case 'colorless':
      return chalk.white(cadena);
    case 'multi':
      return chalk.white(cadena);
    default:
      return chalk.white(cadena);
  }
}
