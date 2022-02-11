import { Router } from 'express';
import route from '../route.mjs';
import protect from '../middleware/protect.mjs';
import * as controller from '../controllers/import.mjs';

function importRoutes() {
  return Router()
    // * /import/:source/:action - Call an import source.
    .all(
      '/:source/:action',
      protect(),
      route(controller.importAction),
    )
    // * /import/:source - Call an import source.
    .all(
      '/:source',
      protect(),
      route(controller.importAction),
    );
}

export default importRoutes;
