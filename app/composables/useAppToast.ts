// composables/useAppToast.ts
import { useToast } from "#imports";

export function useAppToast() {
  const toast = useToast();

  function showToast({
    title,
    description = "",
    color = "primary",
    timeout = 3000,
    position = "top-right",
  }: {
    title: string;
    description?: string;
    color?: "primary" | "success" | "error" | "warning" | "info";
    timeout?: number;
    position?: string;
  }) {
    toast.add({
      title,
      description,
      color,
      //   timeout,
      //   position, // 👈 AQUÍ DEFINES LA POSICIÓN DEL TOAST
    });
  }

  return {
    showToast,
  };
}
