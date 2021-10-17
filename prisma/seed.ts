import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const chatData: Prisma.ChatCreateInput[] = [
  {
    name: "Great chat",
    userIp: "62.216.56.158",
    messages: {
      create: [
        {
          text: "Hey there",
          userIp: "62.216.56.158",
        },
        {
          text: "This is a live chat",
          userIp: "62.216.56.158",
        },
        {
          text: "Try it out",
          userIp: "62.216.56.158",
        },
        {
          text: "Random strangers could join and chat with you here :D ",
          userIp: "62.216.56.158",
        },
      ],
    },
  },
  {
    name: "Another awesome chat",
    userIp: "62.216.56.158",
    messages: {
      create: [
        {
          text: "Woot",
          userIp: "62.216.56.158",
        },
        {
          text: "We are live!!!",
          userIp: "62.216.56.158",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const chat of chatData) {
    const createdChat = await prisma.chat.create({
      data: chat,
    });
    console.log(`Created chat with id: ${createdChat.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
