import { RequestState } from './types';
import requestState from './reducer';

interface State {
  obj: RequestState<null, string>;
}

describe('tests the requests reducer', () => {
  it('build the correct structure', () => {
    const request = requestState();

    expect(request).toHaveProperty('config');
    expect(request).toHaveProperty('initialized');
    expect(request).toHaveProperty('data');
    expect(request).toHaveProperty('error');
    expect(request).toHaveProperty('pending');
    expect(request).toHaveProperty('meta');
  });
});

describe('tests the initialization', () => {
  it('initializes with correct key values', () => {
    const state: State = {
      obj: requestState(),
    };

    expect(state.obj.config.clearData).toBe(false);
    expect(state.obj.config.clearError).toBe(false);
    expect(state.obj.config.initialData).toBe(undefined);

    expect(state.obj.initialized).toBe(false);
    expect(state.obj.data).toBe(undefined);
    expect(state.obj.error).toBe(undefined);
    expect(state.obj.pending).toBe(false);
    expect(state.obj.meta).toBe(undefined);
  });

  it('initializes the data with the specified type', () => {
    const obj = requestState<null>({ initialData: null });
    expect(obj.data).toBe(null);
  });

  it('initializes the data with undefined when not set', () => {
    const obj = requestState<null>();
    expect(obj.data).toBe(undefined);
  });

  it('initialzes the data with an empty collection', () => {
    const obj = requestState<number[]>({ initialData: [] });
    expect(obj.data).toStrictEqual([]);
  });

  it('sets the initialized property when any method is called', () => {
    const state = requestState();
    expect(state.initialized).toBe(false);

    expect(requestState.request(state).initialized).toBe(true);
    expect(requestState.succeeded(state, 'data').initialized).toBe(true);
    expect(requestState.failed(state, 'error').initialized).toBe(true);
  });
});

describe('tests the "request" method', () => {
  it('set the pending', () => {
    const obj = requestState();
    const result = requestState.request(obj);

    expect(result.pending).toBe(true);
  });

  it('sets the meta it passed by', () => {
    const obj = requestState<undefined, string>();
    const result = requestState.request(obj, 'meta');

    expect(result.meta).toBe('meta');
  });

  it('does not clear the data by default', () => {
    const obj = requestState<string>({ initialData: 'initialValue' });
    obj.data = 'changedValue';
    const result = requestState.request(obj);

    expect(result.data).toBe('changedValue');
  });

  it('clears the data if set in config', () => {
    const obj = requestState<string>({ clearData: true, initialData: 'initialValue' });
    obj.data = 'changedValue';
    const result = requestState.request(obj);

    expect(result.data).toBe('initialValue');
  });

  it('does not clear the error by default', () => {
    const obj = requestState();
    obj.error = 'error';
    const result = requestState.request(obj);

    expect(result.error).toBe('error');
  });

  it('clears the error if set in config', () => {
    const obj = requestState({ clearError: true });
    obj.error = 'error';
    const result = requestState.request(obj);

    expect(result.error).toBe(undefined);
  });
});

describe('tests the "failed" method', () => {
  it('set the error and unset pending', () => {
    const obj = requestState();
    const result = requestState.failed(obj, 'error');

    expect(result.error).toBe('error');
    expect(result.pending).toBe(false);
  });

  it('does not clear the data by default', () => {
    const obj = requestState<string>({ initialData: 'initialValue' });
    obj.data = 'changedValue';
    const result = requestState.failed(obj, 'error');

    expect(result.data).toBe('changedValue');
  });

  it('clears the data if set in config', () => {
    const obj = requestState<string>({ clearData: true, initialData: 'initialValue' });
    obj.data = 'changedValue';
    const result = requestState.failed(obj, 'error');

    expect(result.data).toBe('initialValue');
  });

  it('does not clear the meta', () => {
    const obj = requestState<undefined, string>();
    obj.meta = 'meta';
    const result = requestState.failed(obj, 'error');

    expect(result.meta).toBe('meta');
  });
});

describe('tests the "succeeded" method', () => {
  it('set the data, unset any error and unset pending', () => {
    const obj = requestState<string>();
    const result = requestState.succeeded(obj, 'data');

    expect(result.error).toBe(undefined);
    expect(result.pending).toBe(false);
    expect(result.data).toBe('data');
  });

  it('does not clear the meta', () => {
    const obj = requestState<string, string>();
    obj.meta = 'meta';
    const result = requestState.succeeded(obj, 'data');

    expect(result.meta).toBe('meta');
  });
});
