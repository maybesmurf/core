import aclRoleSchema from './AclRole.mjs';
import authenticationSchema from './Authentication.mjs';
import configSchema from './Config.mjs';
import historySchema from './History.mjs';
import mediaSchema from './Media.mjs';
import migrationSchema from './Migration.mjs';
import playlistSchema from './Playlist.mjs';
import playlistItemSchema from './PlaylistItem.mjs';
import userSchema from './User.mjs';

/**
 * @typedef {import('./AclRole').AclRole} AclRole
 * @typedef {import('./Authentication').Authentication} Authentication
 * @typedef {import('./Config').Config} Config
 * @typedef {import('./History').HistoryEntry} HistoryEntry
 * @typedef {import('./Media').Media} Media
 * @typedef {import('./Migration').Migration} Migration
 * @typedef {import('./Playlist').Playlist} Playlist
 * @typedef {import('./PlaylistItem').PlaylistItem} PlaylistItem
 * @typedef {import('./User').User} User
 * @typedef {{
 *  AclRole: import('mongoose').Model<AclRole, {}, {}>,
 *  Authentication: import('mongoose').Model<Authentication, {}, {}>,
 *  Config: import('mongoose').Model<Config, {}, {}>,
 *  HistoryEntry: import('mongoose').Model<HistoryEntry, {}, {}>,
 *  Media: import('mongoose').Model<Media, {}, {}>,
 *  Migration: import('mongoose').Model<Migration, {}, {}>,
 *  Playlist: import('mongoose').Model<Playlist, {}, {}>,
 *  PlaylistItem: import('mongoose').Model<PlaylistItem, {}, {}>,
 *  User: import('mongoose').Model<User, {}, {}>,
 * }} Models
 */

/**
 * @param {import('../Uwave')} uw
 */
async function models(uw) {
  uw.models = {
    AclRole: uw.mongo.model('AclRole', aclRoleSchema),
    Authentication: uw.mongo.model('Authentication', authenticationSchema),
    Config: uw.mongo.model('Config', configSchema),
    HistoryEntry: uw.mongo.model('History', historySchema),
    Media: uw.mongo.model('Media', mediaSchema),
    Migration: uw.mongo.model('Migration', migrationSchema),
    Playlist: uw.mongo.model('Playlist', playlistSchema),
    PlaylistItem: uw.mongo.model('PlaylistItem', playlistItemSchema),
    User: uw.mongo.model('User', userSchema),
  };
}

export default models;
