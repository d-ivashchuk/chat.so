import prisma from "lib/prisma";

export default async function handle(_, res) {
  try {
    const chats = await prisma.chat.findMany();

    res.json({ chats });
  } catch (error) {
    console.log(error);
  }
}
