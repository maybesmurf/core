import { Router } from 'express';
import route from '../route.mjs';
import * as validations from '../validations.mjs';
import protect from '../middleware/protect.mjs';
import schema from '../middleware/schema.mjs';
import * as controller from '../controllers/chat.mjs';

function chatRoutes() {
  return Router()
    // DELETE /chat/ - Clear the chat (delete all messages).
    .delete(
      '/',
      protect('chat.delete'),
      route(controller.deleteAll),
    )
    // DELETE /chat/user/:id - Delete all messages by a user.
    .delete(
      '/user/:id',
      protect('chat.delete'),
      schema(validations.deleteChatByUser),
      route(controller.deleteByUser),
    )
    // DELETE /chat/:id - Delete a chat message.
    .delete(
      '/:id',
      protect('chat.delete'),
      schema(validations.deleteChatMessage),
      route(controller.deleteMessage),
    );
}

export default chatRoutes;
