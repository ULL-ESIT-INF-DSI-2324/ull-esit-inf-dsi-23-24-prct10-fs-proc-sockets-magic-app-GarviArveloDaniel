import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import chalk from 'chalk';
import { CardInterface } from '../card_interface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __fullPath = __dirname + '/../../../Collections';

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
  public add(username: string, card: CardInterface, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(this.fullPath + `/${username}`, (error) => {
          if (error) {
            callback(`Error creating the directory: ${error}`, undefined);
          } else {
            this.addCard(username, card, callback);
          }
        });
      } else {
        this.addCard(username, card, callback);
      }
    });
  }

  
  /**
   * Adds a card to the collection.
   * 
   * @param username - The username of the user.
   * @param card - The card to be added.
   * @param callback - The callback function that handles the result of the operation.
   *                   It takes two parameters: error (string or undefined) and data (string or undefined).
   */
  private addCard(username: string, card: CardInterface, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}/${card.id}`, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFile(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card), (error) => {
          if (error) {
            callback(`Error writing the file: ${error}`, undefined);
          } else {
            callback(undefined, chalk.green(`Card with id ${card.id} added to collection`));
          }
        });
      } else {
        callback(chalk.red(`Card with id ${card.id} already exists in collection`), undefined)
      }
    });
  }

  /**
   * Modifies a card in the collection.
   * @param username - The username of the collection owner.
   * @param card - The card to be modified.
   */
  public modify(username: string, card: CardInterface, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(chalk.red(`User ${username} does not exist.`), undefined);
      } else {
        fs.access(this.fullPath + `/${username}/${card.id}`, fs.constants.F_OK, (err) => {
          if (err) {
            callback(chalk.red(`Card with id ${card.id} does not exist in collection`), undefined);
          } else {
            fs.writeFile(this.fullPath + `/${username}/${card.id}`, JSON.stringify(card), (error) => {
              if (error) {
                callback(`Error writing the file: ${error}`, undefined);
              } else {
                callback(undefined, chalk.green(`Card with id ${card.id} modified`));
              }
            });
          }
        });
      }
    });
  }

  /**
   * Removes a card from the collection.
   * @param username - The username of the collection owner.
   * @param cardId - The ID of the card to be removed.
   */
  public remove(username: string, cardId: number, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(chalk.red(`User ${username} does not exist.`), undefined);
      } else {
        fs.access(this.fullPath + `/${username}/${cardId}`, fs.constants.F_OK, (err) => {
          if (err) {
            callback(chalk.red(`Card with id ${cardId} does not exist in collection`), undefined);
          } else {
            fs.unlink(this.fullPath + `/${username}/${cardId}`, (error) => {
              if (error) {
                callback(chalk.red(`Error removing the file: ${error}`), undefined);
              } else {
                callback(undefined, chalk.green(`Card with id ${cardId} removed from collection`));
              }
            });
          }
        });
      }
    });
  }
  
  /**
   * Lists all the cards in the collection.
   * @param username - The username of the collection owner.
   */
  public list(username: string, callback: (error: string | undefined, data: string[] | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(chalk.red(`User ${username} does not exist.`), undefined);
      } else {
        fs.readdir(this.fullPath + `/${username}`, (error, files) => {
          if (error) {
            callback(chalk.red(`Error reading the directory: ${error}`), undefined);
          } else {
            const fullContent: string[] = [];
            files.forEach(file => {
              fs.readFile(this.fullPath + `/${username}/${file}`, (error, data) => {
                if (error) {
                  callback(chalk.red(`Error reading the file: ${error}`), undefined);
                } else {
                  fullContent.push(data.toString());
                  if (fullContent.length === files.length) {
                    callback(undefined, fullContent);
                  }
                }
              });
            });
          }
        });
      }
    });
  }

  /**
   * Reads a card from the collection.
   * @param username - The username of the collection owner.
   * @param cardId - The ID of the card to be read.
   */
  public read(username: string, cardId: number, callback: (error: string | undefined, data: string | undefined) => void) {
    fs.access(this.fullPath + `/${username}`, fs.constants.F_OK, (err) => {
      if (err) {
        callback(chalk.red(`User ${username} does not exist.`), undefined);
      } else {
        fs.access(this.fullPath + `/${username}/${cardId}`, fs.constants.F_OK, (err) => {
          if (err) {
            callback(chalk.red(`Card with id ${cardId} does not exist in collection`), undefined);
          } else {
            fs.readFile(this.fullPath + `/${username}/${cardId}`, (error, data) => {
              if (error) {
                callback(chalk.red(`Error reading the file: ${error}`), undefined);
              } else {
                callback(undefined, data.toString());
              }
            });
          }
        });
      }
    });
  }
  
}
