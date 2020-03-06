import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class OrderEndController {
  async update(req, res) {
    // Finalizar a Entrega (Atualizar end_date)
    const { deliveryman_id, order_id } = req.params;
    const { signature_id = null } = req.body;

    // Busca Entregador por ID
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    // Verifica se Entregador existe
    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    const order = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
      },
    });

    // Valida se existe Encomenda
    if (!order) {
      return res.status(400).json({ error: 'Encomenda não cadastrada' });
    }

    // Verifica se a Encomenda foi Retirada
    if (order.start_date === null) {
      return res.status(400).json({ error: 'Encomenda não foi retirada' });
    }

    // Valida se Imagem foi enviada (opcional)
    const schema = Yup.object().shape({
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Imagem no Formato Inválido' });
    }

    const orderUpdate = await order.update({
      end_date: new Date(),
      signature_id,
    });

    return res.json(orderUpdate);
  }
}

export default new OrderEndController();
