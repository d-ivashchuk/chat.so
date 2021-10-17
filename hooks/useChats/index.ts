import { Chat } from ".prisma/client";
import axios from "axios";

import { useAppUrl } from "hooks/useAppUrl";

import { useQuery } from "react-query";

const fetchChats = async (appUrl: string): Promise<ReadonlyArray<Chat>> => {
  const response = await axios.get(`${appUrl}/api/chats`);

  return response.data.chats;
};

const useChats = () => {
  const appUrl = useAppUrl();
  return useQuery(["chats"], () => fetchChats(appUrl), {
    refetchOnWindowFocus: true,
  });
};

export { useChats };
