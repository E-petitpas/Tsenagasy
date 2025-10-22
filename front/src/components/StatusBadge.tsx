import React from "react";

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) {
    return (
      <span
        style={{ backgroundColor: "#D1D5DB", color: "#111827" }} // gris
        className="inline-block px-2 py-1 text-xs font-medium rounded-full border"
      >
        Inconnu
      </span>
    );
  }

  const normalized = status.trim().toLowerCase();
  let label = "";
  let bgColor = "";
  let textColor = "";
  let borderColor = "";

  switch (normalized) {
    case "en_attente":
    case "en attente":
      label = "En attente";
      bgColor = "#FACC15"; // jaune vif
      textColor = "#92400E"; 
      borderColor = "#FBBF24";
      break;
    case "brouillon":
      label = "Brouillon";
      bgColor = "#D1D5DB"; // gris
      textColor = "#374151";
      borderColor = "#9CA3AF";
      break;
    case "publié":
    case "publie":
      label = "Publié";
      bgColor = "#2D8A47" // vert vif
      textColor = "#065F46";
      borderColor = "#245A35";
      break;
    case "processing":
    case "en traitement":
      label = "En traitement";
      bgColor = "#3B82F6" // bleu vif
      textColor = "#FFFFFF";
      borderColor = "#2563EB";
      break;
    case "shipped":
    case "expédié":
      label = "Expédié";
      bgColor = "#9F7AEA"; // violet vif
      textColor = "#6B21A8";
      borderColor = "#8B5CF6";
      break;
    case "completed":
    case "terminé":
      label = "Terminé";
      bgColor = "#2D8A47"; // emerald vif
      textColor = "#FFFFFF";
      borderColor = "#245A35";
      break;
    case "cancelled":
    case "annulé":
      label = "Annulé";
      bgColor = "#F87171"; // rouge vif
      textColor = "#7F1D1D";
      borderColor = "#EF4444";
      break;
    default:
      label = status;
      bgColor = "#D1D5DB";
      textColor = "#374151";
      borderColor = "#9CA3AF";
      break;
  }

  return (
    <span
      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderColor }}
      className="inline-block px-2 py-1 text-xs font-semibold rounded-full border"
    >
      {label}
    </span>
  );
};
