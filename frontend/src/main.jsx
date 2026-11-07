import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import { KolamProvider } from "./utils/KolamContext";

// Konfigurasi React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <KolamProvider>
        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </KolamProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
