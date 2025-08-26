"use client";
import React from "react";
import ServiceForm from "./serviceForm";
import ServiceCategoryForm from "./serviceCategory";

const AddService: React.FC = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row bg-white px-2 text-zinc-600 rounded-lg shadow-sm">
      <ServiceCategoryForm />
      <ServiceForm />
    </div>
  );
};

export default AddService;
