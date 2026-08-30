const { FileStorage } = require('../3-file-storage');
const fs = require('node:fs');
const readline = require('node:readline');

jest.mock('node:fs');
jest.mock('node:readline');

describe('FileStorage Unit Tests', () => {
  const fakeStream = {};
  let storage;

  beforeEach(() => {
    fs.createReadStream.mockReturnValue(fakeStream);

    const asyncIteratorMock = {
      [Symbol.asyncIterator]: () => ({
        next: jest.fn().mockResolvedValue({ done: true }),
      }),
    };

    readline.createInterface.mockReturnValue(asyncIteratorMock);
    storage = new FileStorage('fakefile.dat');
  });

  it('should initialize FileStorage with file stream', () => {
    expect(fs.createReadStream).toHaveBeenCalledWith('fakefile.dat');
    expect(storage.fileStream).toBe(fakeStream);
  });

  it('should return FileLineCursor from select', () => {
    const cursor = storage.select({ city: 'Roma' });
    expect(cursor.query).toEqual({ city: 'Roma' });
  });
});