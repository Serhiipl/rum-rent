"use client";

import Container from "@/components/container";
import SettingsForm from "./settingsForm";
import ShowSettings from "./showSettings";

const SettingsPage = () => {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-3 px-4">
        <h2 className="text-3xl text-center font-bold mb-6 p-2 rounded-xl bg-stone-600 text-amber-400">
          Ustawienia Strony
        </h2>
        <ShowSettings />
        <SettingsForm />
      </div>
    </Container>
  );
};

export default SettingsPage;
