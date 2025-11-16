"use client";
import { Button } from "./ui/button";
import { useContactInfo } from "@/components/settings-provider";
// const OWNER_NUMBER = process.env.COMPANY_PHONE || "+48 513 424 110";
const PhoneLink: React.FC = () => {
  const phone = useContactInfo().phone;
  return (
    <Button variant="default" asChild>
      <a href={`tel:${phone}`} className="text-amber-500 hover:underline">
        {phone}
      </a>
    </Button>
  );
};

export default PhoneLink;
