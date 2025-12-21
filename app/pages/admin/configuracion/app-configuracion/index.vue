<script setup lang="ts">
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = v.object({
  appTitle: v.pipe(v.string(), v.minLength(1, "Requerido")),
  appDescription: v.pipe(v.string(), v.minLength(1, "Requerido")),
  appThemeColor: v.string(),
  appLogo: v.any(),
  appFavicon: v.any(),
  seoTitle: v.pipe(v.string(), v.minLength(1, "Requerido")),
  seoDescription: v.pipe(v.string(), v.minLength(1, "Requerido")),
  seoKeywords: v.pipe(v.string(), v.minLength(1, "Requerido")),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  appTitle: "",
  appDescription: "",
  appThemeColor: "#00C16A",
  appLogo: null as File | null,
  appFavicon: null as File | null,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Configuración guardada",
    description: "Los cambios se guardaron correctamente.",
    color: "success",
  });

  console.log(event.data);
}
</script>
<template>
  <div class="min-h-screen flex justify-center p-6">
    <div class="w-full max-w-2xl">
      <h1 class="text-2xl font-bold mb-6">App Configuración</h1>

      <UCard>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Nombre de la Aplicación" name="appTitle">
            <UInput v-model="state.appTitle" class="w-full" />
          </UFormField>

          <UFormField label="Descripción" name="appDescription">
            <UTextarea v-model="state.appDescription" class="w-full" />
          </UFormField>

          <UFormField label="Theme Color" name="themeColor">
            <UColorPicker v-model="state.appThemeColor" class="w-full" />
          </UFormField>

          <UFormField label="Logo" name="appLogo">
            <UFileUpload
              size="sm"
              variant="area"
              label="Deja tu Logo aquí"
              description="PNG, JPG or GIF (max. 2MB)"
              v-model="state.appLogo"
            />
          </UFormField>

          <UFormField label="Favicon" name="appFavicon">
            <UFileUpload
              size="sm"
              variant="area"
              label="Deja tu favicon aquí"
              description="SVG (max. 1MB)"
              v-model="state.appFavicon"
            />
          </UFormField>

          <h2 class="text-lg font-bold pt-4">Configuración SEO</h2>

          <UFormField label="SEO Título" name="seoTitle">
            <UInput v-model="state.seoTitle" class="w-full" />
          </UFormField>

          <UFormField label="SEO Descripción" name="seoDescription">
            <UTextarea v-model="state.seoDescription" class="w-full" />
          </UFormField>

          <UFormField
            label="SEO Keywords (separadas con comas)"
            name="seoKeywords"
          >
            <UInput v-model="state.seoKeywords" class="w-full" />
          </UFormField>

          <div class="flex justify-end pt-4">
            <UButton type="submit" color="primary"> Guardar cambios </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
