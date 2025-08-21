import { useState, useEffect, useCallback } from 'react';
import type { MarvelHero } from '../services/marvelApi';
import type { CustomHero } from '../services/localStorage';
import type { HeroFormData } from '../components/HeroForm';
import { getHeroes, getHeroById } from '../services/marvelApi';
import { localStorageService } from '../services/localStorage';

export type CombinedHero = MarvelHero | CustomHero;

interface UseHeroesState {
  marvelHeroes: MarvelHero[];
  customHeroes: CustomHero[];
  allHeroes: CombinedHero[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
}

interface UseHeroesReturn extends UseHeroesState {
  // Search and pagination
  setSearchQuery: (query: string) => void;
  loadMoreHeroes: () => Promise<void>;
  resetHeroes: () => void;
  
  // CRUD operations
  createCustomHero: (heroData: HeroFormData) => Promise<CustomHero>;
  updateCustomHero: (id: string, heroData: HeroFormData) => Promise<CustomHero | null>;
  deleteCustomHero: (id: string) => Promise<boolean>;
  
  // Hero operations
  getHeroById: (id: string | number) => Promise<CombinedHero | null>;
  createHeroCopy: (hero: MarvelHero) => Promise<CustomHero>;
  
  // Utility functions
  refreshData: () => Promise<void>;
}

const HEROES_PER_PAGE = 20;

export const useHeroes = (): UseHeroesReturn => {
  const [state, setState] = useState<UseHeroesState>({
    marvelHeroes: [],
    customHeroes: [],
    allHeroes: [],
    loading: false,
    error: null,
    searchQuery: '',
    currentPage: 0,
    totalPages: 0,
    hasMorePages: true
  });

  // Load custom heroes from localStorage
  const loadCustomHeroes = useCallback(() => {
    const customHeroes = localStorageService.getCustomHeroes();
    setState(prev => ({
      ...prev,
      customHeroes,
      allHeroes: [...prev.marvelHeroes, ...customHeroes]
    }));
  }, []);

  // Load Marvel heroes from API
  const loadMarvelHeroes = useCallback(async (
    page: number = 0, 
    query: string = '', 
    append: boolean = false
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const offset = page * HEROES_PER_PAGE;
      const response = await getHeroes(
        HEROES_PER_PAGE, 
        offset, 
        query || undefined
      );
      
      const newHeroes = response.data.results;
      const totalPages = Math.ceil(response.data.total / HEROES_PER_PAGE);
      const hasMorePages = (page + 1) < totalPages;

      setState(prev => {
        const marvelHeroes = append ? [...prev.marvelHeroes, ...newHeroes] : newHeroes;
        return {
          ...prev,
          marvelHeroes,
          allHeroes: [...marvelHeroes, ...prev.customHeroes],
          currentPage: page,
          totalPages,
          hasMorePages,
          loading: false
        };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar heróis da Marvel'
      }));
    }
  }, []);

  // Initialize data
  useEffect(() => {
    loadCustomHeroes();
    loadMarvelHeroes(0, '');
  }, [loadCustomHeroes, loadMarvelHeroes]);

  // Search functionality
  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
    loadMarvelHeroes(0, query, false);
  }, [loadMarvelHeroes]);

  // Load more heroes (pagination)
  const loadMoreHeroes = useCallback(async () => {
    if (!state.hasMorePages || state.loading) return;
    await loadMarvelHeroes(state.currentPage + 1, state.searchQuery, true);
  }, [state.hasMorePages, state.loading, state.currentPage, state.searchQuery, loadMarvelHeroes]);

  // Reset heroes to initial state
  const resetHeroes = useCallback(() => {
    setState(prev => ({
      ...prev,
      marvelHeroes: [],
      currentPage: 0,
      searchQuery: ''
    }));
    loadMarvelHeroes(0, '');
  }, [loadMarvelHeroes]);

  // Create new custom hero
  const createCustomHero = useCallback(async (heroData: HeroFormData): Promise<CustomHero> => {
    const newHero = localStorageService.saveCustomHero(heroData);
    loadCustomHeroes();
    return newHero;
  }, [loadCustomHeroes]);

  // Update existing custom hero
  const updateCustomHero = useCallback(async (
    id: string, 
    heroData: HeroFormData
  ): Promise<CustomHero | null> => {
    const updatedHero = localStorageService.updateCustomHero(id, heroData);
    if (updatedHero) {
      loadCustomHeroes();
    }
    return updatedHero;
  }, [loadCustomHeroes]);

  // Delete custom hero
  const deleteCustomHero = useCallback(async (id: string): Promise<boolean> => {
    const success = localStorageService.deleteCustomHero(id);
    if (success) {
      loadCustomHeroes();
    }
    return success;
  }, [loadCustomHeroes]);

  // Get hero by ID (works for both Marvel and custom heroes)
  const getHeroByIdFn = useCallback(async (id: string | number): Promise<CombinedHero | null> => {
    // First check in current loaded heroes
    const existingHero = state.allHeroes.find(hero => 
      hero.id.toString() === id.toString()
    );
    
    if (existingHero) {
      return existingHero;
    }

    // If it's a custom hero ID
    if (typeof id === 'string' && id.startsWith('custom-')) {
      return localStorageService.getCustomHeroById(id);
    }

    // If it's a Marvel hero ID, fetch from API
    if (typeof id === 'number' || !isNaN(Number(id))) {
      return await getHeroById(Number(id));
    }

    return null;
  }, [state.allHeroes]);

  // Create a copy of a Marvel hero as custom hero
  const createHeroCopy = useCallback(async (hero: MarvelHero): Promise<CustomHero> => {
    // Use portrait_uncanny for consistent quality with Marvel heroes
    const imageUrl = `${hero.thumbnail.path}/portrait_uncanny.${hero.thumbnail.extension}`;
    
    const heroData: HeroFormData = {
      name: `${hero.name} (Cópia)`,
      description: hero.description,
      thumbnail: {
        path: imageUrl.replace(`.${hero.thumbnail.extension}`, ''),
        extension: hero.thumbnail.extension
      },
      comics: { available: hero.comics.available },
      series: { available: hero.series.available },
      stories: { available: hero.stories.available }
    };

    return await createCustomHero(heroData);
  }, [createCustomHero]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    loadCustomHeroes();
    await loadMarvelHeroes(0, state.searchQuery);
  }, [loadCustomHeroes, loadMarvelHeroes, state.searchQuery]);

  return {
    ...state,
    setSearchQuery,
    loadMoreHeroes,
    resetHeroes,
    createCustomHero,
    updateCustomHero,
    deleteCustomHero,
    getHeroById: getHeroByIdFn,
    createHeroCopy,
    refreshData
  };
}; 