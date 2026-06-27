import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ToastContainer() {
  const { toasts, dismissToast } = useAuth();

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className="pointer-events-auto"
          >
            <ToastItem toast={toast} onClose={() => dismissToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const styles = {
    success: {
      bg: "bg-emerald-50 border-emerald-150",
      text: "text-emerald-800",
      iconColor: "text-emerald-500",
      icon: CheckCircle,
    },
    error: {
      bg: "bg-rose-50 border-rose-150",
      text: "text-rose-800",
      iconColor: "text-rose-500",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-blue-50 border-blue-150",
      text: "text-blue-800",
      iconColor: "text-blue-500",
      icon: Info,
    },
  };

  const current = styles[toast.type] || styles.info;
  const Icon = current.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${current.bg} ${current.text} transition-all duration-200`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${current.iconColor} mt-0.5`} />
      <p className="text-sm font-medium leading-relaxed flex-1">
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
      >
        <X className="w-4 h-4 opacity-60" />
      </button>
    </div>
  );
}
