"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadPicture, getPictureUrl } from "@/helpers/getPictures";
import { CategoryType, ProductType } from "@/utils/types";
import { createProduct, updateProduct } from "@/helpers/PostUpadateDeleteProducts";
import { getCategories } from "@/helpers/getData";
import FormattedPrice from "../FormatedPrice";

type ErrorState = {
  name?: string;
  price?: string;
  description?: string;
  image?: string;
  category?: string;
  submit?: string;
}

type CategoryResponse = {
  totalResults: number;
  categories: CategoryType[];
}

export function ProductForm({ product }: { product?: ProductType | null }) {
  const [error, setError] = useState<ErrorState>({});
  const [price, setPrice] = useState<number | undefined>(product?.price);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imagePath ? getPictureUrl(product.imagePath) : null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(product?.category?.name);
  const router = useRouter(); 

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories();
        const categoryData = response as CategoryResponse;
        setCategories(categoryData.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(prev => ({ ...prev, category: 'Failed to load categories' }));
      }
    }

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
  
    let imageUrl: string | undefined = product?.imagePath;
  
    if (imageFile) {
      const uploadedImageUrl = await uploadPicture(imageFile, 'product', product?.id);
      console.log('Uploaded image URL:', uploadedImageUrl);
      if (!uploadedImageUrl) {
        setError(prev => ({ ...prev, image: "Error uploading image" }));
        return;
      }
      imageUrl = uploadedImageUrl;
    }
    
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: selectedCategory,
      imagePath: imageUrl,
    };
  
    try {
      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }
      console.log('Product saved successfully');
      router.push('/admin/products'); 
    } catch (error) {
      console.error('Error:', error);
      setError(prev => ({ ...prev, submit: 'An error occurred while saving the product' }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-8 p-4 bg-white shadow-md rounded-md w-full max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={product?.name || ""}
          />
          {error.name && <div className="text-destructive">{error.name}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            id="price"
            name="price"
            required
            value={price}
            onChange={e => setPrice(Number(e.target.value) || undefined)}
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
            required
            defaultValue={product?.description}
          />
          {error.description && <div className="text-destructive">{error.description}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
            onChange={handleImageChange}
            required={!product} 
          />
          {imagePreview && (
            <Image
              src={imagePreview}
              height={400}
              width={400}
              alt="Product image preview"
            />
          )}
          {error.image && <div className="text-destructive">{error.image}</div>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            name="category" 
            defaultValue={product?.category?.name || ""}
            onValueChange={setSelectedCategory} 
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}> 
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error.category && <div className="text-destructive">{error.category}</div>}
        </div>
        {error.submit && <div className="text-destructive">{error.submit}</div>}
        <Button type="submit">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </div>
  );
}

