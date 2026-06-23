"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { waLink } from "@/lib/contact";

export type PriceMode = "once" | "monthly";

export interface CartItem {
  id: string;
  name: string;
  priceOnce: string;
  priceMonthly: string;
  priceMode: PriceMode;
}

interface CartState {
  items: CartItem[];
  description: string;
  nombre: string;
  whatsapp: string;
  updatedAt: number | null;
}

interface CartContextValue {
  billing: PriceMode;
  setBilling: (m: PriceMode) => void;
  cart: CartState;
  addItem: (item: Omit<CartItem, "priceMode">) => void;
  removeItem: (id: string) => void;
  setField: (field: "description" | "nombre" | "whatsapp", value: string) => void;
  total: number;
  hasMonthly: boolean;
  panelOpen: boolean;
  setPanelOpen: (v: boolean) => void;
  togglePanel: () => void;
  restoreVisible: boolean;
  restore: () => void;
  dismissRestore: () => void;
  toast: string | null;
  sendToWhatsApp: () => void;
}

const CART_KEY = "abdev_cart_v2";
const EMPTY: CartState = {
  items: [],
  description: "",
  nombre: "",
  whatsapp: "",
  updatedAt: null,
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [billing, setBilling] = useState<PriceMode>("once");
  const [cart, setCart] = useState<CartState>(EMPTY);
  const [panelOpen, setPanelOpen] = useState(false);
  const [restoreVisible, setRestoreVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const hydrated = useRef(false);

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartState>;
        const merged = { ...EMPTY, ...parsed };
        setCart(merged);
        if (merged.items.length > 0 || merged.description) {
          setRestoreVisible(true);
          setTimeout(() => setRestoreVisible(false), 7000);
        }
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  // Persist whenever cart changes (after hydration).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (
        cart.items.length === 0 &&
        !cart.description &&
        !cart.nombre &&
        !cart.whatsapp
      ) {
        localStorage.removeItem(CART_KEY);
      } else {
        localStorage.setItem(
          CART_KEY,
          JSON.stringify({ ...cart, updatedAt: Date.now() }),
        );
      }
    } catch {
      /* ignore */
    }
  }, [cart]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "priceMode">) => {
      setCart((c) => {
        if (c.items.find((i) => i.id === item.id)) {
          showToast(`${item.name} ya está en tu proyecto`);
          return c;
        }
        showToast(`✓ ${item.name} agregado`);
        return { ...c, items: [...c.items, { ...item, priceMode: billing }] };
      });
      setPanelOpen(true);
    },
    [billing, showToast],
  );

  const removeItem = useCallback((id: string) => {
    setCart((c) => ({ ...c, items: c.items.filter((i) => i.id !== id) }));
  }, []);

  const setField = useCallback(
    (field: "description" | "nombre" | "whatsapp", value: string) => {
      setCart((c) => ({ ...c, [field]: value }));
    },
    [],
  );

  const total = cart.items.reduce((sum, item) => {
    const raw = item.priceMode === "monthly" ? item.priceMonthly : item.priceOnce;
    return sum + parseInt(raw.replace(/,/g, ""), 10);
  }, 0);
  const hasMonthly = cart.items.some((i) => i.priceMode === "monthly");

  const restore = useCallback(() => {
    setRestoreVisible(false);
    setPanelOpen(true);
  }, []);
  const dismissRestore = useCallback(() => setRestoreVisible(false), []);
  const togglePanel = useCallback(() => setPanelOpen((v) => !v), []);

  const sendToWhatsApp = useCallback(() => {
    if (!cart.nombre.trim() || !cart.whatsapp.trim()) {
      showToast("⚠️ Completa tu nombre y WhatsApp");
      return;
    }
    const pkgList = cart.items
      .map((item) => {
        const price =
          item.priceMode === "monthly" ? item.priceMonthly : item.priceOnce;
        const label =
          item.priceMode === "monthly" ? "/mes x 12 meses" : "pago único";
        return `• Paquete ${item.name} — $${price} MXN ${label}`;
      })
      .join("\n");
    const totalStr = total.toLocaleString("es-MX");
    const msg = [
      "Hola Alberto, quiero iniciar un proyecto con ABDEV.",
      "",
      "*Mi información:*",
      `Nombre: ${cart.nombre}`,
      `WhatsApp: ${cart.whatsapp}`,
      "",
      "*Paquete:*",
      pkgList,
      `Total estimado: $${totalStr} MXN${hasMonthly ? "/mes" : " pago único"}`,
      "",
      cart.description ? `*Mi proyecto:*\n${cart.description}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(msg), "_blank");
    setCart(EMPTY);
    setPanelOpen(false);
    showToast("✅ Solicitud enviada — ¡hasta pronto!");
  }, [cart, total, hasMonthly, showToast]);

  return (
    <CartContext.Provider
      value={{
        billing,
        setBilling,
        cart,
        addItem,
        removeItem,
        setField,
        total,
        hasMonthly,
        panelOpen,
        setPanelOpen,
        togglePanel,
        restoreVisible,
        restore,
        dismissRestore,
        toast,
        sendToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
