import { Button } from "./ui/button";

const OWNER_NUMBER = "+48 722 285 139";

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
