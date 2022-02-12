import { Router } from 'express';
import route from '../route.mjs';
import * as validations from '../validations.mjs';
import protect from '../middleware/protect.mjs';
import schema from '../middleware/schema.mjs';
import * as controller from '../controllers/acl.mjs';

function aclRoutes() {
  return Router()
    // GET /roles - List available roles.
    .get(
      '/',
      route(controller.list),
    )
    // PUT /roles/:name - Create a new role.
    .put(
      '/:name',
      protect('acl.create'),
      schema(validations.createAclRole),
      route(controller.createRole),
    )
    // DELETE /roles/:name - Delete a new role.
    .delete(
      '/:name',
      protect('acl.delete'),
      schema(validations.deleteAclRole),
      route(controller.deleteRole),
    );
}

export default aclRoutes;
