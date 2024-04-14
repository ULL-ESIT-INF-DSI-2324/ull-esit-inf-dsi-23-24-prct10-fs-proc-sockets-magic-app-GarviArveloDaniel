import net from 'net';
import { RequestEventEmitter } from './request_event_emitter.js';
import { Collection } from './collection.js';

net.createServer((connection) => {
  console.log('A client has connected.');

  /**
   * Represents the client object for handling request events.
   */
  const client = new RequestEventEmitter(connection);

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });

  /**
   * When a request is detected, it processes the request and sends a response.
   */
  client.on('request', (request) => {
    console.log(`Request recieved (${request.action})`);
    const collection = new Collection();
    switch(request.action) {
      case 'add': {
        collection.add(request.user, request.card, (error, data) => {
          if(error) {
            connection.write(JSON.stringify({ status: 'error', answer: error }));
          } else {
            connection.write(JSON.stringify({ status: 'success', answer: data }));
          }
          connection.end();
        });
        break;
      }
      case 'modify': {
        collection.modify(request.user, request.card, (error, data) => {
          if(error) {
            connection.write(JSON.stringify({ status: 'error', answer: error }));
          } else {
            connection.write(JSON.stringify({ status: 'success', answer: data }));
          }
          connection.end();
        });
        break;
      }
      case 'remove': {
        collection.remove(request.user, request.cardId, (error, data) => {
          if(error) {
            connection.write(JSON.stringify({ status: 'error', answer: error }));
          } else {
            connection.write(JSON.stringify({ status: 'success', answer: data }));
          }
          connection.end();
        });
        break;
      }
      case 'list': {
        collection.list(request.user, (error, data) => {
          if(error) {
            connection.write(JSON.stringify({ status: 'error', answer: error }));
          } else {
            connection.write(JSON.stringify({ status: 'CardCollection', answer: JSON.stringify(data) }));
          }
          connection.end();
        });
        break;
      }
      case `read`: {
        collection.read(request.user, request.cardId, (error, data) => {
          if(error) {
            connection.write(JSON.stringify({ status: 'error', answer: error }));
          } else {
            connection.write(JSON.stringify({ status: 'SingleCard', answer: data }));
          }
          connection.end();
        });
        break;
      }
      default: {
        console.error('Invalid action');
      }
    }
  })

}).listen(60300, () => {
  console.log("Waiting for clients to connect...");
});
