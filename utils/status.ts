export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "FULFILLED":
      return "Livré";
    case "CANCELED":
      return "Annulé";
    case "PARTIALLY_FULFILLED":
      return "Partiellement livré";
    case "UNFULFILLED":
      return "Non livré";
    case "UNCONFIRMED":
      return "Non confirmé";
    case "DRAFT":
      return "Brouillon";
    case "PENDING":
      return "En attente";
    case "EXPIRED":
      return "Expiré";
    case "CANCELLED":
      return "Annulé";
    case "FULLY_CHARGED":
      return "Entièrement payé";
    case "FULLY_REFUNDED":
      return "Entièrement remboursé";
    case "NOT_CHARGED":
      return "Non facturé";
    case "PARTIALLY_CHARGED":
      return "Partiellement payé";
    case "PARTIALLY_REFUNDED":
      return "Partiellement remboursé";
    case "REFUSED":
      return "Refusé";
    default:
      return "Inconnu";
  }
};

export const getStatusBackgroundColor = (status: string): string => {
  switch (status) {
    case "FULFILLED":
    case "FULLY_CHARGED":
      return "#d4edda"; // Vert clair (Livré / Entièrement payé)
    case "CANCELED":
    case "CANCELLED":
    case "REFUSED":
      return "#f8d7da"; // Rouge clair (Annulé / Refusé)
    case "PARTIALLY_FULFILLED":
    case "PARTIALLY_CHARGED":
      return "#fff3cd"; // Jaune clair (Partiellement livré / Partiellement payé)
    case "UNFULFILLED":
    case "NOT_CHARGED":
      return "#e2e3e5"; // Gris clair (Non livré / Non facturé)
    case "UNCONFIRMED":
      return "#d1ecf1"; // Bleu clair (Non confirmé)
    case "DRAFT":
      return "#e7d8f6"; // Violet clair (Brouillon)
    case "PENDING":
      return "#fff8e1"; // Doré clair (En attente)
    case "EXPIRED":
      return "#fbe5d6"; // Marron clair (Expiré)
    case "PARTIALLY_REFUNDED":
      return "#ffb74d"; // Orange clair (Partiellement remboursé)
    default:
      return "#f5f5f5"; // Gris clair par défaut
  }
};
