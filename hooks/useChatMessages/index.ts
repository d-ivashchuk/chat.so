import { Chat, Message } from ".prisma/client";
import axios from "axios";

import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchMessages = async (
  appUrl: string,
  chatId: Chat["id"]
): Promise<ReadonlyArray<Message>> => {
  const response = await axios.get(`${appUrl}/api/chat-messages/${chatId}`);

  return response.data.messagesByChat;
};

const useChatMessages = ({ chatId }: { chatId: Chat["id"] }) => {
  const appUrl = useAppUrl();

  return useQuery(
    ["chatMessages", chatId],
    () => fetchMessages(appUrl, chatId),
    {
      refetchOnWindowFocus: true,
    }
  );
};

export { useChatMessages };
