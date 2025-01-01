"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CategoryType, ProductType } from "@/utils/types";
import {
  createInventory,
  createProduct,
  updateProduct,
} from "@/helpers/PostUpadateDeleteProducts";
import FormattedPrice from "../FormatedPrice";
import { createCategory, getCategories } from "@/helpers/getData";

type ErrorState = {
  name?: string;
  price?: string;
  description?: string;
  image?: string;
  category?: string;
  quantity?: string;
  submit?: string;
};

interface ProductFormProps {
  product?: ProductType | null;
  categories?: CategoryType[];
  type: "Create" | "Update";
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, type }) => {
  const [error, setError] = useState<ErrorState>({});
  const [price, setPrice] = useState<number | undefined>(product?.price);
  const [quantity, setQuantity] = useState<number>(
    product?.inventory?.quantity || 0
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product?.imagePath ? product.imagePath.split(", ") : []
  );
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    product?.category?.name || ""
  );
  const [newCategory, setNewCategory] = useState<string>("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Catégories récupérées :", data);
        setCategories(data.categories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = (data: {
    name: string;
    price: number;
    description: string;
    categoryId: number | undefined;
    quantity: number | undefined; // Add quantity to the validation
  }) => {
    const errors: ErrorState = {};

    if (!data.name) errors.name = "Le nom est requis.";
    if (!data.price || data.price <= 0)
      errors.price = "Le prix doit être supérieur à 0.";
    if (!data.description) errors.description = "La description est requise.";
    if (!data.categoryId && !newCategory)
      errors.category = "Veuillez sélectionner ou créer une catégorie.";
    if (data.quantity === undefined || data.quantity < 0)
      errors.quantity = "La quantité doit être supérieure ou égale à 0."; // Validate quantity

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  
    const selectedCategoryId = categories.find(
      (cat) => cat.name === selectedCategory
    )?.id;
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      categoryId: selectedCategoryId ? selectedCategoryId : undefined,
      imagePath: imagePreviews.join(", "),
      quantity: Number(formData.get("quantity")) || quantity,
    };
  
    const errors = validateForm(productData);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
  
    try {
      if (newCategory && !selectedCategoryId) {
        const createdCategory = await createCategory({ name: newCategory });
        productData.categoryId = createdCategory.id;
      }
  
      let savedProduct;
      if (product) {
        savedProduct = await updateProduct(product.id, productData);
      } else {
        savedProduct = await createProduct(productData);
      }
  
      // Créer un inventaire pour le produit
      if (!product && savedProduct?.id) {
        await createInventory({
          productId: savedProduct.id,
          quantity: productData.quantity || 0,
        });
      }
  
      console.log("Produit et inventaire enregistrés avec succès");
      router.push("/admin/products");
    } catch (error) {
      console.error("Erreur :", error);
      setError((prev) => ({
        ...prev,
        submit: "Une erreur est survenue lors de l'enregistrement.",
      }));
    }
  };
  

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
      }

      const data = await response.json();
      setImagePreviews((prev) => [...prev, data.secure_url]);
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-4 bg-white shadow-md rounded-md w-full max-w-lg"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            type="text"
            id="name"
            name="name"
            defaultValue={product?.name || ""}
          />
          {error.name && <div className="text-destructive">{error.name}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Prix</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value) || undefined)}
            step="0.01"
          />
          <div className="text-muted-foreground">
            <FormattedPrice amount={price || 0} />
          </div>
          {error.price && <div className="text-destructive">{error.price}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product?.description || ""}
          />
          {error.description && (
            <div className="text-destructive">{error.description}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity || ""} // Display empty string if quantity is undefined
            onChange={(e) => {
              const value = e.target.value;
              setQuantity(value ? Number(value) : 0); // Set to 0 if the input is empty
            }}
            min="0" // Ensure quantity cannot be negative
          />
          {error.quantity && (
            <div className="text-destructive">{error.quantity}</div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Images</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          {uploading && (
            <div className="text-muted-foreground">
              Téléchargement en cours...
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative">
                <Image
                  src={src}
                  width={100}
                  height={100}
                  alt={`Image ${index + 1}`}
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {error.image && <div className="text-destructive">{error.image}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <div className="relative">
            <select
              name="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setNewCategory("");
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Sélectionnez une catégorie
              </option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>

            <Input
              type="text"
              placeholder="Nouvelle catégorie"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-2"
            />
          </div>
          {error.category && (
            <div className="text-destructive">{error.category}</div>
          )}
        </div>

        {error.submit && <div className="text-destructive">{error.submit}</div>}

        <Button
          type="submit"
          className={`text-white font-bold py-2 px-4 rounded ${
            type === "Update" ? "bg-yellow-500" : "bg-green-500"
          }`}
        >
          {type === "Update" ? "Mettre à jour le produit" : "Créer le produit"}
        </Button>
      </form>
    </div>
  );
};
