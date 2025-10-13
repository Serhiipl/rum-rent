import { Button } from "./ui/button";

const OWNER_NUMBER = process.env.COMPANY_PHONE || "+48 513 424 110";

const PhoneLink: React.FC = () => {
  return (
    <Button variant="default" asChild>
      <a href={`tel:${OWNER_NUMBER}`} className="text-amber-500 hover:underline">
        {OWNER_NUMBER}
      </a>
    </Button>
  );
};

export default PhoneLink;
