import { useEffect, useState, useRef } from 'react';
import { request } from './request';

export const useAsyncEffect = async (delegate, stateTriggers, destroy) => {
  useEffect(() => {
    const controller = new AbortController();

    async function asyncEffect() {
      return await delegate(controller.signal);
    }

    asyncEffect();

    return () => {
      controller.abort();

      if (destroy) {
        destroy();
      }
    };

    // Really, I'm pretty confident I know what I'm doing here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...stateTriggers]);
};

export const useAsyncInterval  = (delegate, delay = null, stateTriggers) => {
  const savedCallback = useRef(delegate);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = delegate;
  }, [delegate]);

  // Set up the timeout loop.
  useAsyncEffect(async (abortSignal) => {
    let id;
    const tick = async () => {
      await savedCallback.current(abortSignal);

      if (delay !== null) {
        console.log('repeat in ' + delay);
        id = setTimeout(tick, delay);
      }
    };

    tick();

    return () => id && clearTimeout(id);
  }, [delay, ...stateTriggers]);
};

export const useProductionQuery = (query, delay) => {
  const [ data, setData ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState();

  useAsyncInterval(async (abortSignal) => {
    try {
      const result = await request(`${process.env.REACT_APP_API_URL}/reports/production`, {
        method: 'POST',
        body: query,
        signal: abortSignal,
      });

      setData(result);
    } catch(e) {
      setError(e);
    }

    setLoading(false);
  }, delay, [query]);

  return { data, error, loading };
};

export const useDowntimeQuery = (query) => {
  const [ data, setData ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState();

  useAsyncEffect(async (abortSignal) => {
    try {
      const result = await request(`${process.env.REACT_APP_API_URL}/reports/downtime`, {
        method: 'POST',
        body: query,
        signal: abortSignal,
      });

      setData(result);
    } catch(e) {
      setError(e);
    }

    setLoading(false);
  }, [query]);

  return { data, error, loading };
};
