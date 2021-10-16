import * as React from "react";
import { Stack } from "@chakra-ui/react";
import Image from "next/image";
import { Text } from "@chakra-ui/react";

export const Logo = ({ onClick }: { onClick: () => void }) => {
  return (
    <Stack isInline alignItems="center" onClick={onClick}>
      <>
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <Text fontWeight={500} fontSize={25}>
          Chat.so
        </Text>
      </>
    </Stack>
  );
};
