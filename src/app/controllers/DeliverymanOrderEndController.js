import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliverymanOrderEndController {
  async index(req, res) {
    // Consultar Encomendas do Entregador
    // que estão finalizados

    const deliveryman_id = req.params.id;

    // Busca Entregador por ID
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    // Verifica se Entregador existe
    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    const OrdersDeliveryman = await Order.findAll({
      where: {
        deliveryman_id,
        canceled_at: { [Op.eq]: null },
        start_date: { [Op.ne]: null },
        end_date: { [Op.ne]: null },
      },
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
    });

    return res.json(OrdersDeliveryman);
  }
}

export default new DeliverymanOrderEndController();
