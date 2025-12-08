// Definición de la interfaz Field
export interface FieldInterface {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "date";
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
}
