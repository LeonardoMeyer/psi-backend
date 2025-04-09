const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createCheckoutSession = async (req, res) => {
  const { userId, appointmentId, method } = req.body;
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) return res.status(404).json({ error: "Consulta não encontrada" });

    const priceInCents = 12000; // R$120,00

    const session = await stripe.checkout.sessions.create({
      payment_method_types: method === "pix" ? ["pix"] : ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Sessão de Psicologia",
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/erro`,
      metadata: { userId, appointmentId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento" });
  }
};

exports.confirmPixPayment = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      await prisma.appointment.update({
        where: { id: session.metadata.appointmentId },
        data: { paid: true },
      });
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Pagamento não confirmado ainda" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao confirmar pagamento Pix" });
  }
};
