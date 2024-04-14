import { EventEmitter } from 'events';

/**
 * Custom event emitter class that listens for data events on a connection and emits a 'request' event
 * when the received data includes the string 'DONE'.
 */
export class RequestEventEmitter extends EventEmitter {
  /**
   * Constructs a new RequestEventEmitter instance.
   * @param connection - The connection EventEmitter object to listen for data events on.
   */
  constructor(connection: EventEmitter) {
    super();
    let socketData = '';
    connection.on('data', (dataChunk) => {
      socketData += dataChunk;
      if (socketData.includes('DONE')) {
        this.emit('request', JSON.parse(socketData), connection);
      }
    });
  }
}
