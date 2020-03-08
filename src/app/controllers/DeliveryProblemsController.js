import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';

// import RegisteredOrderMail from '../jobs/RegisteredOrderMail';
// import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async index(req, res) {
    const deliveriesProblems = await DeliveryProblems.findAll({
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product', 'start_date', 'canceled_at'],
        },
      ],
    });

    return res.json(deliveriesProblems);
  }

  async show(req, res) {
    // Listar os Problemas da Encomenda informada
    const order_id = req.params.id;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    const deliveryProblems = await DeliveryProblems.findAll({
      where: { order_id },
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product', 'start_date', 'canceled_at'],
        },
      ],
    });

    if (!deliveryProblems) {
      return res.status(400).json({ error: 'Entrega não tem Problemas' });
    }

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const order_id = req.params.id;
    const { description } = req.body;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    const deliveryProblems = await DeliveryProblems.create({
      description,
      order_id: order.id,
    });

    return res.json(deliveryProblems);
  }

  async update(req, res) {
    const { id } = req.params;

    const deliveryProblems = await DeliveryProblems.findByPk(id);

    if (!deliveryProblems) {
      return res
        .status(400)
        .json({ error: 'Entrega não tem problemas para ser cancelada' });
    }

    const order = await Order.findByPk(deliveryProblems.order_id);

    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    const orderUpdate = await order.update({
      canceled_at: new Date(),
    });

    // Enviar email
    // await Queue.add(RegisteredOrderMail.key, {
    //  order,
    // });

    return res.json(orderUpdate);
  }
}

export default new DeliveryProblemsController();
