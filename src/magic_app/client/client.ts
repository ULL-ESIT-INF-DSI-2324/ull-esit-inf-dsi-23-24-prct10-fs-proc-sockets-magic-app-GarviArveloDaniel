import { Color, CardType, Rarity } from "../card_interface.js";
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import net from 'net';
import { printCard } from '../card_utilities.js';

const client = net.connect({ port: 60300 });

yargs(hideBin(process.argv))
.command('add', 'Adds a card to the collection', {
    username: {
      description: 'The username of the collection owner',
      type: 'string',
      demandOption: true
    },
    id: {
      description: 'The ID of the card to add',
      type: 'number',
      demandOption: true
    },
    name: {
      description: 'The name of the card to add',
      type: 'string',
      demandOption: true
    },
    manaCost: {
      description: 'The mana cost of the card to add',
      type: 'number',
      demandOption: true
    },
    color: {
      description: 'The color of the card to add',
      type: 'string',
      demandOption: true
    },
    type: {
      description: 'The type of the card to add',
      type: 'string',
      demandOption: true
    },
    rarity: {
      description: 'The rarity of the card to add',
      type: 'string',
      demandOption: true
    },
    rulesText: {
      description: 'The rules text of the card to add',
      type: 'string',
      demandOption: true
    },
    marketValue: {
      description: 'The market value of the card to add',
      type: 'number',
      demandOption: true
    },
    strength: {
      description: 'The strength of the card to add',
      type: 'number',
      demandOption: false
    },
    resistance: {
      description: 'The resistance of the card to add',
      type: 'number',
      demandOption: false
    },
    loyalty: {
      description: 'The loyalty of the card to add',
      type: 'number',
      demandOption: false
    }
  }, (argv) => {
    const message = JSON.stringify({
      action: 'add',
      user: argv.username,
      card: {
        id: argv.id,
        name: argv.name,
        manaCost: argv.manaCost,
        color: Color[argv.color as keyof typeof Color],
        type: CardType[argv.type as keyof typeof CardType],
        rarity: Rarity[argv.rarity as keyof typeof Rarity],
        rulesText: argv.rulesText,
        marketValue: argv.marketValue,
        strengthResitance: argv.strength && argv.resistance ? [argv.strength, argv.resistance] : undefined,
        loyalty: argv.loyalty ? argv.loyalty : undefined
      },
      closed: 'DONE'
    });
    client.write(message);
  }).help().argv;

yargs(hideBin(process.argv))
  .command('modify', 'Modifies a card in the collection', {
    username: {
      description: 'The username of the collection owner',
      type: 'string',
      demandOption: true
    },
    id: {
      description: 'The ID of the card to modify',
      type: 'number',
      demandOption: true
    },
    name: {
      description: 'The name of the card to modify',
      type: 'string',
      demandOption: true
    },
    manaCost: {
      description: 'The mana cost of the card to modify',
      type: 'number',
      demandOption: true
    },
    color: {
      description: 'The color of the card to modify',
      type: 'string',
      demandOption: true
    },
    type: {
      description: 'The type of the card to modify',
      type: 'string',
      demandOption: true
    },
    rarity: {
      description: 'The rarity of the card to modify',
      type: 'string',
      demandOption: true
    },
    rulesText: {
      description: 'The rules text of the card to modify',
      type: 'string',
      demandOption: true
    },
    marketValue: {
      description: 'The market value of the card to modify',
      type: 'number',
      demandOption: true
    },
    strength: {
      description: 'The strength of the card to modify',
      type: 'number',
      demandOption: false
    },
    resistance: {
      description: 'The resistance of the card to modify',
      type: 'number',
      demandOption: false
    },
    loyalty: {
      description: 'The loyalty of the card to modify',
      type: 'number',
      demandOption: false
    }
  }, (argv) => {
    const message = JSON.stringify({
      action: 'modify',
      user: argv.username,
      card: {
        id: argv.id,
        name: argv.name,
        manaCost: argv.manaCost,
        color: Color[argv.color as keyof typeof Color],
        type: CardType[argv.type as keyof typeof CardType],
        rarity: Rarity[argv.rarity as keyof typeof Rarity],
        rulesText: argv.rulesText,
        marketValue: argv.marketValue,
        strengthResitance: argv.strength && argv.resistance ? [argv.strength, argv.resistance] : undefined,
        loyalty: argv.loyalty ? argv.loyalty : undefined
      },
      closed: 'DONE'
    });
    client.write(message);
  }).help().argv;

yargs(hideBin(process.argv))
  .command('remove', 'Removes a card from the collection', {
    username: {
      description: 'The username of the collection owner',
      type: 'string',
      demandOption: true
    },
    cardId: {
      description: 'The ID of the card to remove',
      type: 'number',
      demandOption: true
    }
  }, (argv) => {
    const message = JSON.stringify({
      action: 'remove',
      user: argv.username,
      cardId: argv.cardId,
      closed: 'DONE'
    });
    client.write(message);
  }).help().argv;

yargs(hideBin(process.argv))
  .command('list', 'Lists all the cards in the collection', {
    username: {
      description: 'The username of the collection owner',
      type: 'string',
      demandOption: true
    }
  }, (argv) => {
    const message = JSON.stringify({
      action: 'list',
      user: argv.username,
      closed: 'DONE'
    });
    client.write(message);
  }).help().argv;

yargs(hideBin(process.argv))
  .command('read', 'Reads a card from the collection', {
    username: {
      description: 'The username of the collection owner',
      type: 'string',
      demandOption: true
    },
    cardId: {
      description: 'The ID of the card to read',
      type: 'number',
      demandOption: true
    }
  }, (argv) => {
    const message = JSON.stringify({
      action: 'read',
      user: argv.username,
      cardId: argv.cardId,
      closed: 'DONE'
    });
    client.write(message);
  }).help().argv;

/**
 * Retrieves all the data the server sent, even if
 * it is sent in chunks.
 */
let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

/**
 * When the connection is closed, it
 * prints the output.
 */
client.on('end', () => {
  const message = JSON.parse(wholeData)
  if (message.status === 'CardCollection') {
    const cards = JSON.parse(message.answer);
    cards.forEach((card: string) => {
      printCard(JSON.parse(card));
    });
  } else if (message.status === 'SingleCard') {
    const card = JSON.parse(message.answer);
    printCard(card);
  } else {
    console.log(message.answer);
  }
});
