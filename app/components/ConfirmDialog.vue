<script setup lang="ts">
const { isOpen, message, confirm, cancel } = useConfirm();
</script>

<template>
  <UModal v-model:open="isOpen" size="sm">
    <template #header>
      <h3 class="text-lg font-semibold text-red-600">Confirmación</h3>
    </template>

    <template #body>
      <p class="text">{{ message }}</p>
    </template>

    <template #footer>
      <UButton label="Cancelar" variant="outline" @click="cancel" />
      <UButton label="Confirmar" color="success" @click="confirm" />
    </template>
  </UModal>
</template>
