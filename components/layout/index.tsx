import { Box } from "@chakra-ui/layout";
import React from "react";
import { css, Global } from "@emotion/react";
import { useColorMode } from "@chakra-ui/color-mode";
import theme from "@chakra-ui/theme";

export const Layout = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <Box height="90vh" maxW="7xl" mx="auto" px={{ base: "4", md: "8" }}>
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
