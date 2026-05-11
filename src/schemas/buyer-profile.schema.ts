import { z } from "zod";

/** Profil visiteur stocké en local (camelCase). */
export const BuyerProfileStoredSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  phoneE164: z.string().regex(/^\d{6,15}$/),
});

export type BuyerProfileStored = z.infer<typeof BuyerProfileStoredSchema>;

/** Formulaire modale (téléphone saisi librement, normalisé à l’enregistrement). */
export const BuyerProfileFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(80),
  lastName: z.string().min(1, "Le nom est requis").max(80),
  phone: z.string().min(6, "Le numéro est requis").max(32),
});

export type BuyerProfileFormValues = z.infer<typeof BuyerProfileFormSchema>;
