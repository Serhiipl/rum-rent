import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ServiceProps, ServiceCategory } from "@/lib/serviceStore";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useServiceStore from "@/lib/serviceStore";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceProps | undefined;
  categories: ServiceCategory[];
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    rentalPrice: "",
    rentalPeriod: "",
    deposit: "",
    quantity: "",
    condition: "",
    active: false,
    images: [] as string[],
  });

  const NO_IMAGE_SRC = "/no-image.jpg";

  const ItemQuantity: React.FC<{ qty: number }> = ({ qty }) => (
    <span
      className={`inline-flex items-center pr-2 py-1 rounded-full text-xs font-semibold ${
        qty > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-orange-600"
      }`}
    >
      <span
        className={`flex justify-center items-center ml-1 w-4 h-4 rounded-full mr-1 ${
          qty > 0 ? "bg-green-300" : "bg-orange-300"
        }`}
      >
        {qty || 0}
      </span>
      {qty === 1 ? "Dostępny" : qty > 0 ? "Dostępne" : "Zadzwoń do nas"}
    </span>
  );

  const fetchServices = useServiceStore((state) => state.fetchServices);
  const fetchServiceCategories = useServiceStore(
    (state) => state.fetchServiceCategories
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchServices(), fetchServiceCategories()]);
        setFormData({
          name: service?.name || "",
          description: service?.description || "",
          categoryId: service?.categoryId || categories[0]?.id || "",
          rentalPrice: service?.rentalPrice?.toString?.() || "",
          rentalPeriod: service?.rentalPeriod?.toString?.() || "",
          deposit: service?.deposit?.toString?.() || "",
          quantity: service?.quantity?.toString?.() || "",
          condition: service?.condition || "",
          active: service?.available || false,
          images: service?.images?.map((img) => img.url) || [],
        });
      } catch (error) {
        console.error("Failed to load services or categories:", error);
      }
    };
    loadInitialData();
  }, [fetchServices, fetchServiceCategories, service, categories]);

  const {
    name,
    description,
    categoryId,
    rentalPrice,
    rentalPeriod,
    deposit,
    quantity,
    condition,
    active,
    images,
  } = formData;
  const updateService = useServiceStore((state) => state.updateService);

  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      if (!service) {
        throw new Error("No service selected for editing.");
      }
      await updateService({
        serviceId: service.serviceId,
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        rentalPrice: Number(formData.rentalPrice || 0),
        rentalPeriod: Number(formData.rentalPeriod || 0),
        available: formData.active,
        images: service.images,
        deposit: Number(formData.deposit || 0),
        quantity: Number(formData.quantity || 0),
        condition: formData.condition,
      });
      await fetchServices();
      onClose();
    } catch (error) {
      console.error("Failed to save service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edytuj usługę</DialogTitle>
        </DialogHeader>
        {/* Preview to mirror product-card */}
        <div className="bg-yellow-50 border border-amber-500 rounded-md p-3 mb-4">
          <div className="flex gap-3 items-center">
            <div className="relative w-20 h-20 rounded overflow-hidden bg-yellow-100">
              <Image
                src={images?.[0] || NO_IMAGE_SRC}
                alt={name || "Preview"}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold truncate">{name || "Nazwa usługi"}</div>
              <div className="flex items-center justify-between">
                <ItemQuantity qty={Number(quantity || 0)} />
                <div className="text-sm">
                  Cena za dzień <span className="font-bold">{Number(rentalPrice || 0)} PLN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nazwa</label>
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Opis</label>
            <Textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Kategoria</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Cena (PLN / dzień)</label>
              <Input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={rentalPrice}
                onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Okres wynajmu (dni)</label>
              <Input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={rentalPeriod}
                onChange={(e) => setFormData({ ...formData, rentalPeriod: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Depozyt (PLN)</label>
              <Input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ilość (szt.)</label>
              <Input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Stan</label>
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Aktywna</label>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="mr-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            Zapisz
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Anuluj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
