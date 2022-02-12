import { Router } from 'express';
import route from '../route.mjs';
import * as validations from '../validations.mjs';
import protect from '../middleware/protect.mjs';
import schema from '../middleware/schema.mjs';
import * as controller from '../controllers/motd.mjs';

function motdRoutes() {
  return Router()
    // GET /motd/ - Get the message of the day.
    .get(
      '/',
      route(controller.getMotd),
    )
    // PUT /motd/ - Set the message of the day.
    .put(
      '/',
      protect('motd.set'),
      schema(validations.setMotd),
      route(controller.setMotd),
    );
}

export default motdRoutes;
