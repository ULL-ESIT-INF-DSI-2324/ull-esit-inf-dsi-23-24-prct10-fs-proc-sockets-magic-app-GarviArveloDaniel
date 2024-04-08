import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { printCard } from './card_utilities.js';
import fs from 'fs';
import chalk from 'chalk';
import { CardInterface } from './card_interface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __fullPath = __dirname + '/../../Collections';


/**
 * Implements methods to manage a collection of cards.
 */
export class Collection {
  /**
   * Creates an instance of Collection.
   * @param fullPath - The directory name where the collection is stored.
   */
  constructor(public fullPath = __fullPath) {
  }

  /**
   * Adds a card to the collection.
   * @param username - The username of the collection owner.
   * @param card - The card to be added.
   */
  public add(username: string, card: CardInterface, callback: (error: Error | undefined, data: string) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(this.fullPath + `/${username}`, (error) => {
          if (error) {
            callback(error, `Error creating the directory: ${error}`);
          } else {
            this.addCard(username, card, callback);
          }
        });
      } else {
        this.addCard(username, card, callback);
      }
    });
  }

  private addCard(username: string, card: CardInterface, callback: (error: Error | undefined, data: string) => void) {
    fs.access(this.fullPath + `/${username}/${card.id}`, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card), (error) => {
          if (error) {
            callback(error, `Error writing the file: ${error}`);
          } else {
            //console.log(chalk.green(`Card with id ${card.id} added to collection`));
            callback(undefined, `Card with id ${card.id} added to collection`);
          }
        });
      } else {
        //console.log(chalk.red(`Card with id ${card.id} already exists in collection`));
        callback(undefined, `Card with id ${card.id} already exists in collection`)
      }
    });
  }

  /**
   * Modifies a card in the collection.
   * @param username - The username of the collection owner.
   * @param card - The card to be modified.
   */
  public modify(username: string, card: CardInterface) {
    if(fs.existsSync(this.fullPath + `/${username}/${card.id}`)) {
      fs.writeFileSync(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card));
      console.log(chalk.green(`Card with id ${card.id} modified`));
    } else {
      console.error(chalk.red(`Card with id ${card.id} does not exist in collection`));
    }
  }

  /**
   * Removes a card from the collection.
   * @param username - The username of the collection owner.
   * @param cardId - The ID of the card to be removed.
   */
  public remove(username: string, cardId: number) {
    if(fs.existsSync(this.fullPath + `/${username}/${cardId}`)) {
      fs.unlinkSync(this.fullPath + `/${username}/${cardId}`);
      console.log(chalk.green(`Card with id ${cardId} removed from collection`));
    } else {
      console.error(chalk.red(`Card with id ${cardId} does not exist in collection`));
    }
  }
  
  /**
   * Lists all the cards in the collection.
   * @param username - The username of the collection owner.
   */
  public list(username: string) {
    const files = fs.readdirSync(this.fullPath + `/${username}`);
    files.forEach(file => {
      const card = JSON.parse(fs.readFileSync(this.fullPath + `/${username}/${file}`).toString());
      printCard(card);
    });
  }

  /**
   * Reads a card from the collection.
   * @param username - The username of the collection owner.
   * @param cardId - The ID of the card to be read.
   */
  public read(username: string, cardId: number) {
    if(fs.existsSync(this.fullPath + `/${username}/${cardId}`)) {
      const card = JSON.parse(fs.readFileSync(this.fullPath + `/${username}/${cardId}`).toString());
      printCard(card);
    } else {
      console.error(chalk.red(`Card with id ${cardId} does not exist in collection`));
    }
  }
}