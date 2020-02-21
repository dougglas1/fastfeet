import { Op } from 'sequelize';
import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    // Busca Entregador
    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name'],
        },
      ],
    });

    // Verifica se trouxe entregador
    if (deliverymans.length === 0)
      return res.status(401).json({ error: 'Nenhum Entregador Encontrado' });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    // Validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação Falhou' });
    }

    // Busca Entregador por Email
    const deliverymanExists = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    // Verifica se Entregador já está cadastrado
    if (deliverymanExists) {
      return res.status(400).json({ error: 'Entregador já cadastrado' });
    }

    // Inserir
    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    // Validação
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação Falhou' });
    }

    // Busca Entregador por ID
    const deliverymanExists = await Deliveryman.findOne({
      where: {
        id: req.body.id,
      },
    });

    // Verifica se Entregador existe
    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    // Verifica se o Email não existe em outro Entregador
    const deliverymansExistsEmail = await Deliveryman.findOne({
      where: {
        email: req.body.email,
        id: { [Op.ne]: req.body.id },
      },
    });

    // Verifica se email já está cadastrado
    if (deliverymansExistsEmail) {
      return res
        .status(400)
        .json({ error: 'Outro Entregador com o mesmo email informado' });
    }

    // Atualizar
    const { id, name, email } = await deliverymanExists.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    // Busca Entregador por ID
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    // Verifica se Entregador existe
    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não cadastrado' });
    }

    // Remover
    await deliveryman.destroy();

    return res.json({ success: 'Entregador Removido com Sucesso' });
  }
}

export default new DeliverymanController();
