import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class OrderWithdrawalController {
  async update(req, res) {
    // Iniciar a Entrega (Atualizar start_date) - Retirar Produto

    const deliveryman_id = req.params.id;

    // Busca Entregador por ID
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    // Verifica se Entregador existe
    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    const { order_id } = req.body;

    const order = await Order.findByPk(order_id);

    // Valida se existe Encomenda
    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    // Verifica se Encomenda já foi retirada
    if (order.start_date) {
      return res.status(400).json({ error: 'Encomenda já foi retirada' });
    }

    // Data Atual
    const currentDate = new Date();

    // Monta horário de retirada entre 08:00 e 18:00
    const schedule = [
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
    ];

    // Verifica se horário atual pode retirar a encomenda
    const validateHour = schedule.includes(currentDate.getHours().toString());

    if (!validateHour) {
      return res
        .status(400)
        .json({ error: 'Encomenda só pode ser retirada entre 08:00 e 18:00' });
    }

    // Verifica se já retirou 5 entregas no dia atual
    const countOrdersDay = await Order.count({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
        },
      },
    });

    if (countOrdersDay >= 5) {
      return res
        .status(400)
        .json({ error: 'Limite de 5 entregas no dia atingidas' });
    }

    // Atualizar data de retirada
    const orderStart = await order.update({
      start_date: currentDate,
    });

    return res.json(orderStart);
  }
}

export default new OrderWithdrawalController();
