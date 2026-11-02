"use client";

import { ComponentType, Ref } from "react";

import { PracticePageId } from "@/data/practicePages";

import PracticeCheckout from "./PracticeCheckout";
import PracticeFrame from "./PracticeFrame";
import PracticeLogin from "./PracticeLogin";
import PracticeRegistration from "./PracticeRegistration";

const PAGES: Record<PracticePageId, ComponentType> = {
  login: PracticeLogin,
  checkout: PracticeCheckout,
  registrasi: PracticeRegistration,
};

interface PracticePageProps {
  pageId: PracticePageId;
  rootRef?: Ref<HTMLDivElement>;
}

export default function PracticePage({ pageId, rootRef }: PracticePageProps) {
  const Page = PAGES[pageId];

  return (
    <PracticeFrame pageId={pageId} rootRef={rootRef}>
      <Page />
    </PracticeFrame>
  );
}
