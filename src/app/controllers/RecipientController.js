import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    // Inseri no Banco de Dados
    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

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
    // Captura os parâmetros da Requisição
    const { id } = req.params;

    // Busca registro pelo ID
    const recipient = await Recipient.findByPk(id);

    // Verifica se registro existe
    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não existe' });
    }

    // Atualiza
    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.update(req.body);

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
