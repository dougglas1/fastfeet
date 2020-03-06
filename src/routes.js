import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DevliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliverymanOrderController from './app/controllers/DeliverymanOrderController';
import OrderStartController from './app/controllers/OrderStartController';
import OrderEndController from './app/controllers/OrderEndController';

import authMiddleware from './app/middleware/auth';
import permissionMiddleware from './app/middleware/permission';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Só vale para as próximas rotas
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Permissão
routes.use(permissionMiddleware);

// Recipients
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

// Devliverymans
routes.get('/deliverymans', DevliverymanController.index);
routes.post('/deliverymans', DevliverymanController.store);
routes.put('/deliverymans/:id', DevliverymanController.update);
routes.delete('/deliverymans/:id', DevliverymanController.delete);
routes.get('/deliverymans/:id/orders', DeliverymanOrderController.index);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// Orders
routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.put(
  '/deliveryman/:deliveryman_id/order/:order_id/start',
  OrderStartController.update
);
routes.put(
  '/deliveryman/:deliveryman_id/order/:order_id/end',
  OrderEndController.update
);

export default routes;
