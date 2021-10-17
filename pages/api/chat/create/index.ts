import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import { config } from "pusher-config";
import Pusher from "pusher";

export default async function handle(req, res) {
  try {
    const pusher = new Pusher(config);
    const { name, userIp } = req.query as Prisma.ChatCreateInput;

    const chat = await prisma.chat.create({
      data: {
        name,
        userIp,
      },
    });

    pusher.trigger("chat.so", "create-chat", {
      chat,
    });

    res.json({ chat });
  } catch (error) {
    console.log("Error creating chat", error);
    res.status(500);
  }
}
