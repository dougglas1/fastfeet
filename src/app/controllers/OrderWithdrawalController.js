class OrderWithdrawalController {
  async update(req, res) {
    // Iniciar a Entrega (Atualizar start_date)
    // Somente pode iniciar 5 entregas por dia
    // Somente permitir retirar entre 08:00 e 18:00

    return res.json();
  }
}

export default new OrderWithdrawalController();
