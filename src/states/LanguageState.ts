import enText from "../languages/en.json";
import { computed, signal } from "@preact/signals-react";

export type Language = "en" | "ro";

type LanguageText = typeof enText;

const textObject: { [key: string]: LanguageText } = {
  en: enText,
};

export const language = signal<Language>("en");

export const setLanguage = (value: Language) => {
  language.value = value;
};

export const text = computed(() => textObject[language.value]);
