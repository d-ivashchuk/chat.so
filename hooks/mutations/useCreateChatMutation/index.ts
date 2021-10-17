import { Prisma } from "@prisma/client";
import { useAppUrl } from "hooks/useAppUrl";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Chat } from ".prisma/client";

const useCreateChatMutation = () => {
  const appUrl = useAppUrl();
  const queryClient = useQueryClient();

  return useMutation(
    async (variables: Prisma.ChatCreateInput): Promise<Chat> => {
      const response = await axios.post(
        `${appUrl}/api/chat/create?name=${variables.name}&userIp=${variables.userIp}`
      );

      return response.data.chat;
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(["chats"]);
      },
      onError: (error) => {
        if (error) {
          toast.error("Something went wrong");
        } else {
        }
      },
    }
  );
};

export { useCreateChatMutation };
