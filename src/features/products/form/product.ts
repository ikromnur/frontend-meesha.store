import { Size } from "@/types/product";
import { z } from "zod";

const selectObjectSchema = z.object({
  id: z.string().min(1, { message: "Harus dipilih" }),
  key: z.string(),
  name: z.string(),
});

export const productSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().min(0, { message: "Price must be at least 0" }),
  stock: z.number().int().min(0, { message: "Stock must be at least 0" }),
  description: z.string().min(1, { message: "Description is required" }),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.object({
        url: z.string(),
        publicId: z.string(),
      }),
      z.undefined(),
    ])
    .optional(),
  size: z.nativeEnum(Size),
  variant: z.array(z.string().min(1, "Variant tidak boleh kosong")).min(1, {
    message: "Minimal 1 variant harus ditambahkan",
  }),
  category: selectObjectSchema,
  type: selectObjectSchema,
  objective: selectObjectSchema,
  color: selectObjectSchema,
});

export type ProductSchema = z.infer<typeof productSchema>;

export const productSchemaWithId = productSchema.extend({
  id: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchemaWithId>;
