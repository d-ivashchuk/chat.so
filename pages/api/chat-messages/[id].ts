import { Chat } from ".prisma/client";
import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { id } = req.query as Chat;

  const messagesByChat = await prisma.message.findMany({
    where: {
      chatId: id,
    },
  });

  res.json({ messagesByChat });
}
