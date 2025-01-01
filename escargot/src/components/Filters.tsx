import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import StarRatings from "react-star-ratings";
import { useSearchStore } from "@/stores/store";
import { globalSearch } from "@/helpers/getData";

const Filters: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSearchResults } = useSearchStore();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categoryList: string[] = [
    "Escargots Frais",
    "Escargots Préparés",
    "Spécialités Culinaires",
    "Accessoires et Plus",
    "Coffrets Gourmands"
  ];
  

  useEffect(() => {
    setMinPrice(searchParams.get('min') || '');
    setMaxPrice(searchParams.get('max') || '');
    setCategories(searchParams.getAll('category'));
    setRatings(searchParams.getAll('ratings'));
  }, [searchParams]);

  const applyFilters = async () => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('min', minPrice);
    if (maxPrice) params.set('max', maxPrice);
    params.delete('category');
    categories.forEach(cat => params.append('category', cat));
    params.delete('ratings');
    ratings.forEach(rating => params.append('ratings', rating));
  
    console.log('URL Parameters:', params.toString()); // Debug log
  
    router.push(`?${params.toString()}`);
  
    try {
      const results = await globalSearch({
        query: params.get('query') || '',
        page: Number(params.get('page')) || 1,
        limit: Number(params.get('limit')) || 12,
        sort: params.get('sort') || '',
        category: categories.join(','),
        priceRange: minPrice && maxPrice ? `${minPrice}-${maxPrice}` : '',
        rating: ratings.length > 0 ? Math.min(...ratings.map(Number)) : 0,
      });
  
      setSearchResults(results);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCategories(prev => checked ? [...prev, value] : prev.filter(cat => cat !== value));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setRatings(prev => checked ? [...prev, value] : prev.filter(rating => rating !== value));
  };

  return (

      <aside className="md:w-1/3 lg:w-1/4 px-4">
        <div className="hidden md:block px-6 py-4 border border-gray-200 bg-white rounded shadow-sm">
          <h3 className="font-semibold mb-2">Prix (€)</h3>
          <div className="grid md:grid-cols-3 gap-x-2">
            <div className="mb-4">
              <input
                name="min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Min"
              />
            </div>
            <div className="mb-4">
              <input
                name="max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                type="number"
                placeholder="Max"
              />
            </div>
            <div className="mb-4">
              <button
                className="px-1 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={applyFilters}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Appliquer'}
              </button>
            </div>
          </div>
        </div>
    
        <div className="hidden md:block px-6 py-4 border border-gray-200 bg-white rounded shadow-sm">
          <h3 className="font-semibold mb-2">Catégorie</h3>
          <ul className="space-y-1">
            {categoryList.map((category) => (
              <li key={category}>
                <label className="flex items-center">
                  <input
                    name="category"
                    type="checkbox"
                    value={category}
                    checked={categories.includes(category)}
                    onChange={handleCategoryChange}
                    className="h-4 w-4"
                  />
                  <span className="ml-2 text-gray-500">{category}</span>
                </label>
              </li>
            ))}
          </ul>
    
          <hr className="my-4" />
    
          <h3 className="font-semibold mb-2">Notes</h3>
          <ul className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  name="ratings"
                  type="checkbox"
                  value={rating.toString()}
                  checked={ratings.includes(rating.toString())}
                  onChange={handleRatingChange}
                  className="h-4 w-4"
                />
                <span className="ml-2 text-gray-500">
                  <StarRatings
                    rating={rating}
                    starRatedColor="#ffb829"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                  />
                </span>
              </label>
            ))}
          </ul>
        </div>
      </aside>
    );
};

export default Filters;

