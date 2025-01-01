"use client";

import React, { useEffect, useState } from "react";
import { CategoryType } from "@/utils/types";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@/helpers/getData";

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        if (Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          console.error("La réponse n'a pas de tableau de catégories:", response);
          setCategories([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  type AdaptedCategoryDto = {
    name: string;
    description?: string;
  };

  const handleCreateCategory = async () => {
    if (!categoryName) return;

    try {
      const newCategory: AdaptedCategoryDto = {
        name: categoryName,
        description: undefined,
      };

      const createdCategory = await createCategory(newCategory);
      setCategories((prev) => [...prev, createdCategory]);
      setCategoryName("");
    } catch (err) {
      setError("Erreur lors de la création de la catégorie.");
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!categoryName) return;

    try {
      const existingCategory = categories.find((cat) => cat.id === id);
      if (!existingCategory) return;

      const updatedCategory: AdaptedCategoryDto = {
        name: categoryName,
        description:
          existingCategory.description !== null
            ? existingCategory.description
            : undefined,
      };

      const response = await updateCategory(id, updatedCategory);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response : cat))
      );
      setCategoryName("");
      setSelectedCategory(null);
    } catch (err) {
      setError("Erreur lors de la mise à jour de la catégorie.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression de la catégorie.");
    }
  };

  const handleEditCategory = async (id: number) => {
    try {
      const category = await getCategoryById(id);
      setSelectedCategory(category);
      setCategoryName(category.name);
    } catch (err) {
      setError("Erreur lors de la récupération de la catégorie.");
    }
  };

  if (loading) {
    return <div>Chargement des catégories...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center my-4">
        Gestion des Catégories
      </h1>
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="flex flex-col items-start mb-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Nom de la catégorie"
          className="border p-2 rounded w-full md:w-64"
        />
        <button
          onClick={
            selectedCategory
              ? () => handleUpdateCategory(selectedCategory.id)
              : handleCreateCategory
          }
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mt-2"
        >
          {selectedCategory ? "Mettre à jour" : "Créer"}
        </button>
      </div>

      {/* Table structure for categories */}
      <div className="overflow-x-auto">
        <table className="w-full md:w-1/2 border-collapse border border-gray-300 mx-auto">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Nom de la catégorie</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 transition duration-200 mr-2"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-2">Aucune catégorie disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagementPage;



