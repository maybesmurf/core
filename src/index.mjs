/* eslint-disable import/extensions */
import Uwave from './Uwave.mjs';
import HttpApi from './HttpApi.mjs';
import SocketServer from './SocketServer.mjs';

/**
 * @param {import('./Uwave').Options} opts
 * @returns {Uwave}
 */
export default function uwave(opts) {
  return new Uwave(opts);
}

export { Uwave, HttpApi, SocketServer };
