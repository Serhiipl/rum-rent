"use client";

import Container from "@/components/container";
import SettingsForm from "./settingsForm";
import ShowSettings from "./showSettings";

const SettingsPage = () => {
  return (
    <>
      <Container>
        <h1 className="text-3xl font-bold mb-6 mt-10">Ustawienia</h1>
        <ShowSettings />
        <SettingsForm />
      </Container>
    </>
  );
};

export default SettingsPage;
