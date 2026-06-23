"use client";

import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/abdev/cart-context";
import { WhatsAppIcon } from "@/components/abdev/icons";
import { waLink, WA_MESSAGES } from "@/lib/contact";

export function FloatingActions() {
  const {
    cart,
    removeItem,
    setField,
    total,
    hasMonthly,
    panelOpen,
    togglePanel,
    setPanelOpen,
    restoreVisible,
    restore,
    dismissRestore,
    toast,
    sendToWhatsApp,
  } = useCart();

  const canSend =
    cart.items.length > 0 && cart.nombre.trim() !== "" && cart.whatsapp.trim() !== "";
  const isEmpty =
    cart.items.length === 0 && !cart.description && !cart.nombre;

  return (
    <>
      {/* WhatsApp FAB */}
      <a
        href={waLink(WA_MESSAGES.startProject)}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-fab"
        title="WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      {/* Cart FAB */}
      <div className="cart-fab" onClick={togglePanel} title="Mi proyecto">
        <ShoppingBag strokeWidth={1.8} />
        <span className={`cart-badge${cart.items.length > 0 ? " visible" : ""}`}>
          {cart.items.length}
        </span>
      </div>

      {/* Cart panel */}
      <div className={`cart-panel${panelOpen ? " open" : ""}`}>
        <div className="cart-panel-head">
          <h4>
            <ShoppingBag size={14} strokeWidth={2} />
            Mi proyecto
          </h4>
          <button
            className="cart-panel-close"
            onClick={() => setPanelOpen(false)}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="cart-panel-body">
          {isEmpty ? (
            <div className="cart-empty">
              <span className="ic">🛒</span>
              <strong
                style={{
                  display: "block",
                  color: "var(--ink-dim)",
                  marginBottom: 6,
                }}
              >
                Tu proyecto está vacío
              </strong>
              Agrega un paquete y describe tu idea. Lo guardamos en este navegador
              para que vuelvas cuando quieras.
            </div>
          ) : (
            <>
              {cart.items.length > 0 && (
                <>
                  <div className="cart-section-label">Paquete seleccionado</div>
                  {cart.items.map((item) => {
                    const price =
                      item.priceMode === "monthly"
                        ? item.priceMonthly
                        : item.priceOnce;
                    const label = item.priceMode === "monthly" ? "/mes" : " único";
                    return (
                      <div className="cart-item" key={item.id}>
                        <button
                          className="cart-item-x"
                          onClick={() => removeItem(item.id)}
                          aria-label="Quitar"
                        >
                          <X size={13} />
                        </button>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">
                          ${price} MXN{label}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div className="cart-section-label" style={{ marginTop: 6 }}>
                Describe tu proyecto
              </div>
              <textarea
                className="cart-textarea"
                placeholder="¿Qué necesitas? Industria, funcionalidades, si ya tienes logo o dominio…"
                value={cart.description}
                onChange={(e) => setField("description", e.target.value)}
              />
              <div className="cart-section-label" style={{ marginTop: 4 }}>
                Tus datos
              </div>
              <div className="cart-row">
                <input
                  type="text"
                  className="cart-input"
                  placeholder="Tu nombre"
                  value={cart.nombre}
                  onChange={(e) => setField("nombre", e.target.value)}
                />
                <input
                  type="text"
                  className="cart-input"
                  placeholder="WhatsApp"
                  value={cart.whatsapp}
                  onChange={(e) => setField("whatsapp", e.target.value)}
                />
              </div>
              <div className="cart-saved">
                <span className="d" />
                Todo guardado automáticamente
              </div>
            </>
          )}
        </div>
        {cart.items.length > 0 && (
          <div className="cart-panel-foot">
            <div className="cart-total">
              <span className="cart-total-l">Inversión estimada</span>
              <span className="cart-total-v">
                ${total.toLocaleString("es-MX")}{" "}
                <span>MXN{hasMonthly ? "/mes" : " pago único"}</span>
              </span>
            </div>
            <button
              className="cart-send"
              onClick={sendToWhatsApp}
              disabled={!canSend}
            >
              <WhatsAppIcon width={14} height={14} />
              Enviar por WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* Restore bar */}
      <div className={`cart-restore-bar${restoreVisible ? " show" : ""}`}>
        <span>📋 Tienes un proyecto guardado</span>
        <button className="cart-restore-btn" onClick={restore}>
          Recuperar
        </button>
        <button
          className="cart-restore-dismiss"
          onClick={dismissRestore}
          aria-label="Descartar"
        >
          ✕
        </button>
      </div>

      {/* Toast */}
      <div className={`cart-toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}
