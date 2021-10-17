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
