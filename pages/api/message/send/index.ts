import { Chat } from ".prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import Pusher from "pusher";
import { config } from "pusher-config";

export default async function handle(req, res) {
  try {
    const pusher = new Pusher(config);
    const { text, userIp, chat } = req.body as Prisma.MessageCreateInput;

    const message = await prisma.message.create({
      data: {
        text,
        userIp,
        chat,
      },
    });

    pusher.trigger("chat.so", "send-message", {
      message,
    });

    res.json({ message });
  } catch (error) {
    console.log("Error creating chat", error);
    res.status(500);
  }
}
