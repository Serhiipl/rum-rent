import React from "react";
import ServiceCard from "./product-card";
// import { get } from "http";
import { getAllServices } from "@/lib/prisma-operations";

const AllProducts: React.FC = async () => {
  const services = await getAllServices();
  return (
    <div className="grid w-full max-w-7xl gap-4 mt-10">
      {services.length === 0 ? (
        <p className="text-stone-500">
          Error Loading... try to refresh the page.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.serviceId} service={service} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllProducts;
