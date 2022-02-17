/**
 * @param {import('../models/index.mjs').Playlist | import('../models/Playlist.mjs').LeanPlaylist} model
 */
function serializePlaylist(model) {
  return {
    _id: 'id' in model ? model.id : model._id.toString(),
    name: model.name,
    author: model.author.toString(),
    createdAt: model.createdAt.toISOString(),
    description: model.description,
    size: model.media.length,
  };
}

/**
 * @param {Pick<import('../models/index.mjs').User,
 *   '_id' | 'username' | 'slug' | 'roles' | 'avatar' |
 *   'createdAt' | 'updatedAt' | 'lastSeenAt'>} model
 */
function serializeUser(model) {
  return {
    _id: model._id.toString(),
    username: model.username,
    slug: model.slug,
    roles: model.roles,
    avatar: model.avatar,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
    lastSeenAt: model.lastSeenAt.toISOString(),
  };
}

export {
  serializePlaylist,
  serializeUser,
};
