import axios from 'axios';
import CryptoJS from 'crypto-js';

const PUBLIC_KEY = 'd3f7014b249832d47926b1a5a4a6b836';
const PRIVATE_KEY = '14f86d05a20ec9da950ae11e463bb744607b4e39';
const BASE_URL = 'https://gateway.marvel.com/v1/public';

export interface MarvelHero {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
  series: {
    available: number;
  };
  stories: {
    available: number;
  };
}

export interface MarvelApiResponse {
  code: number;
  status: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: MarvelHero[];
  };
}

// Função para gerar autenticação
const generateAuth = () => {
  const timestamp = Date.now().toString();
  const hash = CryptoJS.MD5(timestamp + PRIVATE_KEY + PUBLIC_KEY).toString();
  
  return {
    ts: timestamp,
    apikey: PUBLIC_KEY,
    hash: hash
  };
};

// Função para buscar heróis
export const getHeroes = async (
  limit: number = 20, 
  offset: number = 0, 
  nameStartsWith?: string
): Promise<MarvelApiResponse> => {
  const auth = generateAuth();
  const params = {
    ...auth,
    limit,
    offset,
    ...(nameStartsWith && { nameStartsWith })
  };

  try {
    const response = await axios.get(`${BASE_URL}/characters`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar heróis:', error);
    throw error;
  }
};

// Função para buscar herói por ID
export const getHeroById = async (id: number): Promise<MarvelHero | null> => {
  const auth = generateAuth();
  
  try {
    const response = await axios.get(`${BASE_URL}/characters/${id}`, { 
      params: auth 
    });
    
    if (response.data.data.results.length > 0) {
      return response.data.data.results[0];
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar herói:', error);
    throw error;
  }
};

// Função para gerar URL da imagem
export const getImageUrl = (
  thumbnail: { path: string; extension: string }, 
  size: string = 'standard_large'
): string => {
  return `${thumbnail.path}/${size}.${thumbnail.extension}`;
}; 