import { Router } from 'express';
import route from '../route.mjs';
import * as controller from '../controllers/now.mjs';

function nowRoute() {
  return Router()
    // GET /now/ - Get a combined view of the current state.
    .get(
      '/',
      route(controller.getState),
    );
}

export default nowRoute;
