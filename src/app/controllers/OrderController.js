import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import RegisteredOrderMail from '../jobs/RegisteredOrderMail';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    // Validação
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    // Valida se Recipient existe
    if (!(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: 'Destinatário não cadastro' });
    }

    // Valida se Deliveryman existe
    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    const order = await Order.create(req.body);

    const orderConsulta = await Order.findOne({
      where: { id: order.id },
      include: [
        {
          model: Recipient,
          as: 'recipient',
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
        },
      ],
    });

    // Enviar email
    await Queue.add(RegisteredOrderMail.key, {
      orderConsulta,
    });

    return res.json(orderConsulta);
  }

  async update(req, res) {
    // Validação
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { id } = req.params;

    const order = await Order.findByPk(id);
    // Valida se existe Encomenda
    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    // Valida se Recipient existe
    if (!(await Recipient.findByPk(recipient_id))) {
      return res.status(400).json({ error: 'Destinatário não cadastro' });
    }

    // Valida se Deliveryman existe
    if (!(await Deliveryman.findByPk(deliveryman_id))) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    // Busca Encomenda por ID
    const order = await Order.findByPk(req.params.id);

    // Verifica se Encomenda existe
    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    await order.destroy();

    return res.json({ success: 'Encomenda removida com Sucesso' });
  }
}

export default new OrderController();
