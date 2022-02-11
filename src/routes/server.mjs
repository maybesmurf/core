import { Router } from 'express';
import route from '../route.mjs';
import protect from '../middleware/protect.mjs';
import * as controller from '../controllers/server.mjs';

function serverRoutes() {
  return Router()
    // GET /server/time - Show the current server time.
    .get(
      '/time',
      route(controller.getServerTime),
    )
    // GET /server/config
    .get(
      '/config',
      protect('admin'),
      route(controller.getAllConfig),
    )
    // GET /server/config/:key
    .get(
      '/config/:key',
      protect('admin'),
      route(controller.getConfig),
    )
    // PUT /server/config/:key
    .put(
      '/config/:key',
      protect('admin'),
      route(controller.updateConfig),
    );
}

export default serverRoutes;
