import { createRequire } from 'module';
import { Passport } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { callbackify } from 'util';
import createDebug from 'debug';
import JWTStrategy from '../auth/JWTStrategy.mjs';

const require = createRequire(import.meta.url);
const schema = require('../schemas/socialAuth.json');

const debug = createDebug('uwave:passport');

/**
 * @typedef {import('../models/User.mjs').User} User
 *
 * @typedef {{
 *   callbackURL?: string,
 * } & ({
 *   enabled: false,
 * } | {
 *   enabled: true,
 *   clientID: string,
 *   clientSecret: string,
 * })} GoogleOptions
 *
 * @typedef {object} SocialAuthSettings
 * @prop {GoogleOptions} google
 */

class PassportPlugin extends Passport {
  #uw;

  /**
   * @param {import('../Uwave.mjs').default} uw
   * @param {{ secret: Buffer|string }} options
   */
  constructor(uw, options) {
    super();

    this.#uw = uw;

    /**
     * @param {Express.User} user
     * @returns {Promise<string>}
     */
    function serializeUser(user) {
      /** @type {string} */
      // @ts-expect-error `user` is actually an instance of the User model
      // but we can't express that
      const userID = user.id;
      return Promise.resolve(userID);
    }
    /**
     * @param {string} id
     * @returns {Promise<User|null>}
     */
    function deserializeUser(id) {
      return uw.users.getUser(id);
    }

    this.serializeUser(callbackify(serializeUser));
    this.deserializeUser(callbackify(deserializeUser));

    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<User>}
     */
    function localLogin(email, password) {
      return uw.users.login({ type: 'local', email, password });
    }

    this.use('local', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    }, callbackify(localLogin)));
    this.use('jwt', new JWTStrategy(options.secret, (user) => uw.users.getUser(user.id)));

    uw.config.register(schema['uw:key'], schema);
    uw.config.on('set', (key, settings) => {
      if (key === schema['uw:key']) {
        this.applyAuthStrategies(settings);
      }
    });
  }

  /**
   * Must be called once on boot.
   */
  async loadRuntimeConfiguration() {
    /** @type {SocialAuthSettings} */
    // @ts-expect-error TS2322 `get()` returns a validated object with default values populated
    const settings = await this.#uw.config.get(schema['uw:key']);
    try {
      this.applyAuthStrategies(settings);
    } catch (error) {
      // The schema doesn't _quite_ protect against all possible misconfiguration
      debug('applying social auth settings failed', error);
    }
  }

  /**
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {import('passport').Profile} profile
   * @returns {Promise<User>}
   * @private
   */
  socialLogin(accessToken, refreshToken, profile) {
    return this.#uw.users.login({
      type: profile.provider,
      profile,
    });
  }

  /**
   * @param {string} strategy
   * @returns {boolean}
   */
  supports(strategy) {
    // @ts-expect-error TS2339: _strategy is not in the typings for passport but it does exist
    // eslint-disable-next-line no-underscore-dangle
    return this._strategy(strategy) !== undefined;
  }

  /**
   * @returns {string[]}
   */
  strategies() {
    // @ts-expect-error TS2339: _strategies is not in the typings for passport but it does exist
    // eslint-disable-next-line no-underscore-dangle
    return Object.keys(this._strategies)
      .filter((strategy) => strategy !== 'session' && strategy !== 'jwt');
  }

  /**
   * @param {SocialAuthSettings} settings
   * @private
   */
  applyAuthStrategies(settings) {
    debug('reapplying settings');
    this.unuse('google');

    if (settings && settings.google && settings.google.enabled) {
      debug('enable google');
      this.use('google', new GoogleStrategy({
        callbackURL: '/auth/service/google/callback',
        ...settings.google,
        scope: ['profile'],
      }, callbackify(this.socialLogin.bind(this))));
    }
  }
}

/**
 * @param {import('../Uwave.mjs').default} uw
 * @param {{ secret: Buffer|string }} options
 */
async function passportPlugin(uw, options) {
  debug('setup');
  uw.passport = new PassportPlugin(uw, options);
  await uw.passport.loadRuntimeConfiguration();
}

export default passportPlugin;
export { PassportPlugin as Passport };
