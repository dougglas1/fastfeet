import Mail from '../../lib/Mail';

class RegisteredOrderMail {
  get key() {
    return 'RegisteredOrderMail';
  }

  async hnadle({ data }) {
    const { orderConsulta } = data;

    await Mail.sendMail({
      to: `${orderConsulta.deliveryman.name} <${orderConsulta.deliveryman.email}>`,
      subject: 'Entrega em Espera para Retirada',
      template: 'registeredOrder',
      context: {
        deliveryman: orderConsulta.deliveryman.name,
        product: orderConsulta.product,
        recipient_name: orderConsulta.recipient.name,
        recipient_street: orderConsulta.recipient.street,
        recipient_number: orderConsulta.recipient.number,
        recipient_complement: orderConsulta.recipient.complement,
        recipient_state: orderConsulta.recipient.state,
        recipient_city: orderConsulta.recipient.city,
        recipient_zip_code: orderConsulta.recipient.zip_code,
      },
    });
  }
}

export default new RegisteredOrderMail();
