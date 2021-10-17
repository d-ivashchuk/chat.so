import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import Pusher from "pusher";

export default async function handle(req, res) {
  try {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    console.log({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

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
