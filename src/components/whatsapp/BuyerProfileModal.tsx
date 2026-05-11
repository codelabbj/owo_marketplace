"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  BuyerProfileFormSchema,
  type BuyerProfileFormValues,
  type BuyerProfileStored,
} from "@/schemas/buyer-profile.schema";
import { normalizePhoneE164 } from "@/lib/whatsapp/buildWhatsAppUrl";

export type BuyerProfileModalProps = {
  open: boolean;
  initial?: Partial<BuyerProfileFormValues> | null;
  onClose: () => void;
  onSave: (profile: BuyerProfileStored) => void;
};

export function BuyerProfileModal({
  open,
  initial,
  onClose,
  onSave,
}: BuyerProfileModalProps) {
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BuyerProfileFormValues>({
    resolver: zodResolver(BuyerProfileFormSchema),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      phone: initial?.phone ?? "",
    },
  });

  const { ref: firstNameFormRef, ...firstNameField } = register("firstName");

  useEffect(() => {
    if (open) {
      reset({
        firstName: initial?.firstName ?? "",
        lastName: initial?.lastName ?? "",
        phone: initial?.phone ?? "",
      });
      window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open, initial, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function onValid(values: BuyerProfileFormValues) {
    const phoneE164 = normalizePhoneE164(values.phone);
    if (!phoneE164) {
      setError("phone", {
        type: "manual",
        message: "Numéro invalide (6 à 15 chiffres, indicatif inclus, ex. +229…)",
      });
      return;
    }
    onSave({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneE164,
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="buyer-profile-title"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-card-hover">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id="buyer-profile-title" className="text-h3">
              Vos coordonnées
            </h2>
            <p className="mt-1 text-body-sm text-ink-muted">
              Pour tracer votre demande côté boutique, nous enregistrons ces infos
              dans votre navigateur (pas de compte requis). Elles sont envoyées au
              serveur uniquement au moment où vous ouvrez WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-subtle hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onValid)} noValidate>
          <div>
            <label htmlFor="buyer-firstName" className="mb-1 block text-caption text-ink-muted">
              Prénom
            </label>
            <input
              id="buyer-firstName"
              ref={(el) => {
                firstNameFormRef(el);
                firstFieldRef.current = el;
              }}
              autoComplete="given-name"
              className="input"
              {...firstNameField}
            />
            {errors.firstName ? (
              <p className="mt-1 text-caption text-red-600" role="alert">
                {errors.firstName.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="buyer-lastName" className="mb-1 block text-caption text-ink-muted">
              Nom
            </label>
            <input
              id="buyer-lastName"
              autoComplete="family-name"
              className="input"
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="mt-1 text-caption text-red-600" role="alert">
                {errors.lastName.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="buyer-phone" className="mb-1 block text-caption text-ink-muted">
              Téléphone (WhatsApp)
            </label>
            <input
              id="buyer-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+229 60 00 00 00"
              className="input"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="mt-1 text-caption text-red-600" role="alert">
                {errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn-outline" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              Continuer vers WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
