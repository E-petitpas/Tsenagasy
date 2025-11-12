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
      bgColor = "#FFA726"; // orange
      textColor = "#7C2D12"; 
      borderColor = "#EA580C";
      break;
    case "brouillon":
    case "inactif":
      label = normalized === "brouillon" ? "Brouillon" : "Inactif";
      bgColor = "#D1D5DB"; // gris
      textColor = "#374151";
      borderColor = "#9CA3AF";
      break;
    case "publié":
    case "publie":
    case "approuvé":
    case "approuve":
    case "terminé":
    case "termine":
      label =
        normalized === "publié" || normalized === "publie"
          ? "Publié"
          : normalized === "approuvé" || normalized === "approuve"
          ? "Approuvé"
          : "Terminé";
      bgColor = "#5BEC90" 
      textColor = "#14532D";
      borderColor = "#22C55E";
      break;
    case "processing":
    case "en traitement":
      label = "En traitement";
      bgColor = "#3B82F6" // bleu vif
      textColor = "#FFFFFF";
      borderColor = "#2563EB";
      break;
    case "expédié":
    case "livré":
      label = normalized === "expédié" ? "Expédié" : "Livré";
      bgColor = "#9F7AEA"; // violet vif
      textColor = "#6B21A8";
      borderColor = "#8B5CF6";
      break;
    case "refusé":
    case "refuse":
    case "annulé":
    case "annule":
      label =
        normalized === "refusé" || normalized === "refuse"
          ? "Refusé"
          : "Annulé";
      bgColor = "#F87171"; // rouge vif
      textColor = "#7F1D1D";
      borderColor = "#EF4444";
      break;
    case "vente":
      label = "Vente";
      bgColor = "#3B82F6"; // bleu vif
      textColor = "#FFFF";
      borderColor = "#2563EB";
      break;
    case "location":
      label = "Location";
      bgColor = "#06B6D4"; // cyan/turquoise
      textColor = "#FFFF";
      borderColor = "#0891B2";
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
