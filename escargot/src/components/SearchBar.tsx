"use client";

import React, { useEffect, useState } from 'react';
import { globalSearch } from '@/helpers/getData';
import Product from './Product';
import { useSearchStore } from '@/stores/store';
import Pagination from './Pagination';

type SearchResultsProps = {
  query: string;
};

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const { searchResults, setSearchResults } = useSearchStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const results = await globalSearch({ query });
        setSearchResults(results);
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, setSearchResults]);

  if (isLoading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!searchResults || searchResults.products.length === 0) {
    return <div className="text-center py-8">No results found for "{query}"</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Best Suggestions for "{query}"</h1>
      <Product products={searchResults.products} />
      {searchResults.totalPages > 1 && (
        <Pagination 
          currentPage={searchResults.currentPage} 
          totalPages={searchResults.totalPages} 
          onPageChange={(newPage) => {
          }}
        />
      )}
    </div>
  );
};

export default SearchResults;
