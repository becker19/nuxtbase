<template>
  <UModal v-model="isOpen">
    <UCard>
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Confirmación</h3>

        <p>{{ message }}</p>

        <div class="flex justify-end gap-2 mt-4">
          <UButton color="neutral" variant="soft" @click="cancel">
            Cancelar
          </UButton>

          <UButton color="error" @click="confirm"> Confirmar </UButton>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { useConfirm } from "@/composables/useConfirm";

const { isOpen, message, confirm, cancel } = useConfirm();
</script>
