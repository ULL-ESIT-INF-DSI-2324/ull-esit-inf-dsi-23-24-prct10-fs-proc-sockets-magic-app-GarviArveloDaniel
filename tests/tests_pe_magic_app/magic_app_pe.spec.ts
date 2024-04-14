import 'mocha';
import { expect } from 'chai';
import { Card } from '../../src/ejercicio_pe/card.js';
import { Color, Rarity, CardType } from '../../src/ejercicio_pe/card_interface.js';
import { colorString } from '../../src/ejercicio_pe/card_utilities.js';
import chalk from 'chalk';


describe('Card', () => {
  it('should create a new card with optional parameters', () => {
    const card = new Card(
      1,
      'Test Card',
      3,
      Color.blue,
      CardType.creature,
      Rarity.common,
      'Test rules text',
      5,
      [2, 3],
      4
    );

    expect(card.id).to.equal(1);
    expect(card.name).to.equal('Test Card');
    expect(card.manaCost).to.equal(3);
    expect(card.color).to.equal(Color.blue);
    expect(card.type).to.equal(CardType.creature);
    expect(card.rarity).to.equal(Rarity.common);
    expect(card.rulesText).to.equal('Test rules text');
    expect(card.marketValue).to.equal(5);
    expect(card.strengthResitance).to.eql([2, 3]);
    expect(card.loyalty).to.equal(4);
  });

  it('should create a new card without optional parameters', () => {
    const card = new Card(
      2,
      'Another Test Card',
      2,
      Color.black,
      CardType.instant,
      Rarity.uncommon,
      'Another test rules text',
      3
    );

    expect(card.id).to.equal(2);
    expect(card.name).to.equal('Another Test Card');
    expect(card.manaCost).to.equal(2);
    expect(card.color).to.equal(Color.black);
    expect(card.type).to.equal(CardType.instant);
    expect(card.rarity).to.equal(Rarity.uncommon);
    expect(card.rulesText).to.equal('Another test rules text');
    expect(card.marketValue).to.equal(3);
    expect(card.strengthResitance).to.be.undefined;
    expect(card.loyalty).to.be.undefined;
  });
  
  describe('colorString Function', () => {
    it('should correctly apply color to string', () => {
      const testString = 'Test String';
  
      expect(colorString('white', testString)).to.equal(chalk.white(testString));
      expect(colorString('blue', testString)).to.equal(chalk.blue(testString));
      expect(colorString('black', testString)).to.equal(chalk.black(testString));
      expect(colorString('red', testString)).to.equal(chalk.red(testString));
      expect(colorString('green', testString)).to.equal(chalk.green(testString));
      expect(colorString('colorless', testString)).to.equal(chalk.white(testString));
      expect(colorString('multi', testString)).to.equal(chalk.white(testString));
    });
  });

});
