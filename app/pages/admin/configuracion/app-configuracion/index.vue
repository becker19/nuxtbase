<script setup lang="ts">
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useSetting } from "@/composables/services/useSetting";

const { updateSetting, settingApp } = useSetting();
const appSetting = settingApp.value;

const schema = v.object({
  appTitle: v.pipe(v.string(), v.minLength(1, "Requerido")),
  appDescription: v.pipe(v.string(), v.minLength(1, "Requerido")),
  appThemeColor: v.string(),
  appLogo: v.any(),
  appFavicon: v.any(),

  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  seoKeywords: v.optional(v.string()),
});

type Schema = v.InferOutput<typeof schema>;

const state = reactive<Schema>({
  appTitle: appSetting?.name ?? "",
  appDescription: appSetting?.description ?? "",
  appThemeColor: appSetting?.theme ?? "",
  appLogo: appSetting?.logo ?? "",
  appFavicon: appSetting?.favicon ?? "",
  seoTitle: appSetting?.seo?.title ?? "",
  seoDescription: appSetting?.seo?.description ?? "",
  seoKeywords: appSetting?.seo?.keywords ?? "",
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(appSetting);
  console.log(state);

  const resp = await updateSetting(appSetting.id, {
    name: state.appTitle,
    description: state.appDescription,
    theme: state.appThemeColor,
    logo: state.appLogo,
    favicon: state.appFavicon,
    seo: {
      title: state.seoTitle,
      description: state.seoDescription,
      keywords: state.seoKeywords,
    },
  });
  if (resp.success) {
    toast.add({
      title: "Configuración guardada",
      description: resp.message,
      color: "success",
    });
  } else {
    toast.add({
      title: "Error al guardar ",
      description: resp.message,
      color: "error",
    });
  }
}

const themeColor = computed({
  get() {
    return state.appThemeColor || "#000000";
  },
  set(value: string) {
    if (!value.startsWith("#")) {
      value = `#${value}`;
    }

    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) {
      state.appThemeColor = value;
    }
  },
});
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

          <UFormField label="Theme Color" name="appThemeColor">
            <div class="flex items-center gap-3">
              <!-- Color Picker -->
              <UColorPicker v-model="themeColor" />

              <!-- Input manual -->
              <UInput v-model="themeColor" placeholder="#000000" class="w-32" />
            </div>
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
