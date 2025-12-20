import { ref } from "vue";

const isOpen = ref(false);
const message = ref("");
let callback: (() => void) | null = null;

export function useConfirm() {
  function ask(cb: () => void, msg = "¿Confirmar acción?") {
    message.value = msg;
    callback = cb;
    isOpen.value = true;
  }

  function confirm() {
    callback?.();
    close();
  }

  function cancel() {
    close();
  }

  function close() {
    isOpen.value = false;
    message.value = "";
    callback = null;
  }

  return { isOpen, message, ask, confirm, cancel };
}
