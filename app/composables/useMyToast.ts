import { ref } from "vue";

export function useMyToast() {
  const messages = ref<
    { id: number; text: string; type: "success" | "error" }[]
  >([]);

  function add(options: { text: string; type?: "success" | "error" }) {
    const id = Date.now();
    messages.value.push({
      id,
      text: options.text,
      type: options.type || "success",
    });
    setTimeout(() => {
      messages.value = messages.value.filter((m) => m.id !== id);
    }, 3000);
  }

  return { messages, add };
}
