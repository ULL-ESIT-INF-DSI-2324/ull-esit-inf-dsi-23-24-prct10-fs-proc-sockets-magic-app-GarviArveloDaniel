import 'mocha';
import { expect } from 'chai';
import { Collection } from '../../src/magic_app/server/collection.js';
import { Color, Rarity, CardType } from '../../src/magic_app/card_interface.js';
import fs from 'fs';
import { dirname } from 'path';
import * as path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fullPath = __dirname + '/../../Collections/testUser';
const testUserDir = path.resolve(fullPath);


describe('Collection', () => {
  let collection: Collection;

  beforeEach(() => {
    collection = new Collection();
  });

  it('should add a card to the collection', (done) => {
    const card = {
      id: 1,
      name: 'Test Card',
      manaCost: 3,
      color: Color.blue,
      type: CardType.creature,
      rarity: Rarity.common,
      rulesText: 'Test rules text',
      marketValue: 5,
    };
    collection.add('testUser', card, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      expect(error).to.be.undefined;
      expect(fs.existsSync(testUserDir + '/1')).to.equal(true);
      done();
    });
  });

  it('should not add a card if it already exists', (done) => {
    const card = {
      id: 2,
      name: 'Another Test Card',
      manaCost: 2,
      color: Color.black,
      type: CardType.instant,
      rarity: Rarity.uncommon,
      rulesText: 'Another test rules text',
      marketValue: 3,
    };

    collection.add('testUser', card, (error, data) => {
      expect(error).to.be.undefined;
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      collection.add('testUser', card, (error, data) => {
        expect(error).to.be.deep.equal(chalk.red(`Card with id ${card.id} already exists in collection`));
        expect(data).to.be.undefined;
        const files = fs.readdirSync(testUserDir);
        const count = files.filter(file => file === '2').length;
        expect(count).to.equal(1);
        done();
      });
    });

  });

  it('should modify a card in the collection', (done) => {
    const card = {
      id: 3,
      name: 'Modify Test Card',
      manaCost: 4,
      color: Color.red,
      type: CardType.enchantment,
      rarity: Rarity.rare,
      rulesText: 'Modify test rules text',
      marketValue: 8,
    };
    collection.add('testUser', card, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      expect(error).to.be.undefined;
      card.marketValue = 10;
      collection.modify('testUser', card, (error, data) => {
        expect(error).to.be.undefined;
        expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} modified`));
        const modifiedCard = JSON.parse(fs.readFileSync(testUserDir + '/3').toString());
        expect(modifiedCard.marketValue).to.equal(10);
        done();
      });
    });
  });

  it('should handle the modify errors', (done) => {
    const card = {
      id: 4,
      name: 'Modify Test Card',
      manaCost: 4,
      color: Color.red,
      type: CardType.enchantment,
      rarity: Rarity.rare,
      rulesText: 'Modify test rules text',
      marketValue: 8,
    };
    collection.add('testUser', card, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      expect(error).to.be.undefined;
      card.marketValue = 10;
      collection.modify('noUser', card, (error, data) => {
        expect(error).to.be.deep.equal(chalk.red(`User noUser does not exist.`));
        expect(data).to.be.undefined;
        card.id = 5;
        collection.modify('testUser', card, (error, data) => {
          expect(error).to.be.deep.equal(chalk.red(`Card with id ${card.id} does not exist in collection`));
          expect(data).to.be.undefined;
          done();
        });
      });
    });
  });

  it('should remove a card from the collection', (done) => {
    const cardId = 5;
    const card = {
      id: cardId,
      name: 'Remove Test Card',
      manaCost: 1,
      color: Color.green,
      type: CardType.land,
      rarity: Rarity.mythic,
      rulesText: 'Remove test rules text',
      marketValue: 12,
    };
    collection.add('testUser', card, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      expect(error).to.be.undefined;
      collection.remove('testUser', cardId, (error, data) => {
        expect(error).to.be.undefined;
        expect(data).to.be.deep.equal(chalk.green(`Card with id ${cardId} removed from collection`));
        expect(fs.existsSync(testUserDir + '/5')).to.equal(false);
        done();
      });
    });
  });

  it('should handle the remove errors', (done) => {
    const cardId = 6;
    const card = {
      id: cardId,
      name: 'Remove Test Card',
      manaCost: 1,
      color: Color.green,
      type: CardType.land,
      rarity: Rarity.mythic,
      rulesText: 'Remove test rules text',
      marketValue: 12,
    };
    collection.add('testUser', card, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      expect(error).to.be.undefined;
      collection.remove('noUser', cardId, (error, data) => {
        expect(error).to.be.deep.equal(chalk.red(`User noUser does not exist.`));
        expect(data).to.be.undefined;
        collection.remove('testUser', 7, (error, data) => {
          expect(error).to.be.deep.equal(chalk.red(`Card with id 7 does not exist in collection`));
          expect(data).to.be.undefined;
          done();
        });
      });
    });
  });

  it('should list all cards in the collection', (done) => {
    const card1 = {
      id: 7,
      name: 'List Card 1',
      manaCost: 2,
      color: Color.white,
      type: CardType.creature,
      rarity: Rarity.common,
      rulesText: 'List test rules text 1',
      marketValue: 6,
    };
    const card2 = {
      id: 8,
      name: 'List Card 2',
      manaCost: 3,
      color: Color.red,
      type: CardType.instant,
      rarity: Rarity.uncommon,
      rulesText: 'List test rules text 2',
      marketValue: 7,
    };
    collection.add('testUser', card1, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card1.id} added to collection`));
      expect(error).to.be.undefined;
      collection.add('testUser', card2, (error, data) => {
        expect(data).to.be.deep.equal(chalk.green(`Card with id ${card2.id} added to collection`));
        expect(error).to.be.undefined;
        collection.list('testUser', (error, data) => {
          expect(error).to.be.undefined;
          expect(data?.length).to.be.deep.equal(7);
          done();
        });
      });
    });
  });

  it('should handle the list errors', (done) => {
    collection.list('noUser', (error, data) => {
      expect(error).to.be.deep.equal(chalk.red(`User noUser does not exist.`));
      expect(data).to.be.undefined;
      done();
    });
  });

  it('should read a card from the collection', (done) => {
    const card = {
      id: 9,
      name: 'Read Test Card',
      manaCost: 4,
      color: Color.green,
      type: CardType.enchantment,
      rarity: Rarity.rare,
      rulesText: 'Read test rules text',
      marketValue: 9,
    };
    collection.add('testUser', card, (error, data) => {
      expect(data).to.be.deep.equal(chalk.green(`Card with id ${card.id} added to collection`));
      expect(error).to.be.undefined;
      collection.read('testUser', 9, (error, data) => {
        expect(error).to.be.undefined;
        expect(data).to.be.deep.equal(JSON.stringify(card));
        done();
      });
    });
  });

  it('should handle the read errors', (done) => {
    collection.read('noUser', 10, (error, data) => {
      expect(error).to.be.deep.equal(chalk.red(`User noUser does not exist.`));
      expect(data).to.be.undefined;
      collection.read('testUser', 11, (error, data) => {
        expect(error).to.be.deep.equal(chalk.red(`Card with id 11 does not exist in collection`));
        expect(data).to.be.undefined;
        done();
      });
    });
  });

  after(() => {
    if (fs.existsSync(testUserDir)) {
      fs.rmSync(testUserDir, { recursive: true });
    }
  });
});