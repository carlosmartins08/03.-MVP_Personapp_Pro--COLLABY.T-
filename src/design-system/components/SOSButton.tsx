import * as React from "react"

import { cn } from "@/lib/utils"

// Cor critica e fixa do SOS - NAO substituir por token.
const SOS_COLOR = "#C0392B" // NAO alterar esta cor por nenhum motivo

type SOSVariant = "floating" | "bar" | "inline"

type SOSContact = {
  label: string
  href?: string
}

interface SOSButtonProps {
  variant?: SOSVariant
  contacts: SOSContact[]
  mapsUrl?: string
  className?: string
}

const buttonBase =
  // Regras criticas: sem opacity, sem pointer-events-none, sem display/visibility hidden.
  "inline-flex items-center justify-center font-semibold text-white shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

const variantClasses: Record<SOSVariant, string> = {
  floating: "fixed bottom-4 right-4 z-[9999] h-14 w-14 rounded-full",
  bar: "h-12 w-full rounded-xl",
  inline: "h-10 px-4 rounded-full",
}

const SOSButton = ({
  variant = "floating",
  contacts,
  mapsUrl = "https://www.google.com/maps/search/?api=1&query=ajuda+psicologica",
  className,
}: SOSButtonProps) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label="Acionar suporte de crise"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(buttonBase, variantClasses[variant], className)}
        style={{ backgroundColor: SOS_COLOR }}
      >
        SOS
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Suporte de crise"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-500">Suporte de crise</h2>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full text-neutral-300 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary focus-visible:ring-offset-2"
              >
                ×
              </button>
            </div>

            <p className="text-center text-sm text-neutral-400 mt-4 px-4">
              Você não está sozinho. Estamos aqui.
            </p>

            <div className="mt-6 space-y-4">
              <a
                href="tel:188"
                className="flex w-full items-center justify-between rounded-xl border border-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-500"
              >
                Ligar CVV 188
                <span className="text-xs text-neutral-300">tel:188</span>
              </a>

              <div className="rounded-xl border border-neutral-100 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-500">Contatos de apoio</p>
                <ul className="mt-2 space-y-2 text-sm text-neutral-400">
                  {contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                      <li key={`${contact.label}-${index}`}>
                        {contact.href ? (
                          <a className="underline" href={contact.href}>
                            {contact.label}
                          </a>
                        ) : (
                          contact.label
                        )}
                      </li>
                    ))
                  ) : (
                    <li>Nenhum contato cadastrado.</li>
                  )}
                </ul>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-between rounded-xl border border-neutral-100 px-4 py-3 text-sm font-semibold text-neutral-500"
              >
                Ajuda proxima
                <span className="text-xs text-neutral-300">Abrir mapas</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { SOSButton }
export type { SOSButtonProps, SOSContact, SOSVariant }
