import { useEffect, useState } from 'react';

import useTimeStampedState, { TimeStampedState } from './useTimeStampedState';

// HTTP Method supported in this application
type Method = 'DELETE'|'GET'|'POST'|'PUT';

/**
 * An error response object.
 * It contains the original Response from fetch
 */
class ErrorResponse extends Error {
  private resp: Response;

  constructor(msg: string, res: Response) {
    super(msg);
    this.resp = res;
  }

  getStatusCode(): number {
    return this.resp.status;
  }

  getRawResponse(): Response {
    return this.resp;
  }
}

/**
 * Wrapper class to be able to cancel a request
 */
class RequestCanceller {
  private ctrl: AbortController;
  constructor(ctrl: AbortController) {
    this.ctrl = ctrl;
  }
  cancelRequest(msg?: string) {
    this.ctrl.abort(msg);
  }
}

/**
 * A high level HTTP fetching function
 * to post and get JSON data.
 * @param url
 * @param method
 * @param data
 * @returns a canceller object and the promise containing the response data.
 */
export function request<T, U>(url: URL|string, method: Method, data?: T): [RequestCanceller, Promise<U>] {
  const controller = new AbortController();
  const canceller = new RequestCanceller(controller);
  const respP = fetch(url, {
    method: method,
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    signal: controller.signal,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data ? JSON.stringify(data) : undefined // body data type must match "Content-Type" header
    }).then((resp: Response) => {
    if (resp.ok) {
      const ret = resp.json().catch(_ => {/* fail silently (not a JSON*/}) as U
      return ret;
    } else {
      throw new ErrorResponse('Request failed with status code ' + resp.status, resp);
    }
    }).catch(e => {
      console.error(e);
      throw e;
    });
    return [canceller, respP];
}


/**
 * A custom hook for fetching data
 * @param url the full constructed url
 * @param method HTTP Method
 * @param body request body if any
 * @returns the response data, a loading indicator and an error string
 */
export default function useFetch<T, U>(url: string, method: Method, body?: T): {data: TimeStampedState<U|null>, loading: boolean, error: string} {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useTimeStampedState<U|null>(null);

  function triggerRequest(url: string, _method: Method, _body?: T): boolean {
    if (!url) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (!triggerRequest(url, method, body)) {
      return;
    }
    setLoading(true);
    const [canceller, resP] = request<T, U>(url, method, body);
    resP.then((json: U): void => {
      setLoading(false);
      setData(json);
    }).catch(e => {
      if (e instanceof ErrorResponse) {
        try {
        console.error(e.getRawResponse().json())
        } catch (_ignore) {
          // nothing to do
        }
      }
      setLoading(false);
      setError(e.message);
    });
    return () => {
      canceller.cancelRequest();
    };
  }, [url, method, body]);

  return { data, loading, error };
};
