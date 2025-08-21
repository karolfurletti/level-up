import { describe, it, expect, beforeEach, vi } from 'vitest';
import { localStorageService } from '../localStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('LocalStorage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCustomHeroes', () => {
    it('should return empty array when no heroes stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = localStorageService.getCustomHeroes();
      
      expect(result).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('marvel-custom-heroes');
    });

    it('should return parsed heroes from localStorage', () => {
      const mockHeroes = [
        {
          id: 'custom-1',
          name: 'Test Hero',
          description: 'Test description',
          thumbnail: { path: 'http://example.com', extension: 'jpg' },
          comics: { available: 5 },
          series: { available: 3 },
          stories: { available: 8 },
          isCustom: true
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHeroes));
      
      const result = localStorageService.getCustomHeroes();
      
      expect(result).toEqual(mockHeroes);
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const result = localStorageService.getCustomHeroes();
      
      expect(result).toEqual([]);
    });
  });

  describe('saveCustomHero', () => {
    it('should save new hero with generated ID', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const heroData = {
        name: 'New Hero',
        description: 'New description',
        thumbnail: { path: 'http://example.com', extension: 'jpg' },
        comics: { available: 5 },
        series: { available: 3 },
        stories: { available: 8 }
      };
      
      const result = localStorageService.saveCustomHero(heroData);
      
      expect(result).toMatchObject({
        ...heroData,
        isCustom: true
      });
      expect(result.id).toMatch(/^custom-\d+$/);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'marvel-custom-heroes',
        expect.any(String)
      );
    });
  });

  describe('updateCustomHero', () => {
    it('should update existing hero', () => {
      const existingHeroes = [
        {
          id: 'custom-123',
          name: 'Old Name',
          description: 'Old description',
          thumbnail: { path: 'http://old.com', extension: 'jpg' },
          comics: { available: 1 },
          series: { available: 1 },
          stories: { available: 1 },
          isCustom: true
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHeroes));
      
      const updates = {
        name: 'Updated Name',
        description: 'Updated description'
      };
      
      const result = localStorageService.updateCustomHero('custom-123', updates);
      
      expect(result).toMatchObject({
        ...existingHeroes[0],
        ...updates
      });
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should return null for non-existent hero', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const result = localStorageService.updateCustomHero('custom-999', { name: 'Test' });
      
      expect(result).toBeNull();
    });
  });

  describe('deleteCustomHero', () => {
    it('should delete existing hero', () => {
      const existingHeroes = [
        {
          id: 'custom-123',
          name: 'Hero to Delete',
          description: 'Description',
          thumbnail: { path: 'http://example.com', extension: 'jpg' },
          comics: { available: 1 },
          series: { available: 1 },
          stories: { available: 1 },
          isCustom: true
        },
        {
          id: 'custom-456',
          name: 'Hero to Keep',
          description: 'Description',
          thumbnail: { path: 'http://example.com', extension: 'jpg' },
          comics: { available: 1 },
          series: { available: 1 },
          stories: { available: 1 },
          isCustom: true
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHeroes));
      
      const result = localStorageService.deleteCustomHero('custom-123');
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'marvel-custom-heroes',
        JSON.stringify([existingHeroes[1]])
      );
    });

    it('should return false for non-existent hero', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const result = localStorageService.deleteCustomHero('custom-999');
      
      expect(result).toBe(false);
    });
  });

  describe('getCustomHeroById', () => {
    it('should return hero by ID', () => {
      const mockHeroes = [
        {
          id: 'custom-123',
          name: 'Test Hero',
          description: 'Test description',
          thumbnail: { path: 'http://example.com', extension: 'jpg' },
          comics: { available: 5 },
          series: { available: 3 },
          stories: { available: 8 },
          isCustom: true
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHeroes));
      
      const result = localStorageService.getCustomHeroById('custom-123');
      
      expect(result).toEqual(mockHeroes[0]);
    });

    it('should return null for non-existent hero', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const result = localStorageService.getCustomHeroById('custom-999');
      
      expect(result).toBeNull();
    });
  });
}); 