import { Prisma } from "@prisma/client";
import { useAppUrl } from "hooks/useAppUrl";
import { useMutation } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Message } from ".prisma/client";

const useSendMessageMutation = () => {
  const appUrl = useAppUrl();
  return useMutation(
    async (variables: Prisma.MessageCreateInput): Promise<Message> => {
      const response = await axios.post(`${appUrl}/api/message/send`, {
        text: variables.text,
        userIp: variables.userIp,
        chat: variables.chat,
      });

      return response.data.message;
    },
    {
      onError: (error) => {
        if (error) {
          toast.error("Something went wrong");
        }
      },
    }
  );
};

export { useSendMessageMutation };
