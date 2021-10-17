import prisma from "lib/prisma";

export default async function handle(req, res) {
  const chats = await prisma.chat.findMany();

  res.json({ chats });
}
