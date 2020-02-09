'use strict';

const fs = require('fs');
const readline = require('readline');

class Database {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    if (proto.constructor === Database) {
      throw new Error('abstract class should not be instanciated');
    }
  }

  select() {
    throw new Error('select(${}) method is not implemented');
  }
}

class Cursor {
  constructor() {
    const proto = Object.getPrototypeOf(this);
    if (proto.constructor === Cursor) {
      throw new Error('abstract class should not be instanciated');
    }
    this.current = 0;
  }

  [Symbol.asyncIterator]() {
    throw new Error('iterator is not implemented');
  }
}

class FileLineCursor extends Cursor {
  constructor(fileStorage, query) {
    super();
    this.query = query;
    this.lines = readline.createInterface({
      input: fileStorage.fileStream,
      crlfDelay: Infinity,
    })[Symbol.asyncIterator]();
  }

  [Symbol.asyncIterator]() {
    const cursor = this;
    return ({
      async next() {
        do {
          const { value, done } = await cursor.lines.next();
          if (done) return { done: true };
          cursor.current++;
          const data = JSON.parse(value);
          let condition = true;
          const { query } = cursor;
          for (const field in query) {
            condition = condition && data[field] === query[field];
          }
          if (condition) return { value: data, done: false };
        } while (true);
      }
    });
  }
}

class FileStorage extends Database {
  constructor(fileName) {
    super();
    this.fileName = fileName;
    this.fileStream = fs.createReadStream(fileName);
  }

  select(query) {
    return new FileLineCursor(this, query);
  }
}

// Usage

(async () => {
  const db = new FileStorage('./storage.dat');
  const cursor = db.select({ city: 'Roma' });
  for await (const record of cursor) {
    console.dir(record);
  }
})();