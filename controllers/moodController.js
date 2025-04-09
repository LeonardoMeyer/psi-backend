const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.registerMood = async (req, res) => {
  const { userId, moodEmoji, moodText } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existing = await prisma.mood.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (existing) return res.status(400).json({ error: "Humor de hoje já registrado." });

    const entry = await prisma.mood.create({
      data: {
        userId,
        moodEmoji,
        moodText,
        date: today,
      },
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar humor." });
  }
};

exports.getUserMoods = async (req, res) => {
  const { userId } = req.params;
  try {
    const moods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar humores." });
  }
};
