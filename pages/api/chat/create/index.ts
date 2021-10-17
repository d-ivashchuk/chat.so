import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";

export default async function handle(req, res) {
  try {
    const { name, userIp } = req.query as Prisma.ChatCreateInput;

    const chat = await prisma.chat.create({
      data: {
        name,
        userIp,
      },
    });

    res.json({ chat });
  } catch (error) {
    console.log("Error creating chat", error);
    res.status(500);
  }
}
