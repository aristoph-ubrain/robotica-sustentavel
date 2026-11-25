"use client";

import { Building2, GraduationCap, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { contact } from "@/lib/data/contact";
import {
  audiences,
  companyInterests,
  schoolInterests,
  schoolNetworks,
  wasteTypes,
  wasteVolumes,
  type Audience,
} from "@/lib/data/contact-forms";

/*
 * Formulários "Escola" e "Empresa". Nada é enviado a servidor: ao confirmar,
 * montamos o texto e abrimos o WhatsApp do Instituto com a mensagem pronta
 * (https://wa.me/<número>?text=...). A pessoa revisa e envia por lá.
 */

const inputClasses =
  "w-full rounded-campo border-[1.5px] border-tinta-suave bg-branco px-3.5 text-[15px] text-tinta " +
  "placeholder:text-tinta-suave aria-invalid:border-erro aria-invalid:bg-erro-fundo";

type Errors = Record<string, string>;

/** Campo de texto, número, select ou textarea com rótulo e erro associados. */
function Field({
  id,
  label,
  required,
  optionalLabel,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-bold">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-verde-escuro"> *</span>
        ) : (
          <span className="font-normal text-tinta-suave"> ({optionalLabel})</span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-erro`} className="mt-1 text-[13px] font-bold text-erro">
          {error}
        </p>
      )}
    </div>
  );
}

/** Grupo de checkboxes ou radios em cartões tocáveis (alvo ≥ 44px). */
function ChoiceGroup({
  name,
  legend,
  type,
  options,
  required,
  optionalLabel,
  error,
  errorId,
}: {
  name: string;
  legend: string;
  type: "checkbox" | "radio";
  options: { value: string; label: string; hint?: string }[];
  required?: boolean;
  optionalLabel: string;
  error?: string;
  errorId: string;
}) {
  return (
    <fieldset
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      className="min-w-0"
    >
      <legend className="text-sm font-bold">
        {legend}
        {required ? (
          <span aria-hidden="true" className="text-verde-escuro"> *</span>
        ) : (
          <span className="font-normal text-tinta-suave"> ({optionalLabel})</span>
        )}
      </legend>
      <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex min-h-toque cursor-pointer items-start gap-2.5 rounded-campo border-[1.5px] bg-branco px-3 py-2.5 text-sm font-bold transition-colors",
              "border-borda-forte hover:border-verde-escuro has-checked:border-verde-escuro has-checked:bg-fundo-suave",
              "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--cor-foco)",
            )}
          >
            <input
              type={type}
              name={name}
              value={option.value}
              className="mt-0.5 size-[18px] shrink-0 accent-verde-escuro focus-visible:outline-none"
            />
            <span>
              {option.label}
              {option.hint && (
                <span className="block text-[13px] font-normal text-tinta-suave">{option.hint}</span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-[13px] font-bold text-erro">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default function ContactForms() {
  const t = useTranslations("Contact");
  const tWaste = useTranslations("WasteTypes");
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const [audience, setAudience] = useState<Audience>("school");
  const [errors, setErrors] = useState<Errors>({});
  const [openedUrl, setOpenedUrl] = useState<string | null>(null);

  const id = (name: string) => `${uid}-${name}`;
  const optionalLabel = t("optional");

  // Campos obrigatórios por público (texto) e grupos obrigatórios (escolha).
  const requiredText: Record<Audience, string[]> =
    { school: ["name", "school", "city"], company: ["name", "company", "city"] };
  const requiredChoice: Record<Audience, string[]> = { school: [], company: ["interest"] };

  function describe(name: string, extra?: string) {
    const ids = [errors[name] ? `${id(name)}-erro` : null, extra].filter(Boolean);
    return ids.length ? ids.join(" ") : undefined;
  }

  function validate(data: FormData): Errors {
    const next: Errors = {};
    for (const name of requiredText[audience]) {
      if (!String(data.get(name) ?? "").trim()) next[name] = t("errors.required");
    }
    for (const name of requiredChoice[audience]) {
      if (!data.get(name)) next[name] = t("errors.choose");
    }
    return next;
  }

  function buildMessage(data: FormData) {
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const lines: string[] = [];
    const add = (label: string, value: string) => {
      if (value) lines.push(`*${label}:* ${value}`);
    };

    if (audience === "school") {
      add(t("whatsapp.labels.name"), text("name"));
      add(t("fields.role"), text("role"));
      add(t("fields.school"), text("school"));
      const network = text("network");
      add(t("fields.network"), network ? t(`options.network.${network}`) : "");
      add(t("fields.city"), text("city"));
      add(t("fields.students"), text("students"));
      add(
        t("whatsapp.labels.interests"),
        data.getAll("interests").map((v) => t(`options.interests.${v}`)).join(", "),
      );
    } else {
      add(t("whatsapp.labels.name"), text("name"));
      add(t("fields.company"), text("company"));
      add(t("fields.city"), text("city"));
      const interest = text("interest");
      add(t("whatsapp.labels.interest"), interest ? t(`options.interest.${interest}`) : "");
      add(
        t("whatsapp.labels.wasteTypes"),
        data.getAll("wasteTypes").map((v) => tWaste(`lines.${v}.title`)).join(", "),
      );
      const volume = text("volume");
      add(t("fields.volume"), volume ? t(`options.volume.${volume}`) : "");
    }
    add(t("fields.message"), text("message"));

    const intro = audience === "school" ? t("whatsapp.schoolIntro") : t("whatsapp.companyIntro");
    return `${intro}\n\n${lines.join("\n")}`;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setOpenedUrl(null);
      // Leva o foco ao primeiro campo com problema.
      const target =
        form.querySelector<HTMLElement>(`#${CSS.escape(id(firstInvalid))}`) ??
        form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      target?.focus();
      return;
    }

    const url = `${contact.whatsappUrl}?text=${encodeURIComponent(buildMessage(data))}`;
    // Chamado direto no submit, o navegador não trata como pop-up.
    window.open(url, "_blank", "noopener,noreferrer");
    setOpenedUrl(url);
  }

  function changeAudience(next: Audience) {
    setAudience(next);
    setErrors({});
    setOpenedUrl(null);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div className="rounded-painel bg-fundo-suave p-4 sm:p-6 lg:p-8">
      {/* Escolha do público: rádios com visual de cartão (fora do <form> de dados). */}
      <fieldset>
        <legend className="font-display text-lg font-semibold">{t("audienceLabel")}</legend>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {audiences.map((key) => {
            const Icon = key === "school" ? GraduationCap : Building2;
            const checked = audience === key;
            return (
              <label
                key={key}
                className={cn(
                  "flex cursor-pointer flex-col gap-1 rounded-cartao border-2 bg-branco p-3 transition-colors sm:flex-row sm:items-center sm:gap-3 sm:p-4",
                  checked ? "border-verde-escuro" : "border-borda hover:border-borda-forte",
                  "has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--cor-foco)",
                )}
              >
                <input
                  type="radio"
                  name={`${uid}-publico`}
                  value={key}
                  checked={checked}
                  onChange={() => changeAudience(key)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-campo",
                    checked ? "bg-verde-escuro text-branco" : "bg-fundo-suave text-verde-escuro",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[17px] leading-tight font-semibold">
                    {t(`audience.${key}`)}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-tinta-suave">
                    {t(`audienceHint.${key}`)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <form
        ref={formRef}
        key={audience}
        noValidate
        onSubmit={onSubmit}
        aria-label={t(`audience.${audience}`)}
        className="mt-5 flex flex-col gap-4"
      >
        <p className="text-[13px] text-tinta-suave">{t("requiredNote")}</p>

        {errorCount > 0 && (
          <p role="alert" className="rounded-campo bg-erro-fundo px-3.5 py-2.5 text-sm font-bold text-erro">
            {t("errors.summary")}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Field id={id("name")} label={t("fields.name")} required optionalLabel={optionalLabel} error={errors.name}>
            <input
              id={id("name")}
              name="name"
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describe("name")}
              className={cn(inputClasses, "h-12")}
            />
          </Field>

          {audience === "school" ? (
            <Field id={id("role")} label={t("fields.role")} optionalLabel={optionalLabel}>
              <input
                id={id("role")}
                name="role"
                autoComplete="organization-title"
                placeholder={t("fields.rolePlaceholder")}
                className={cn(inputClasses, "h-12")}
              />
            </Field>
          ) : (
            <Field id={id("company")} label={t("fields.company")} required optionalLabel={optionalLabel} error={errors.company}>
              <input
                id={id("company")}
                name="company"
                autoComplete="organization"
                aria-required="true"
                aria-invalid={errors.company ? true : undefined}
                aria-describedby={describe("company")}
                className={cn(inputClasses, "h-12")}
              />
            </Field>
          )}

          {audience === "school" && (
            <>
              <Field id={id("school")} label={t("fields.school")} required optionalLabel={optionalLabel} error={errors.school}>
                <input
                  id={id("school")}
                  name="school"
                  autoComplete="organization"
                  aria-required="true"
                  aria-invalid={errors.school ? true : undefined}
                  aria-describedby={describe("school")}
                  className={cn(inputClasses, "h-12")}
                />
              </Field>
              <Field id={id("network")} label={t("fields.network")} optionalLabel={optionalLabel}>
                <select id={id("network")} name="network" defaultValue="" className={cn(inputClasses, "h-12")}>
                  <option value="">{t("selectPlaceholder")}</option>
                  {schoolNetworks.map((key) => (
                    <option key={key} value={key}>
                      {t(`options.network.${key}`)}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          <Field id={id("city")} label={t("fields.city")} required optionalLabel={optionalLabel} error={errors.city}>
            <input
              id={id("city")}
              name="city"
              autoComplete="address-level2"
              aria-required="true"
              aria-invalid={errors.city ? true : undefined}
              aria-describedby={describe("city")}
              className={cn(inputClasses, "h-12")}
            />
          </Field>

          {audience === "school" ? (
            <Field id={id("students")} label={t("fields.students")} optionalLabel={optionalLabel}>
              <input
                id={id("students")}
                name="students"
                type="number"
                inputMode="numeric"
                min={1}
                className={cn(inputClasses, "h-12")}
              />
            </Field>
          ) : (
            <Field id={id("volume")} label={t("fields.volume")} optionalLabel={optionalLabel}>
              <select id={id("volume")} name="volume" defaultValue="" className={cn(inputClasses, "h-12")}>
                <option value="">{t("selectPlaceholder")}</option>
                {wasteVolumes.map((key) => (
                  <option key={key} value={key}>
                    {t(`options.volume.${key}`)}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        {audience === "school" ? (
          <ChoiceGroup
            name="interests"
            type="checkbox"
            legend={t("fields.interests")}
            optionalLabel={optionalLabel}
            errorId={`${id("interests")}-erro`}
            options={schoolInterests.map((key) => ({
              value: key,
              label: t(`options.interests.${key}`),
            }))}
          />
        ) : (
          <>
            <ChoiceGroup
              name="interest"
              type="radio"
              required
              legend={t("fields.interest")}
              optionalLabel={optionalLabel}
              error={errors.interest}
              errorId={`${id("interest")}-erro`}
              options={companyInterests.map((key) => ({
                value: key,
                label: t(`options.interest.${key}`),
              }))}
            />
            <ChoiceGroup
              name="wasteTypes"
              type="checkbox"
              legend={t("fields.wasteTypes")}
              optionalLabel={optionalLabel}
              errorId={`${id("wasteTypes")}-erro`}
              options={wasteTypes.map((key) => ({
                value: key,
                label: tWaste(`lines.${key}.title`),
                hint: tWaste(`lines.${key}.items`),
              }))}
            />
          </>
        )}

        <Field id={id("message")} label={t("fields.message")} optionalLabel={optionalLabel}>
          <textarea
            id={id("message")}
            name="message"
            rows={4}
            placeholder={t("fields.messagePlaceholder")}
            className={cn(inputClasses, "min-h-28 resize-y py-3 leading-normal")}
          />
        </Field>

        <div>
          <Button type="submit" fullWidth className="md:w-auto md:px-8" aria-describedby={id("submit-hint")}>
            <MessageCircle aria-hidden="true" className="size-5" />
            {t("submit")}
          </Button>
          <p id={id("submit-hint")} className="mt-2 text-[13px] text-tinta-suave">
            {t("submitHint")}
          </p>
        </div>

        <div aria-live="polite">
          {openedUrl && (
            <p className="rounded-campo bg-branco px-3.5 py-3 text-sm">
              {t("opened")}{" "}
              <a
                href={openedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-toque items-center font-bold text-verde-escuro underline"
              >
                {t("openFallback")}
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
