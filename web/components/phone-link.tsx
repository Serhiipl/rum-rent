import { Button } from "./ui/button";

const PhoneLink: React.FC = () => {
  const OwnerNumber = "+48 123 456 789"; // Replace with actual phone number
  return (
    <Button variant="default" asChild>
      <a href={`tel:${OwnerNumber}`} className="text-amber-500 hover:underline">
        {OwnerNumber}
      </a>
    </Button>
  );
};

export default PhoneLink;
