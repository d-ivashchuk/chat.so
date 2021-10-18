import React from "react";
import NextNprogress from "nextjs-progressbar";
import type { AppProps } from "next/app";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { Toaster } from "react-hot-toast";
import { PusherProvider } from "@harelpls/use-pusher";

import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  const pusherConfig = {
    clientKey: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  };

  return (
    <ChakraProvider>
      <PusherProvider {...pusherConfig}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
            <NextNprogress
              color={theme.colors.blue[400]}
              startPosition={0.3}
              stopDelayMs={200}
              height={2}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />
            <div>
              <Toaster />
            </div>

            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </QueryClientProvider>
      </PusherProvider>
    </ChakraProvider>
  );
}
export default MyApp;
