"use client";

import Container from "@/components/container";
import SettingsForm from "./settingsForm";
import ShowSettings from "./showSettings";

const SettingsPage = () => {
  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-center font-bold mb-6 mt-10">
          Ustawienia
        </h1>
        <ShowSettings />
        <SettingsForm />
      </div>
    </Container>
  );
};

export default SettingsPage;
