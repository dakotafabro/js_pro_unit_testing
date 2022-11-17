const {
  flattenArr,
  dataFetcher,
  sortList,
  formatCurrency,
  handlePromises
} = require('./helpers.js');
const axios = require('axios');

jest.mock('axios');

describe('flattenArr', () => {
  it('return a non-nested arr', () => {
    const input = [1, 2, 3, 4];
    const expectedOutput = [1, 2, 3, 4];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });

  it('flattens a nested arr', () => {
    const input = [1, 2, 3, [4, 5, [6, 7, [8, [9, [10]]]]]];
    const expectedOutput = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    expect(flattenArr(input)).toEqual(expectedOutput);
  });
});

describe('dataFetcher', () => {
  it('handles a successful response', async () => {
    axios.get.mockImplementation(() => Promise.resolve({ data: { users: [] } }));

    const data = await dataFetcher();

    expect(data).toEqual({ data: { users: [] } });
  });

  it('handles an error response', async () => {
    axios.get.mockImplementation(() => Promise.reject('Boom'));

    try {
      await dataFetcher();
    } catch (e) {
      expect(e).toEqual(new Error({ error: 'Boom', message: 'An Error Occurred' }));
    }
  });
});

describe('sortList', () => {
  it('calls a sorter function if it is available', () => {
    const sortFn = jest.fn();

    sortList([3, 2, 1], sortFn);

    expect(sortFn).toBeCalled();
    expect(sortFn).toBeCalledTimes(1);
    expect(sortFn.mock.calls).toEqual([[[3, 2, 1]]]);
  });

  it('does not call a sorter function if the array has a length <= 1', () => {
    const sortFn = jest.fn();

    sortList([1], sortFn);

    expect(sortFn).not.toBeCalled();
    expect(sortFn).toBeCalledTimes(0);
  });
});

/**
 * Add you test/s here and get this helper file to 100% test coverage!!!
 * You can check that your coverage meets 100% by running `npm run test:coverage`
 */

describe('formatCurrency', () => {
  it('returns $0.00 when given a non number/integer', () => {
    const num = 'ABC';
    expect(formatCurrency(num)).toEqual('$0.00');
  });

  it('when given a valid num/integer, it returns that num in currency form', () => {
    const num = 5;
    expect(formatCurrency(num)).toEqual('$5.00');
  });
});

/*
handling promises in tests means you have to create the promise or the rejected promises yourself;
new syntax I learned was creating new promises as well as rejected promises that become errors
*/

describe('handlePromises', () => {
  it('resolves all promise', async () => {
    const promise1 = new Promise((res, rej) => {
      return res('HELLO');
    });

    const promise2 = new Promise((res, rej) => {
      return res('WORLD');
    });

    const data = await handlePromises([promise1, promise2]);
    expect(data).toEqual(['HELLO', 'WORLD']);
  });

  it('resolves rejected promises', async () => {
    const promise1 = new Promise((res, rej) => {
      return rej('ERROR');
    });

    const promise2 = new Promise((res, rej) => {
      return rej('ERROR AGAIN');
    });

    const data = await handlePromises([promise1, promise2]);
    expect(data).toEqual(new Error('ERROR')); // the expected value here is the first rejected promise because the error will be thrown and will stop the function, hence return the first rejection rather than all
  });
});
