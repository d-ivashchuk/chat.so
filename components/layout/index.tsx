import { Box, HStack, Text } from "@chakra-ui/layout";
import React from "react";
import { css, Global } from "@emotion/react";
import { useColorMode } from "@chakra-ui/color-mode";
import theme from "@chakra-ui/theme";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { Chat } from ".prisma/client";
import toast from "react-hot-toast";
import { Icon } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { CheckIcon } from "@chakra-ui/icons";
import Link from "next/link";
export const Layout = ({ children }) => {
  const channel = useChannel("chat.so");
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();

  useEvent(channel, "create-chat", ({ chat }: { chat: Chat }) => {
    toast.custom(
      <Box
        backgroundColor="white"
        px={3}
        py={4}
        boxShadow="0 3px 10px rgb(0 0 0 / 10%), 0 3px 3px rgb(0 0 0 / 5%)"
        borderRadius={4}
      >
        <HStack>
          <Icon as={CheckIcon} w={4} h={4} color="green.400" />
          <Text>
            New chat created.
            <Box
              sx={{
                a: {
                  color: "blue.400",
                },
              }}
            >
              <Link href={"chat/[id]"} as={`chat/${chat.id}`}>
                {chat.name}
              </Link>
            </Box>
          </Text>
        </HStack>
      </Box>,
      { duration: 4000 }
    );
    queryClient.refetchQueries("chats");
  });

  return (
    <Box height="85h" maxW="7xl" mx="auto" px={{ base: "4", md: "8" }}>
      {children}
      <Global
        styles={css`
          body {
            background: ${colorMode === "light" ? theme.colors.gray[50] : ""};
          }
        `}
      />
    </Box>
  );
};
