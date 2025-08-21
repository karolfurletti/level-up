import type { MarvelHero } from './marvelApi';

export interface CustomHero extends Omit<MarvelHero, 'id'> {
  id: string;
  isCustom: true;
}

const STORAGE_KEY = 'marvel-custom-heroes';

class LocalStorageService {
  getCustomHeroes(): CustomHero[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao buscar heróis customizados:', error);
      return [];
    }
  }

  saveCustomHero(hero: Omit<CustomHero, 'id' | 'isCustom'>): CustomHero {
    const heroes = this.getCustomHeroes();
    const newHero: CustomHero = {
      ...hero,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    
    heroes.push(newHero);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(heroes));
    return newHero;
  }

  updateCustomHero(id: string, updatedHero: Partial<Omit<CustomHero, 'id' | 'isCustom'>>): CustomHero | null {
    const heroes = this.getCustomHeroes();
    const heroIndex = heroes.findIndex(hero => hero.id === id);
    
    if (heroIndex === -1) return null;
    
    heroes[heroIndex] = { ...heroes[heroIndex], ...updatedHero };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(heroes));
    return heroes[heroIndex];
  }

  deleteCustomHero(id: string): boolean {
    const heroes = this.getCustomHeroes();
    const filteredHeroes = heroes.filter(hero => hero.id !== id);
    
    if (filteredHeroes.length === heroes.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHeroes));
    return true;
  }

  getCustomHeroById(id: string): CustomHero | null {
    const heroes = this.getCustomHeroes();
    return heroes.find(hero => hero.id === id) || null;
  }
}

export const localStorageService = new LocalStorageService(); 