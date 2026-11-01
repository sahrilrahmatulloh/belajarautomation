"use client";

import { createBooleanPreference } from "./localPreference";

// Mengingat apakah CTA roadmap di halaman Belajar disembunyikan pengguna.
const preference = createBooleanPreference("belajarautomation-roadmap-cta-collapsed");

export const setRoadmapCtaCollapsed = preference.set;
export const useRoadmapCtaCollapsed = preference.useValue;
