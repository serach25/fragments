const Memory = require('../../src/model/data/memory/index');

describe('memory', () => {
  test('writeFragment(fragment) returns nothing', async () => {
    const result = await Memory.writeFragment({
      id: 'V1StGXR8_Z5jdHi6B-myT',
      ownerId: '0925f997',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    });
    expect(result).toBe(undefined);
  });

  test('readFragment(fragment) returns metadata that was put in', async () => {
    const fragment = {
      id: 'V1StGXR8_Z5jdHi6B-myT',
      ownerId: '0925f997',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    };
    await Memory.writeFragment(fragment);
    const result = await Memory.readFragment('0925f997', 'V1StGXR8_Z5jdHi6B-myT');
    expect(result).toEqual(fragment);
  });

  test('writeFragmentData() and readFragmentData() with Buffers', async () => {
    const data = Buffer.from([1, 2, 3]);
    await Memory.writeFragmentData('0925f997', 'V1StGXR8_Z5jdHi6B-myT', data);
    const result = await Memory.readFragmentData('0925f997', 'V1StGXR8_Z5jdHi6B-myT');
    expect(result).toEqual(data);
  });

  test('listFragments() returns all fragments with given primary key', async () => {
    const fragmentListItem1 = { ownerId: '0925f998', id: 'V1StGXR8_Z5jdHi6B-myA', size: 1 };
    await Memory.writeFragment(fragmentListItem1);
    const fragmentListItem2 = { ownerId: '0925f998', id: 'V1StGXR8_Z5jdHi6B-myB', size: 2 };
    await Memory.writeFragment(fragmentListItem2);
    const fragmentListItem3 = { ownerId: '0925f998', id: 'V1StGXR8_Z5jdHi6B-myC', size: 3 };
    await Memory.writeFragment(fragmentListItem3);

    const results = await Memory.listFragments('0925f998', true);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toEqual(3);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ size: 1 }),
        expect.objectContaining({ size: 2 }),
        expect.objectContaining({ size: 3 }),
      ])
    );
  });

  test('listFragments() returns fragment ID with given primary key', async () => {
    const fragmentListItem1 = { ownerId: '0925f999', id: 'V1StGXR8_Z5jdHi6B-myA', size: 1 };
    await Memory.writeFragment(fragmentListItem1);
    const fragmentListItem2 = { ownerId: '0925f999', id: 'V1StGXR8_Z5jdHi6B-myB', size: 2 };
    await Memory.writeFragment(fragmentListItem2);
    const fragmentListItem3 = { ownerId: '0925f999', id: 'V1StGXR8_Z5jdHi6B-myC', size: 3 };
    await Memory.writeFragment(fragmentListItem3);

    const results = await Memory.listFragments('0925f999');
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toEqual(3);
    expect(results).toEqual(
      expect.arrayContaining([
        'V1StGXR8_Z5jdHi6B-myA',
        'V1StGXR8_Z5jdHi6B-myB',
        'V1StGXR8_Z5jdHi6B-myC',
      ])
    );
  });

  test('deleteFragment() removes value writeFragment() into db', async () => {
    const fragment = { ownerId: '0925f1000', id: 'V1StGXR8_Z5jdHi6B-myA', size: 1 };
    await Memory.writeFragment(fragment);
    const result = await Memory.readFragment('0925f1000', 'V1StGXR8_Z5jdHi6B-myA');
    expect(result).toEqual(fragment);

    const data = Buffer.from([1, 2, 3]);
    await Memory.writeFragmentData('0925f1000', 'V1StGXR8_Z5jdHi6B-myA', data);
    const resultData = await Memory.readFragmentData('0925f1000', 'V1StGXR8_Z5jdHi6B-myA');
    expect(resultData).toEqual(data);

    await Memory.deleteFragment('0925f1000', 'V1StGXR8_Z5jdHi6B-myA');
    expect(await Memory.readFragment('0925f1000', 'V1StGXR8_Z5jdHi6B-myA')).toBe(undefined);
  });

  test('deleteFragment() throws if primaryKey and secondarykey not in db,', () => {
    expect(() => Memory.deleteFragment('0925f1000', 'V1StGXR8_Z5jdHi6B-myA')).rejects.toThrow();
  });
});
