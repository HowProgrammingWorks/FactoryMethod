export interface Query {
  [key: string]: any;
}

export interface Record {
  [key: string]: any;
}

export abstract class Database {
  abstract select(query: Query): AsyncIterable<Record>;
}

export abstract class Cursor {
  current: number;
  [Symbol.asyncIterator](): AsyncIterator<Record>;
}

export class FileLineCursor extends Cursor {
  constructor(fileStorage: FileStorage, query: Query);
}

export class FileStorage extends Database {
  constructor(fileName: string);
  select(query: Query): FileLineCursor;
}