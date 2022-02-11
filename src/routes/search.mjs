import { Router } from 'express';
import route from '../route.mjs';
import protect from '../middleware/protect.mjs';
import schema from '../middleware/schema.mjs';
import * as controller from '../controllers/search.mjs';
import * as validations from '../validations.mjs';

function searchRoutes() {
  return Router()
    .use(protect())
    // GET /search/ - Search for media across all sources.
    .get(
      '/',
      schema(validations.searchAll),
      route(controller.searchAll),
    )
    // GET /search/:source - Search for media in a single source.
    .get(
      '/:source',
      schema(validations.search),
      route(controller.search),
    );
}

export default searchRoutes;
