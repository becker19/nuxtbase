// composables/useConfirm.ts
import { ref } from "vue";

const isOpen = ref(false);
const message = ref("");
let confirmCallback: null | (() => void) = null;

export function useConfirm() {
  const ask = (callback: () => void, msg: string = "¿Seguro?") => {
    message.value = msg;
    confirmCallback = callback;
    isOpen.value = true;
  };

  const confirm = () => {
    if (confirmCallback) confirmCallback();
    isOpen.value = false;
  };

  const cancel = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    message,
    ask,
    confirm,
    cancel,
  };
}
