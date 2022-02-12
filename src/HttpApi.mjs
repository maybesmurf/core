import { createRequire } from 'module';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import createDebug from 'debug';

// routes
import authenticate from './routes/authenticate.mjs';
import bans from './routes/bans.mjs';
import search from './routes/search.mjs';
import server from './routes/server.mjs';
import users from './routes/users.mjs';
import now from './routes/now.mjs';
import imports from './routes/import.mjs';

// middleware
import addFullUrl from './middleware/addFullUrl.mjs';
import attachUwaveMeta from './middleware/attachUwaveMeta.mjs';
import rateLimit from './middleware/rateLimit.mjs';
import errorHandler from './middleware/errorHandler.mjs';

// utils
import AuthRegistry from './AuthRegistry.mjs';
import matchOrigin from './utils/matchOrigin.mjs';

const debug = createDebug('uwave:http-api');
const require = createRequire(import.meta.url);
const optionsSchema = require('./schemas/httpApi.json');

/**
 * @param {{ token: string, requestUrl: string }} options
 * @returns {import('nodemailer').SendMailOptions}
 */
function defaultCreatePasswordResetEmail({ token, requestUrl }) {
  const parsed = new URL(requestUrl);
  const { hostname } = parsed;
  const resetLink = new URL(`/reset/${token}`, parsed);
  return {
    from: `noreply@${hostname}`,
    subject: 'üWave Password Reset Request',
    text: `
      Hello,

      To reset your password, please visit:
      ${resetLink}
    `,
  };
}

/**
 * @typedef {express.Router & { authRegistry: AuthRegistry }} HttpApi
 */

/**
 * @typedef {object} HttpApiOptions - Static options for the HTTP API.
 * @prop {string|Buffer} secret
 * @prop {boolean} [helmet]
 * @prop {(error: Error) => void} [onError]
 * @prop {{ secret: string }} [recaptcha]
 * @prop {import('nodemailer').Transport} [mailTransport]
 * @prop {(options: { token: string, requestUrl: string }) =>
 *   import('nodemailer').SendMailOptions} [createPasswordResetEmail]
 *
 * @typedef {object} HttpApiSettings - Runtime options for the HTTP API.
 * @prop {string[]} allowedOrigins
 */

/**
 * @param {import('./Uwave.mjs').default} uw
 * @param {HttpApiOptions} options
 */
async function httpApi(uw, options) {
  if (!options.secret) {
    throw new TypeError('"options.secret" is empty. This option is used to sign authentication '
      + 'keys, and is required for security reasons.');
  }

  if (options.onError != null && typeof options.onError !== 'function') {
    throw new TypeError('"options.onError" must be a function.');
  }

  uw.config.register(optionsSchema['uw:key'], optionsSchema);

  /** @type {HttpApiSettings} */
  // @ts-expect-error TS2322: get() always returns a validated object here
  let runtimeOptions = await uw.config.get(optionsSchema['uw:key']);
  uw.config.on('set', (key, value) => {
    if (key === 'u-wave:api') {
      runtimeOptions = value;
    }
  });

  debug('setup', runtimeOptions);
  uw.httpApi = Object.assign(express.Router(), {
    authRegistry: new AuthRegistry(uw.redis),
  });

  uw.httpApi
    .use(bodyParser.json())
    .use(cookieParser())
    .use(uw.passport.initialize())
    .use(addFullUrl())
    .use(attachUwaveMeta(uw.httpApi, uw))
    .use(uw.passport.authenticate('jwt'))
    .use(rateLimit('api-http', { max: 500, duration: 60 * 1000 }));

  uw.httpApi
    .use('/auth', authenticate(uw.passport, {
      secret: options.secret,
      mailTransport: options.mailTransport,
      recaptcha: options.recaptcha,
      createPasswordResetEmail:
        options.createPasswordResetEmail || defaultCreatePasswordResetEmail,
    }))
    .use('/bans', bans())
    .use('/import', imports())
    .use('/now', now())
    .use('/search', search())
    .use('/server', server())
    .use('/users', users());

  uw.express = express();
  uw.server = http.createServer(uw.express);
  if (options.helmet !== false) {
    uw.express.use(helmet({
      referrerPolicy: {
        policy: ['origin-when-cross-origin'],
      },
    }));
  }

  /** @type {import('cors').CorsOptions} */
  const corsOptions = {
    origin(origin, callback) {
      callback(null, matchOrigin(origin, runtimeOptions.allowedOrigins));
    },
  };
  // @ts-expect-error TS2769: Not sure why the overload doesn't match, but it should :)
  uw.express.options('/api/*', cors(corsOptions));
  uw.express.use('/api', cors(corsOptions), uw.httpApi);
  // An older name
  uw.express.use('/v1', cors(corsOptions), uw.httpApi);
}

/**
 * @param {import('./Uwave.mjs').default} uw
 */
async function errorHandling(uw) {
  debug('after');
  uw.httpApi.use(errorHandler());
  uw.express.use(/** @type {import('express').ErrorRequestHandler} */ (error, req, res, next) => {
    debug(error);
    next(error);
  });
}

httpApi.errorHandling = errorHandling;

export default httpApi;
