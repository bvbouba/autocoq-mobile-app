import { OrderDirection, ProductOrderField } from "@/saleor/api.generated";

export interface UrlSorting {
  field: ProductOrderField;
  direction: OrderDirection;
}

export interface SortingOption {
  label: string;
  field?: ProductOrderField;
  direction?: OrderDirection;
  chosen: boolean;
}

// Fonction pour obtenir les options de tri en fonction du tri sélectionné
export const getSortingOptions = (chosenSorting: UrlSorting | null): SortingOption[] => {
  const options: SortingOption[] = [
    { label: "Popularité", chosen: false },
    { label: "Nom croissant", field: "NAME", direction: "ASC", chosen: false },
    { label: "Nom décroissant", field: "NAME", direction: "DESC", chosen: false },
  ];

  let isChosenSet = false;
  for (const option of options) {
    if (option.field === chosenSorting?.field && option.direction === chosenSorting?.direction) {
      option.chosen = true;
      isChosenSet = true;
      break;
    }
  }
  if (!isChosenSet) {
    options[0].chosen = true; // Par défaut, "Popularité"
  }
  return options;
};
