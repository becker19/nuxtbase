<script setup lang="ts">
import { useMyToast } from "@/composables/useMyToast";
const { messages } = useMyToast();
</script>

<template>
  <div class="fixed top-4 right-4 space-y-2 z-50">
    <div
      v-for="msg in messages"
      :key="msg.id"
      :class="[
        'px-4 py-2 rounded shadow text-white',
        msg.type === 'success' ? 'bg-green-500' : 'bg-red-500',
      ]"
    >
      {{ msg.text }}
    </div>
  </div>
</template>
