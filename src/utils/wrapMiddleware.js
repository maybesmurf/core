/**
 * Wrap `async` middleware into an express style callback.
 *
 * @param {(
 *   req: import('../types').Request,
 *   res: import('express').Response
 * ) => Promise<void>} middleware
 * @returns {import('express').RequestHandler}
 */
function wrapMiddleware(middleware) {
  return (rawReq, res, next) => {
    /** @type {import('../types').Request} */
    const req = /** @type {any} */ (rawReq);

    middleware(req, res)
      .then(() => next(), next);
  };
}

export default wrapMiddleware;
