const fs = require('node:fs/promises');
const { FileStorage } = require('../3-file-storage');

describe('FileStorage Integration Tests', () => {
  const testFile = './storage.dat';

  beforeAll(async () => {
    const data = [
      '{ "city": "Kiev", "name": "Glushkov" }',
      '{ "city": "Roma", "name": "Marcus Aurelius" }',
      '{ "city": "Shaoshan", "name": "Mao Zedong" }',
      '{ "city": "Roma", "name": "Lucius Verus" }',
    ].join('\n');

    await fs.writeFile(testFile, data);
  });

  afterAll(async () => {
    await fs.unlink(testFile);
  });

  it('should correctly filter records by city', async () => {
    const db = new FileStorage(testFile);
    const cursor = db.select({ city: 'Roma' });

    const results = [];
    for await (const record of cursor) {
      results.push(record.name);
    }

    expect(results).toContain('Marcus Aurelius');
    expect(results).toContain('Lucius Verus');
    expect(results.length).toBe(2);
  });

  it('should return no records for unmatched query', async () => {
    const db = new FileStorage(testFile);
    const cursor = db.select({ city: 'Paris' });

    const results = [];
    for await (const record of cursor) {
      results.push(record.name);
    }

    expect(results.length).toBe(0);
  });
});
