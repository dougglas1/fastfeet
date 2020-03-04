import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliverymanOrderController {
  async index(req, res) {
    // Consultar Encomendas do Entregador
    // que não estão entregues ou canceladas

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
      },
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
    });

    return res.json(OrdersDeliveryman);
  }
}

export default new DeliverymanOrderController();
