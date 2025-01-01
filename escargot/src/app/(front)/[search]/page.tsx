"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/Container';
import Filters from '@/components/Filters';
import SearchResults from '@/components/SearchBar';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <Container>
      <div className="flex flex-col md:flex-row">
        <Filters />
        <div className="flex-1">
          {query ? (
            <SearchResults query={query} />
          ) : (
            <div className="text-center mt-10">
              Veuillez entrer un terme de recherche.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SearchPage;