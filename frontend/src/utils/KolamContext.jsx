import React, { createContext, useContext } from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import apiClient from "./apiClient";

const KolamContext = createContext(null);

export const KolamProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // GET: Mengambil data kolam dengan pagination dan filter
  const getKolam = async ({
    page = 1,
    limit = 5,
    keyword = "",
    sort = "terbaru",
  } = {}) => {
    const response = await apiClient.get("/kolam", {
      params: {
        page,
        limit,
        keyword,
        sort,
      },
    });

    return response.data;
  };

  // GET: Mengambil detail kolam berdasarkan ID
  const getKolamById = async (id) => {
    const response = await apiClient.get(`/kolam/${id}`);
    return response.data.data;
  };

  // POST: Menambahkan kolam
    const addKolam = useMutation({
    mutationFn: async (data) => {
        const response = await apiClient.post("/kolam", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
        queryKey: ["kolam"],
        });
    },
    });

  // PUT: Memperbarui kolam
    const updateKolam = useMutation({
    mutationFn: async ({ id, data }) => {
        data.append("_method", "PUT");

        const response = await apiClient.post(`/kolam/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        });

        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({
        queryKey: ["kolam"],
        });
    },
    });

  // DELETE: Menghapus kolam
  const deleteKolam = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/kolam/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kolam"],
      });
    },
  });

  return (
    <KolamContext.Provider
      value={{
        getKolam,
        getKolamById,
        addKolam,
        updateKolam,
        deleteKolam,
      }}
    >
      {children}
    </KolamContext.Provider>
  );
};

export const useKolam = () => {
  const context = useContext(KolamContext);

  if (!context) {
    throw new Error(
      "useKolam harus digunakan di dalam KolamProvider"
    );
  }

  return context;
};
