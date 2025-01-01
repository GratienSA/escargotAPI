import { getCategories } from "@/helpers/getData";

interface NavigationItem {
  _id: number;
  name: string;
  href: string;
}

export const generateNavigation = async (): Promise<NavigationItem[]> => {
  const navigation: NavigationItem[] = [
    { _id: 20, name: "Accueil", href: "/allProducts" }, 
  ];

  try {
    const result = await getCategories();
    const categories = result.categories; 
    console.log("Catégories récupérées:", categories);

    const dynamicNavigation = categories.map((category: { id: number; name: string }) => {
      const item = {
        _id: category.id,
        name: category.name,
        href: `/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
      };
      console.log("Item de navigation créé:", item);
      return item;
    });

    const fullNavigation = [...navigation, ...dynamicNavigation];
    console.log("Navigation complète:", fullNavigation);
    return fullNavigation;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return navigation; 
  }
};

