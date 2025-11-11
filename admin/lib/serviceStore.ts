import { create } from "zustand";

export interface ServiceProps {
  serviceId: string;
  name: string;
  description: string;
  rentalPrice: number;
  deposit: number;
  quantity: number;
  rentalPeriod: number;
  condition: string;
  images: Image[];
  available: boolean;
  categoryId: string;
}
// Тип для створення нової послуги (без serviceId)
export interface CreateServiceData {
  name: string;
  description: string;
  rentalPrice: number;
  deposit: number;
  quantity: number;
  rentalPeriod: number; 
  condition: string;
  images: { url: string }[];
  available: boolean;
  categoryId: string;
}
export interface Image {
  id: string;
  serviceId: string;
  url: string;
  createdAt: string;
}
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}
export interface Banner {
  id: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}
export interface CreateBannerData {
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
}

export interface SettingsFormData {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_nip?: string | null;
  smtp_user_emailFrom: string;
  email_receiver: string;
  motto_description: string;
}

export interface Settings extends SettingsFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceStore {
  banners: Banner[];
  services: ServiceProps[];
  settings: Settings | null;
  serviceCategories: ServiceCategory[];
  activeCategoryId: string | null;
  setActiveCategoryId: (id: string | null) => void;
  fetchBanners: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  servicesFetched: boolean; // Додаємо прапорець для перевірки, чи були послуги завантажені
  bannersFetched: boolean;
  categoriesFetched: boolean;
  settingsFetched: boolean;
  servicesFetchedAt: number | null;
  bannersFetchedAt: number | null;
  categoriesFetchedAt: number | null;
  settingsFetchedAt: number | null;
  isFetchingServices: boolean;
  isFetchingBanners: boolean;
  isFetchingCategories: boolean;
  isFetchingSettings: boolean;
  fetchServiceCategories: () => Promise<void>;
  // addService: (newService: ServiceProps) => Promise<void>;
  addService: (newService: CreateServiceData) => Promise<void>;
  addSettings: (newSettings: SettingsFormData) => Promise<void>;
  deleteSettings: (settingsId: string) => Promise<void>;
  updateSettings: (updatedSettings: Settings) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  updateService: (updatedService: ServiceProps) => Promise<void>;
  addServiceCategory: (newCategory: {
    name: string;
    parentId?: string | null;
  }) => Promise<void>;
  addBanner: (newBanner: CreateBannerData) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
  updateBanner: (updatedBanner: Banner) => Promise<void>;
  deleteServiceCategory: (categoryId: string) => Promise<void>;
  updateServiceCategory: (updatedCategory: ServiceCategory) => Promise<void>;
  reset: () => void;
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const fetchBanners = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void,
  get: () => ServiceStore
) => {
  const now = Date.now();
  const lastFetched = get().bannersFetchedAt;
  const TTL = 5 * 60 * 1000;
  if (lastFetched && now - lastFetched < TTL) return; // Якщо банери вже завантажені, не робимо повторний запит
  if (get().isFetchingBanners) return;
  try {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      isFetchingBanners: true,
    }));
    const response = await fetch("/api/banners");
    if (!response.ok) throw new Error("Failed to fetch banners");
    const data = await response.json();
    set((state) => ({
      ...state,
      banners: Array.isArray(data) ? data : [],
      bannersFetched: true, // Додаємо прапорець для перевірки, чи були банери завантажені
      bannersFetchedAt: Date.now(),
    }));
  } catch (error) {
    console.error("Error fetching banners:", error);
    set((state) => ({
      ...state,
      banners: [],
      error: "Не вдалося завантажити банери",
    }));
  } finally {
    set((state) => ({
      ...state,
      isFetchingBanners: false,
      isLoading: false,
    }));
  }
};

const fetchServices = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void,
  get: () => ServiceStore
) => {
  const now = Date.now();
  const lastFetched = get().servicesFetchedAt;
  const TTL = 3 * 60 * 1000; // 3 хвилини
  if (lastFetched && now - lastFetched < TTL) return; // Якщо послуги вже завантажені, не робимо повторний запит
  if (get().isFetchingServices) return;
  try {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      isFetchingServices: true,
    }));
    const response = await fetch("/api/services");
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    const data = await response.json();
    set((state) => ({
      ...state,
      services: Array.isArray(data) ? data : [],
      servicesFetched: true, // Додаємо прапорець для перевірки, чи були послуги завантажені
      servicesFetchedAt: Date.now(),
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    set((state) => ({
      ...state,
      services: [],
      error: "Не вдалося завантажити послуги",
    }));
  } finally {
    set((state) => ({
      ...state,
      isFetchingServices: false,
      isLoading: false,
    }));
  }
};

const fetchServiceCategories = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void,
  get: () => ServiceStore
) => {
  const now = Date.now();
  const lastFetched = get().categoriesFetchedAt;
  const TTL = 3 * 60 * 1000;
  if (lastFetched && now - lastFetched < TTL) return; // Якщо категорії вже завантажені, не робимо повторний запит
  if (get().isFetchingCategories) return;
  try {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      isFetchingCategories: true,
    }));
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch service categories");
    }
    const data = await response.json();
    set((state) => ({
      ...state,
      serviceCategories: Array.isArray(data) ? data : [],
      categoriesFetched: true, // Додаємо прапорець для перевірки, чи були категорії завантажені
      categoriesFetchedAt: Date.now(),
    }));
  } catch (error) {
    console.error("Error fetching service categories:", error);
    set((state) => ({
      ...state,
      serviceCategories: [],
      error: "Błąd podczas ładowania kategorii usług",
    }));
  } finally {
    set((state) => ({
      ...state,
      isFetchingCategories: false,
      isLoading: false,
    }));
  }
};

const fetchSettings = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void,
  get: () => ServiceStore
) => {
  const now = Date.now();
  const lastFetched = get().settingsFetchedAt;
  const TTL = 5 * 60 * 1000;
  if (lastFetched && now - lastFetched < TTL) return;
  if (get().isFetchingSettings) return;
  try {
    set((state) => ({
      ...state,
      isLoading: true,
      error: null,
      isFetchingSettings: true,
    }));

    const response = await fetch("/api/settings");
    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    const data = await response.json();

    const parsedSettings = Array.isArray(data)
      ? data.length > 0
        ? data[0]
        : null
      : data;

    set((state) => ({
      ...state,
      settings: parsedSettings,
      settingsFetched: true,
      settingsFetchedAt: Date.now(),
    }));
  } catch (error) {
    console.error("Error fetching settings:", error);
    set((state) => ({
      ...state,
      settings: null,
      error: "Nie udało się załadować ustawień",
    }));
  } finally {
    set((state) => ({
      ...state,
      isFetchingSettings: false,
      isLoading: false,
    }));
  }
};

const useServiceStore = create<ServiceStore>((set, get) => ({
  settings: null,
  banners: [],
  services: [],
  serviceCategories: [],
  activeCategoryId: null,
  isLoading: false,
  error: null,
  settingsFetched: false,
  bannersFetched: false, // Додаємо прапорець для перевірки, чи були банери завантажені
  servicesFetched: false,
  categoriesFetched: false, // Додаємо прапорець для перевірки, чи були категорії завантажені
  servicesFetchedAt: null,
  bannersFetchedAt: null,
  categoriesFetchedAt: null,
  settingsFetchedAt: null,
  isFetchingServices: false,
  isFetchingBanners: false,
  isFetchingCategories: false,
  isFetchingSettings: false,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setActiveCategoryId: (id: string | null) => set({ activeCategoryId: id }),

  fetchSettings: () => fetchSettings(set, get),
  fetchBanners: () => fetchBanners(set, get),
  fetchServices: () => fetchServices(set, get),
  fetchServiceCategories: () => fetchServiceCategories(set, get),

  addSettings: async (newSettings) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add settings");
      }

      const data = (await response.json()) as Settings;

      set((state) => ({
        ...state,
        settings: data,
        settingsFetched: true,
        settingsFetchedAt: Date.now(),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error adding settings:", error);
      set((state) => ({
        ...state,
        isLoading: false,
        error: "Błąd podczas dodawania ustawień",
      }));
      throw error;
    }
  },
  updateSettings: async (updatedSettings) => {
    try {
      const { id, createdAt, updatedAt, ...payload } = updatedSettings;
      if (!id) {
        throw new Error("Settings ID is required");
      }
      const response = await fetch(`/api/settings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update settings");
      }

      const data = (await response.json()) as Settings;

      set((state) => ({
        ...state,
        settings: data,
        settingsFetched: true,
        settingsFetchedAt: Date.now(),
      }));
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  },
  deleteSettings: async (settingsId) => {
    try {
      if (!settingsId) {
        throw new Error("Settings ID is required");
      }
      const response = await fetch(`/api/settings/${settingsId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete settings");
      }

      set((state) => ({
        ...state,
        settings: null,
        settingsFetched: false,
        settingsFetchedAt: null,
      }));
    } catch (error) {
      console.error("Error deleting settings:", error);
      throw error;
    }
  },
  addService: async (newService) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));

      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      // Після успішного створення - оновлюємо список послуг
      await fetchServices(set, get);

      set((state) => ({ ...state, isLoading: false }));
    } catch (error) {
      console.error("Error adding service:", error);
      set((state) => ({
        ...state,
        isLoading: false,
        error: "Błąd podczas dodawania usługi",
      }));
      throw error;
    }
  },
  updateService: async (updatedService) => {
    try {
      const response = await fetch(
        `/api/services/${updatedService.serviceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedService),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update service: ${errorText}`);
      }

      set((state) => ({
        services: state.services.map((service) =>
          service.serviceId === updatedService.serviceId
            ? updatedService
            : service
        ),
      }));
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },
  deleteService: async (serviceId) => {
    try {
      if (!serviceId) {
        throw new Error("Service ID is required");
      }

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete service: ${errorText}`);
      }

      set((state) => ({
        services: state.services.filter(
          (service) => service.serviceId !== serviceId
        ),
      }));
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },
  addBanner: async (newBanner) => {
    try {
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add banner: ${errorText}`);
      }
      await fetchBanners(set, get);
    } catch (error) {
      console.error("Error adding banner:", error);
      throw error;
    }
  },
  updateBanner: async (updatedBanner) => {
    try {
      const response = await fetch(`/api/banners/${updatedBanner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBanner),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update banner: ${errorText}`);
      }

      set((state) => ({
        banners: state.banners.map((banner) =>
          banner.id === updatedBanner.id ? updatedBanner : banner
        ),
      }));
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  },
  deleteBanner: async (bannerId) => {
    try {
      if (!bannerId) {
        throw new Error("Banner ID is required");
      }

      const response = await fetch(`/api/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete banner: ${errorText}`);
      }

      set((state) => ({
        banners: state.banners.filter((banner) => banner.id !== bannerId),
      }));
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  },
  addServiceCategory: async (newCategory) => {
    try {
      const payload = {
        name: newCategory.name,
        parentId: newCategory.parentId ?? null,
      };
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add category: ${errorText}`);
      }

      await fetchServiceCategories(set, get);
    } catch (error) {
      console.error("Error adding service category:", error);
      throw error;
    }
  },

  deleteServiceCategory: async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete category");
      }

      set((state) => ({
        serviceCategories: state.serviceCategories.filter(
          (category) => category.id !== categoryId
        ),
      }));
    } catch (error) {
      console.error("Error deleting service category:", error);
      throw error;
    }
  },

  updateServiceCategory: async (updatedCategory) => {
    try {
      const payload = {
        name: updatedCategory.name,
        parentId: updatedCategory.parentId ?? null,
      };
      const response = await fetch(`/api/categories/${updatedCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      await fetchServiceCategories(set, get);
    } catch (error) {
      console.error("Error updating service category:", error);
      throw error;
    }
  },

  reset: () =>
    set({
      banners: [],
      services: [],
      serviceCategories: [],
      settings: null,
      activeCategoryId: null,
      isLoading: false,
      error: null,
      bannersFetched: false,
      servicesFetched: false,
      categoriesFetched: false,
      settingsFetched: false,
      servicesFetchedAt: null,
      bannersFetchedAt: null,
      categoriesFetchedAt: null,
      settingsFetchedAt: null,
      isFetchingServices: false,
      isFetchingBanners: false,
      isFetchingCategories: false,
      isFetchingSettings: false,
    }),
}));

export default useServiceStore;
export { fetchBanners, fetchServices, fetchServiceCategories, fetchSettings };
