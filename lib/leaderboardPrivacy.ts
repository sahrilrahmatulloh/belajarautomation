"use client";

import { createBooleanPreference } from "./localPreference";

// Opsi privasi leaderboard (PRD FR-06). Sementara disimpan di browser;
// nantinya harus disimpan di akun dan dipatuhi oleh server.
const preference = createBooleanPreference("belajarautomation-leaderboard-hidden");

export const setHiddenFromLeaderboard = preference.set;
export const useHiddenFromLeaderboard = preference.useValue;
