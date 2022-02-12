import toItemResponse from '../utils/toItemResponse.mjs';

/**
 * @type {import('../types').Controller<{}, {}, {}>}
 */
export async function getMotd(req) {
  const { motd } = req.uwave;

  const value = await motd.get();

  return toItemResponse(
    { motd: value },
    { url: req.fullUrl },
  );
}

/**
 * @type {import('../types').AuthenticatedController<{}, {}, { motd: string | null }>}
 */
export async function setMotd(req) {
  const { motd } = req.uwave;
  const { motd: newValue } = req.body;

  await motd.set(newValue);

  return getMotd(req);
}
