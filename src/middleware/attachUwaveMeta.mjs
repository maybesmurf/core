/**
 * Make the Uwave server and the HTTP API class available on request objects.
 * @param {import('../HttpApi.mjs').HttpApi} httpApi
 * @param {import('../Uwave.mjs').default} uw
 * @returns {import('express').RequestHandler}
 */
function attachUwaveMeta(httpApi, uw) {
  return (req, res, next) => {
    if (!req.uwave) {
      req.uwaveHttp = httpApi;
      req.uwave = uw;
    }
    next();
  };
}

export default attachUwaveMeta;
