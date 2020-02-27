import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    // Busca Destinatários
    const recipients = await Recipient.findAll();

    // Verifica se trouxe destinatários
    if (recipients.length === 0)
      return res.status(401).json({ error: 'Nenhum Destinatário Encontrado' });

    return res.json(recipients);
  }

  async store(req, res) {
    // Schema de Validação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string()
        .min(2)
        .max(2)
        .required(),
      city: Yup.string().required(),
      zip_code: Yup.string()
        .min(8)
        .max(8)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validação Falhou' });
    }

    const { name, street, number, zip_code } = req.body;

    const recipientExist = await Recipient.findOne({
      where: {
        name,
        street,
        number,
        zip_code,
      },
    });

    // Verifica se já existe
    if (recipientExist) {
      return res.json({ error: 'Destinatário já existe' });
    }

    // Inseri no Banco de Dados
    const { id, complement, state, city } = await Recipient.create(req.body);

    // Retornar dados
    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async update(req, res) {
    // Schema de Validação
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string()
        .min(2)
        .max(2)
        .required(),
      city: Yup.string().required(),
      zip_code: Yup.string()
        .min(8)
        .max(8)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validação Falhou' });
    }

    // Captura os parâmetros da Requisição
    const { id } = req.params;

    // Busca registro pelo ID
    const recipient = await Recipient.findByPk(id);

    // Verifica se registro existe
    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não existe' });
    }

    const { name, street, number, zip_code } = req.body;

    // Verifica se os dados não igualam com outro registro
    const recipientExist = await Recipient.findOne({
      where: {
        name,
        street,
        number,
        zip_code,
        id: { [Op.ne]: id },
      },
    });

    // Verifica se já existe
    if (recipientExist) {
      return res.json({ error: 'Outro Destinatário com os mesmo dados' });
    }

    // Atualiza
    const { complement, state, city } = await recipient.update(req.body);

    // Retorna
    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
