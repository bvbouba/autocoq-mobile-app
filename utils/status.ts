export const getStatusLabel = (status: string): string => {
    switch (status) {
      case "FULFILLED":
        return "Delivered";
      case "CANCELED":
        return "Cancelled";
      case "PARTIALLY_FULFILLED":
        return "Partially Fulfilled";
      case "UNFULFILLED":
        return "Unfulfilled";
      case "UNCONFIRMED":
        return "Unconfirmed";
      case "DRAFT":
        return "Draft";
      case "PENDING":
        return "Pending";
      case "EXPIRED":
        return "Expired";
      default:
        return "Unknown";
    }
  };

export const getStatusBackgroundColor = (status: string): string => {
    switch (status) {
      case "FULFILLED":
        return "#d4edda"; // Light green
      case "CANCELED":
        return "#f8d7da"; // Light red
      case "PARTIALLY_FULFILLED":
        return "#fff3cd"; // Light yellow
      case "UNFULFILLED":
        return "#e2e3e5"; // Light gray
      case "UNCONFIRMED":
        return "#d1ecf1"; // Light blue
      case "DRAFT":
        return "#e7d8f6"; // Light purple
      case "PENDING":
        return "#fff8e1"; // Light gold
      case "EXPIRED":
        return "#fbe5d6"; // Light brown
      default:
        return "#f5f5f5"; // Default light gray
    }
  };