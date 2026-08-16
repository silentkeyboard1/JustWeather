import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { ReactNode } from 'react';

import type { City } from '../../city-search/model/city';

import {
  getFavoriteCities,
  saveFavoriteCities,
} from '../storage/favoriteCitiesStorage';

type FavoritesContextValue = {
  favoriteCities: City[];
  isLoadingFavorites: boolean;

  isFavorite: (cityId: string) => boolean;
  toggleFavorite: (city: City) => Promise<void>;
  removeFavorite: (cityId: string) => Promise<void>;
};

const FavoritesContext =
  createContext<FavoritesContextValue | undefined>(
    undefined
  );

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [favoriteCities, setFavoriteCities] =
    useState<City[]>([]);

  const [
    isLoadingFavorites,
    setIsLoadingFavorites,
  ] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const storedFavorites =
          await getFavoriteCities();

        setFavoriteCities(storedFavorites);
      } catch (error) {
        console.error(
          'Favoriten konnten nicht geladen werden:',
          error
        );
      } finally {
        setIsLoadingFavorites(false);
      }
    }

    loadFavorites();
  }, []);

  function isFavorite(cityId: string) {
    return favoriteCities.some(
      (city) => city.id === cityId
    );
  }

  async function toggleFavorite(city: City) {
    const alreadyFavorite =
      isFavorite(city.id);

    const updatedFavorites =
      alreadyFavorite
        ? favoriteCities.filter(
            (favoriteCity) =>
              favoriteCity.id !== city.id
          )
        : [...favoriteCities, city];

    setFavoriteCities(updatedFavorites);

    try {
      await saveFavoriteCities(
        updatedFavorites
      );
    } catch (error) {
      console.error(
        'Favoriten konnten nicht gespeichert werden:',
        error
      );
    }
  }

  async function removeFavorite(
    cityId: string
  ) {
    const updatedFavorites =
      favoriteCities.filter(
        (city) => city.id !== cityId
      );

    setFavoriteCities(updatedFavorites);

    try {
      await saveFavoriteCities(
        updatedFavorites
      );
    } catch (error) {
      console.error(
        'Favoriten konnten nicht gespeichert werden:',
        error
      );
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteCities,
        isLoadingFavorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context =
    useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      'useFavorites muss innerhalb des FavoritesProvider verwendet werden.'
    );
  }

  return context;
}