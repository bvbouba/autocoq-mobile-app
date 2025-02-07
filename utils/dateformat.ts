export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

 export function formatDuration(locale: string, diffMs: number): string {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
    const numberFormatter = new Intl.NumberFormat(locale);
  
    if (locale.startsWith("fr")) {
      return hours > 0
        ? minutes > 0
          ? `${numberFormatter.format(hours)} heure${hours > 1 ? "s" : ""} et ${numberFormatter.format(minutes)} minute${minutes > 1 ? "s" : ""}`
          : `${numberFormatter.format(hours)} heure${hours > 1 ? "s" : ""}`
        : `${numberFormatter.format(minutes)} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return hours > 0
        ? minutes > 0
          ? `${numberFormatter.format(hours)} hour${hours > 1 ? "s" : ""} and ${numberFormatter.format(minutes)} minute${minutes > 1 ? "s" : ""}`
          : `${numberFormatter.format(hours)} hour${hours > 1 ? "s" : ""}`
        : `${numberFormatter.format(minutes)} minute${minutes > 1 ? "s" : ""}`;
    }
  }