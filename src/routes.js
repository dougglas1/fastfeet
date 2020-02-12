import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middleware/auth';
import permissionMiddleware from './app/middleware/permission';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Só vale para as próximas rotas
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Permissão
routes.use(permissionMiddleware);

// Recipients
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

export default routes;
