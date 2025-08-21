import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getHeroes, getHeroById, getImageUrl } from '../marvelApi';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('Marvel API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getImageUrl', () => {
    it('should generate correct image URL with default size', () => {
      const thumbnail = {
        path: 'http://example.com/image',
        extension: 'jpg'
      };
      
      const result = getImageUrl(thumbnail);
      expect(result).toBe('http://example.com/image/standard_large.jpg');
    });

    it('should generate correct image URL with custom size', () => {
      const thumbnail = {
        path: 'http://example.com/image',
        extension: 'png'
      };
      
      const result = getImageUrl(thumbnail, 'portrait_incredible');
      expect(result).toBe('http://example.com/image/portrait_incredible.png');
    });
  });

  describe('getHeroes', () => {
    it('should fetch heroes successfully', async () => {
      const mockResponse = {
        data: {
          code: 200,
          status: 'Ok',
          data: {
            offset: 0,
            limit: 20,
            total: 100,
            count: 20,
            results: [
              {
                id: 1,
                name: 'Spider-Man',
                description: 'Your friendly neighborhood hero',
                thumbnail: {
                  path: 'http://example.com/spiderman',
                  extension: 'jpg'
                },
                comics: { available: 10 },
                series: { available: 5 },
                stories: { available: 15 }
              }
            ]
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getHeroes();
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://gateway.marvel.com/v1/public/characters',
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 20,
            offset: 0,
            apikey: expect.any(String),
            ts: expect.any(String),
            hash: expect.any(String)
          })
        })
      );
      
      expect(result).toEqual(mockResponse.data);
    });

    it('should include search parameter when provided', async () => {
      const mockResponse = {
        data: {
          code: 200,
          status: 'Ok',
          data: {
            offset: 0,
            limit: 20,
            total: 10,
            count: 10,
            results: []
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await getHeroes(20, 0, 'Spider');
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://gateway.marvel.com/v1/public/characters',
        expect.objectContaining({
          params: expect.objectContaining({
            nameStartsWith: 'Spider'
          })
        })
      );
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getHeroes()).rejects.toThrow(errorMessage);
    });
  });

  describe('getHeroById', () => {
    it('should fetch hero by ID successfully', async () => {
      const mockHero = {
        id: 1,
        name: 'Spider-Man',
        description: 'Your friendly neighborhood hero',
        thumbnail: {
          path: 'http://example.com/spiderman',
          extension: 'jpg'
        },
        comics: { available: 10 },
        series: { available: 5 },
        stories: { available: 15 }
      };

      const mockResponse = {
        data: {
          data: {
            results: [mockHero]
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getHeroById(1);
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://gateway.marvel.com/v1/public/characters/1',
        expect.objectContaining({
          params: expect.objectContaining({
            apikey: expect.any(String),
            ts: expect.any(String),
            hash: expect.any(String)
          })
        })
      );
      
      expect(result).toEqual(mockHero);
    });

    it('should return null when hero not found', async () => {
      const mockResponse = {
        data: {
          data: {
            results: []
          }
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await getHeroById(999);
      expect(result).toBeNull();
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(getHeroById(1)).rejects.toThrow(errorMessage);
    });
  });
}); 