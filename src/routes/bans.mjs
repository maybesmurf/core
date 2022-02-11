import { Router } from 'express';
import route from '../route.mjs';
import protect from '../middleware/protect.mjs';
import * as controller from '../controllers/bans.mjs';

function banRoutes() {
  return Router()
    .get(
      '/',
      protect('users.bans.list'),
      route(controller.getBans),
    )

    .post(
      '/',
      protect('users.bans.add'),
      route(controller.addBan),
    )

    .delete(
      '/:userID',
      protect('users.bans.remove'),
      route(controller.removeBan),
    );
}

export default banRoutes;
