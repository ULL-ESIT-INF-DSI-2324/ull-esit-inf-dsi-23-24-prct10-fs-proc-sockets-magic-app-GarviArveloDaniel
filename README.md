# Práctica 10 - Aplicación cliente-servidor para coleccionistas de cartas Magic



**Información de contacto:**
  - Daniel Garvi Arvelo
    - GitHub: [@GarviArveloDaniel](https://github.com/GarviArveloDaniel)
    - Email: [alu0101501338@ull.edu.es](mailto:alu0101501338@ull.edu.es)

## 🌳 Estructura del repositorio
```shell
.
├── Collections
│   └── edegre
│       ├── 1
│       └── 2
├── package.json
├── package-lock.json
├── README.md
├── sonar-project.properties
├── src
│   ├── ejercicio_pe
│   │   ├── card_interface.ts
│   │   ├── card.ts
│   │   ├── card_utilities.ts
│   │   └── collection.ts
│   └── magic_app
│       ├── card_interface.ts
│       ├── card_utilities.ts
│       ├── client
│       │   └── client.ts
│       └── server
│           ├── collection.ts
│           ├── request_event_emitter.ts
│           └── server.ts
├── tests
│   ├── tests_magic_app
│   │   └── magic_app.spec.ts
│   └── tests_pe_magic_app
│       └── magic_app_pe.spec.ts
└── tsconfig.json

10 directories, 19 files
```

## 📚Introducción

En esta práctica partimos de la práctica 9, y debemos modificarla para implementar la técnica modelo servidor, donde el cliente se encarga de recoger los datos introducidos por el usuario y enviarlos al servidor, y el servidor se encarga de realizar las operaciones correspondientes y devolver una respuesta.

## 📋Tareas Previas

Al igual que en prácticas anteriores, en primer lugar acepto la tarea de github Classroom para poder acceder al repositorio, realizo la misma configuración que en la práctica anteior y además instalo los paquetes `chalk` y `yargs`.

## Enunciado

Debemos diseñar una aplicación para coleccionistas de cartas magic. La aplicación, diseñada para ser utilizada exclusivamente desde la línea de comandos, permitirá a múltiples usuarios interactuar con sus respectivas colecciones, ofreciendo funciones para añadir, modificar, eliminar, listar y mostrar información detallada de las cartas. Cada carta se describirá con atributos como ID único, nombre, coste de maná, color, tipo, rareza, texto de reglas, fuerza/resistencia (en caso de ser criatura), marcas de lealtad (para Planeswalkers) y valor de mercado. Antes de añadir o modificar una carta, se realizarán verificaciones para evitar duplicados o errores, y al listar las cartas, se utilizará el paquete chalk para mostrar los colores correspondientes. Las cartas se almacenarán como archivos JSON individuales en un directorio nombrado según el usuario, utilizando la API asíncrona de Node.js para el manejo de ficheros.

Además, se implementará un modelo cliente servidor:

Toda la lógica asociada a la gestión del sistema de ficheros tendrá que estar implementada en el lado del servidor. El servidor deberá ser capaz de procesar una petición. En primer lugar, deberá ser capaz de identificar el tipo de petición que ha recibido desde un cliente para, seguidamente, llevar a cabo las comprobaciones y operaciones necesarias con el sistema de ficheros. Además, deberá ser capaz de construir y enviar un mensaje de respuesta al cliente, el cual puede ser satisfactorio o no. Una vez enviado dicho mensaje, deberá cerrar el lado cliente del socket.

Toda la lógica asociada al paso de parámetros desde línea de comandos y su procesamiento mediante yargs tendrá que estar implementada en el lado del cliente. El cliente deberá ser capaz de enviar una petición al servidor. Además, deberá ser capaz de recibir una respuesta del servidor y procesarla. Por ejemplo, si el cliente ha solicitado al servidor la lectura de una carta concreta y el servidor ha respondido satisfactoriamente (porque la carta solicitada existe), dicha respuesta contendrá la información de la carta que se ha leído. El cliente deberá mostrar la información recibida en la respuesta por la consola utilizando chalk.

## Implementación

### Implementación Card

Se desarrolla la clase `Card` que a su vez implementa la interfaz `CardInterface` que lista todos los atributos que debe poseer una carta Magic, además, se crean una serie de enums `Color`, `CardType` y `Rarity` que limitan las opciones de ciertos atributos.

```ts
export class Card implements CardInterface {
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
```
### Card utilities

También se desarrollaron dos funciones para facilitar la impresión de la información de las cartas en el formato adecuado:

  - `colorString`:
  ```ts
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
  ```

  - `printCard`:
  ```ts
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
  ```

### Collection

Se desarrolla una clase `Collection` con único atributo el path al directorio donde se almacenarán las colecciones. La clase presenta además cinco métodos que usan la API asíncrona de Node fs:

  - `add y addCard`:
  ```ts
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
  ```
  En primer lugar comprobamos si existe el directorio con el nombre del usuario (es decir, si existe el usuario), en caso de que no, se crea un directorio con el nombre del usuario y se comprueba si la carta ya existe antes de añadirla. Está dividida en dos partes para mayor simplicidad de lectura. Se hace uso de callbacks para retornar errores o información.

  - `modify`:
  ```ts
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
  ```
  Primero comprobamos si existe el usuario y posteriormente si existe la carta, en caso de que si, se sobreescribe el fichero. Se hace uso de callbacks para retornar errores o información.

  - `remove`:
  ```ts
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
  ```
  De forma similar a la anterior, comprobamos la existencia del usuario y carta, y la eliminamos, usando callbacks para el retorno de errores o información.

  - `list`:
  ```ts
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
  ```
  Realizamos las comprobaciones pertinentes y para listar todas las cartas primero cargamos todas las cartas de un usuario y luego mediante un forEach almacenamos la información de las cartas en un vector, cuando el vector tenga todas las cartas se llama al callback para retornar la información.

  - `read`:
  ```ts
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
  ```
  Para leer una carta, realizamos las correspondientes comprobaciones y devolvemos la información.

Podemos comprobar que en cada caso los mensajes por la consola se pasan en color verde, y los de error en color rojo.

### Intérprete de línea de comandos en client.ts

En el archivo client.ts se ha implementado toda la funcionalidad para poder leer comandos desde la línea de comandos y realizar enviar los datos al servidor. También se puede apreciar como se recibe el mensaje de vuelta del servidor y las acciones que se realizan con este. A continuación se muestra el ejemplo para el método add:

```ts
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


let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

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
```

En primer lugar creamos el socket `cliente` para conectarnos al servidor, luego obtenemos los parametros por linea de comandos, y creamos el mensaje que se va a mandar al servidor. Cabe destacar el atributo `closed` que se usará en el servidor para comprobar si se ha recibido todo el mensaje.

Como el servidor cierra la conexión justo después de enviar el mensaje, aprovechamos el evento `end` para saber que ya se ha recibido todo el mensaje (mientras tanto, se recoge toda la información recibida mediante el evento `data`). Una vez recibido, se comprueba el estatus, que permite saber si hemos recibido una sola carta o una colección entera y la imprimimos. Si no es alguna de estas dos (el ultimo else), se trata de un mensaje de exito o error que, como el metodo en `Collections` le asigna el chalk, lo imprimimos directamente.

Para el resto de comandos la estructura es la misma, cambiando para cada caso, el método llamado y los comandos que se piden.

### Clase RequestEventEmitter para el servidor

Se crea una clase `RequestEventEmitter` que hereda de `EventEmitter` y se encarga de cerciorarse de que se ha recibido todo el mensaje enviado desde el cliente y posteriormente emite un evento `request` junto con el mensaje para notificar al servidor.

```ts
export class RequestEventEmitter extends EventEmitter {
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
```

### Servidor

El servidor recibe la petición del cliente y mmediante un switch, realiza una de las 5 acciones posibles sobre la colección. Además, recibe la información de los callback de los métodos de la clase `Collection` y construye un mensaje que es devuelto al cliente.

```ts
net.createServer((connection) => {
  console.log('A client has connected.');

  const client = new RequestEventEmitter(connection);

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });

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
```

Se puede apreciar como se usa la clase `RequestEventEmitter` y luego se actua sobre el evento `request`. El mensaje que es devuelto al cliente tiene un atributo `status` que le indica que tipo de mensaje es (un mensaje informativo de error o exito, la informacion de una unica carta o la informacion de una coleccion entera). Inmediatamente después de devolver el mensaje se cierra la conexion con el cliente.

## Ejercicio de pe

### Descripción del ejercicio
Durante la práctica 9, debería haber escrito métodos para añadir, modificar, borrar y actualizar la información de una carta de la colección de un usuario. Escoja alguna de esas funciones e impleméntela siguiendo el patrón callback.

Luego, sustituya la invocación de métodos del API síncrona de Node.js de gestión el sistema de ficheros, por llamadas a los métodos equivalentes del API asíncrona basada en callback.

### Solución implementada

La solución propuesta la podemos ver en el método `add`descrito más arriba.

## 💭Conclusiones

En el desarrollo de esta práctica hemos aplicado la técnica cliente-servidor, aplicandola sobre una práctica preexistente.

## 🔗Bibliografía

[Guión de práctica 10](https://ull-esit-inf-dsi-2324.github.io/prct10-fs-proc-sockets-magic-app/)

## 🛠️Herramientas
Algunas de las herramientas que se han utilizado en esta práctica son las siguientes:

<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white"/>  <img src="https://img.shields.io/badge/Github%20Actions-282a2e?style=for-the-badge&logo=githubactions&logoColor=367cfe"/> <img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white"/> <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"/> <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=Mocha&logoColor=white"/> <img src="https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white"/> 
