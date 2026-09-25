import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

export function Modal({
  children,
  className,
  description,
  isOpen,
  onClose,
  title,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          aria-describedby={description ? "modal-description" : undefined}
          aria-labelledby={title ? "modal-title" : undefined}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-3xl border border-white/[0.1] bg-[#071022] p-6 shadow-2xl shadow-black/50 text-slate-100 sm:p-8",
              className
            )}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            ref={modalRef}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h2
                    className="font-display text-2xl font-semibold text-white tracking-tight"
                    id="modal-title"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    className="mt-1 text-sm leading-6 text-slate-400"
                    id="modal-description"
                  >
                    {description}
                  </p>
                )}
              </div>
              <button
                aria-label="Close dialog"
                className="rounded-full p-2 text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
                onClick={onClose}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
