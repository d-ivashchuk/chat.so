import { Chat } from ".prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";

export default async function handle(req, res) {
  try {
    const { text, userIp, chat } = req.body as Prisma.MessageCreateInput;

    const message = await prisma.message.create({
      data: {
        text,
        userIp,
        chat,
      },
    });

    res.json({ message });
  } catch (error) {
    console.log("Error creating chat", error);
    res.status(500);
  }
}
