import React from 'react';

interface AssetDefinition {
  id: string;
  type: 'image' | 'video' | 'audio' | 'font';
  src: string;
  alt?: string;
  preload?: boolean;
  responsive?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  fallback?: string;
}

interface GameAssetCollection {
  [gameType: string]: {
    [assetCategory: string]: AssetDefinition[];
  };
}

interface LoadedAsset {
  element: HTMLImageElement | HTMLVideoElement | HTMLAudioElement;
  loaded: boolean;
  error?: string;
}

class GameAssetManager {
  private loadedAssets: Map<string, LoadedAsset> = new Map();
  private loadingPromises: Map<string, Promise<LoadedAsset>> = new Map();
  private assetDefinitions: GameAssetCollection;

  constructor() {
    this.assetDefinitions = this.initializeAssetDefinitions();
  }

  private initializeAssetDefinitions(): GameAssetCollection {
    return {
      blackjack: {
        cards: [
          // Card backs
          {
            id: 'card-back-naffles',
            type: 'image',
            src: '/static/games/blackjack/cards/card-back-naffles.png',
            alt: 'Naffles branded card back',
            preload: true
          },
          {
            id: 'card-back-crypto',
            type: 'image',
            src: '/static/games/blackjack/cards/card-back-crypto.png',
            alt: 'Crypto themed card back',
            preload: true
          },
          // Card suits (generated programmatically)
          ...this.generateCardAssets()
        ],
        chips: [
          {
            id: 'chip-10',
            type: 'image',
            src: '/static/games/blackjack/chips/chip-10.png',
            alt: '$10 crypto chip with ETH logo',
            preload: true,
            responsive: {
              mobile: '/static/games/blackjack/chips/mobile/chip-10.png',
              tablet: '/static/games/blackjack/chips/tablet/chip-10.png',
              desktop: '/static/games/blackjack/chips/chip-10.png'
            }
          },
          {
            id: 'chip-25',
            type: 'image',
            src: '/static/games/blackjack/chips/chip-25.png',
            alt: '$25 crypto chip with BTC logo',
            preload: true,
            responsive: {
              mobile: '/static/games/blackjack/chips/mobile/chip-25.png',
              tablet: '/static/games/blackjack/chips/tablet/chip-25.png',
              desktop: '/static/games/blackjack/chips/chip-25.png'
            }
          },
          {
            id: 'chip-50',
            type: 'image',
            src: '/static/games/blackjack/chips/chip-50.png',
            alt: '$50 crypto chip with SOL logo',
            preload: true,
            responsive: {
              mobile: '/static/games/blackjack/chips/mobile/chip-50.png',
              tablet: '/static/games/blackjack/chips/tablet/chip-50.png',
              desktop: '/static/games/blackjack/chips/chip-50.png'
            }
          },
          {
            id: 'chip-100',
            type: 'image',
            src: '/static/games/blackjack/chips/chip-100.png',
            alt: '$100 crypto chip with MATIC logo',
            preload: true,
            responsive: {
              mobile: '/static/games/blackjack/chips/mobile/chip-100.png',
              tablet: '/static/games/blackjack/chips/tablet/chip-100.png',
              desktop: '/static/games/blackjack/chips/chip-100.png'
            }
          }
        ],
        backgrounds: [
          {
            id: 'table-felt',
            type: 'image',
            src: '/static/games/blackjack/backgrounds/table-felt.jpg',
            alt: 'Crypto-themed blackjack table felt',
            preload: true
          },
          {
            id: 'table-pattern',
            type: 'image',
            src: '/static/games/blackjack/backgrounds/crypto-pattern.svg',
            alt: 'Subtle crypto pattern overlay',
            preload: false
          }
        ],
        sounds: [
          {
            id: 'card-deal',
            type: 'audio',
            src: '/static/games/blackjack/sounds/card-deal.mp3',
            preload: true,
            fallback: '/static/games/blackjack/sounds/card-deal.ogg'
          },
          {
            id: 'chip-place',
            type: 'audio',
            src: '/static/games/blackjack/sounds/chip-place.mp3',
            preload: true,
            fallback: '/static/games/blackjack/sounds/chip-place.ogg'
          },
          {
            id: 'win-sound',
            type: 'audio',
            src: '/static/games/blackjack/sounds/win.mp3',
            preload: false,
            fallback: '/static/games/blackjack/sounds/win.ogg'
          },
          {
            id: 'lose-sound',
            type: 'audio',
            src: '/static/games/blackjack/sounds/lose.mp3',
            preload: false,
            fallback: '/static/games/blackjack/sounds/lose.ogg'
          }
        ]
      },
      'coin-toss': {
        coins: [
          {
            id: 'pepe-heads',
            type: 'image',
            src: '/static/games/coin-toss/pepe-heads.png',
            alt: 'Pepe the Frog on heads side of coin',
            preload: true,
            responsive: {
              mobile: '/static/games/coin-toss/mobile/pepe-heads.png',
              tablet: '/static/games/coin-toss/tablet/pepe-heads.png',
              desktop: '/static/games/coin-toss/pepe-heads.png'
            }
          },
          {
            id: 'bitcoin-tails',
            type: 'image',
            src: '/static/games/coin-toss/bitcoin-tails.png',
            alt: 'Bitcoin logo on tails side of coin',
            preload: true,
            responsive: {
              mobile: '/static/games/coin-toss/mobile/bitcoin-tails.png',
              tablet: '/static/games/coin-toss/tablet/bitcoin-tails.png',
              desktop: '/static/games/coin-toss/bitcoin-tails.png'
            }
          }
        ],
        backgrounds: [
          {
            id: 'moon',
            type: 'image',
            src: '/static/games/coin-toss/moon.png',
            alt: 'Realistic moon background',
            preload: true
          },
          {
            id: 'starry-sky',
            type: 'image',
            src: '/static/games/coin-toss/starry-sky.jpg',
            alt: 'Starry night sky background',
            preload: true
          },
          {
            id: 'stars-pattern',
            type: 'image',
            src: '/static/games/coin-toss/stars-pattern.svg',
            alt: 'Twinkling stars pattern',
            preload: false
          }
        ],
        sounds: [
          {
            id: 'coin-throw',
            type: 'audio',
            src: '/static/games/coin-toss/sounds/coin-throw.mp3',
            preload: true,
            fallback: '/static/games/coin-toss/sounds/coin-throw.ogg'
          },
          {
            id: 'coin-land',
            type: 'audio',
            src: '/static/games/coin-toss/sounds/coin-land.mp3',
            preload: true,
            fallback: '/static/games/coin-toss/sounds/coin-land.ogg'
          }
        ]
      },
      rps: {
        gestures: [
          {
            id: 'rock-icon',
            type: 'image',
            src: '/static/games/rps/rock-icon.png',
            alt: 'Rock gesture icon',
            preload: true,
            responsive: {
              mobile: '/static/games/rps/mobile/rock-icon.png',
              tablet: '/static/games/rps/tablet/rock-icon.png',
              desktop: '/static/games/rps/rock-icon.png'
            }
          },
          {
            id: 'paper-icon',
            type: 'image',
            src: '/static/games/rps/paper-icon.png',
            alt: 'Paper gesture icon',
            preload: true,
            responsive: {
              mobile: '/static/games/rps/mobile/paper-icon.png',
              tablet: '/static/games/rps/tablet/paper-icon.png',
              desktop: '/static/games/rps/paper-icon.png'
            }
          },
          {
            id: 'scissors-icon',
            type: 'image',
            src: '/static/games/rps/scissors-icon.png',
            alt: 'Scissors gesture icon',
            preload: true,
            responsive: {
              mobile: '/static/games/rps/mobile/scissors-icon.png',
              tablet: '/static/games/rps/tablet/scissors-icon.png',
              desktop: '/static/games/rps/scissors-icon.png'
            }
          },
          {
            id: 'hand-silhouette',
            type: 'image',
            src: '/static/games/rps/hand-silhouette.png',
            alt: 'Hand silhouette for countdown animation',
            preload: true
          }
        ],
        sounds: [
          {
            id: 'countdown',
            type: 'audio',
            src: '/static/games/rps/sounds/countdown.mp3',
            preload: true,
            fallback: '/static/games/rps/sounds/countdown.ogg'
          },
          {
            id: 'reveal',
            type: 'audio',
            src: '/static/games/rps/sounds/reveal.mp3',
            preload: true,
            fallback: '/static/games/rps/sounds/reveal.ogg'
          }
        ]
      }
    };
  }

  private generateCardAssets(): AssetDefinition[] {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cards: AssetDefinition[] = [];

    suits.forEach(suit => {
      values.forEach(value => {
        cards.push({
          id: `card-${suit}-${value}`,
          type: 'image',
          src: `/static/games/blackjack/cards/${suit}/${value}.png`,
          alt: `${value} of ${suit}`,
          preload: false // Cards loaded on demand
        });
      });
    });

    return cards;
  }

  async loadAsset(assetId: string, gameType: string, deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'): Promise<LoadedAsset> {
    const cacheKey = `${gameType}-${assetId}-${deviceType}`;
    
    if (this.loadedAssets.has(cacheKey)) {
      return this.loadedAssets.get(cacheKey)!;
    }

    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    const asset = this.findAsset(assetId, gameType);
    if (!asset) {
      throw new Error(`Asset ${assetId} not found for game ${gameType}`);
    }

    const promise = this.createLoadPromise(asset, deviceType);
    this.loadingPromises.set(cacheKey, promise);

    try {
      const loadedAsset = await promise;
      this.loadedAssets.set(cacheKey, loadedAsset);
      this.loadingPromises.delete(cacheKey);
      return loadedAsset;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  private findAsset(assetId: string, gameType: string): AssetDefinition | null {
    const gameAssets = this.assetDefinitions[gameType];
    if (!gameAssets) return null;

    for (const category of Object.values(gameAssets)) {
      const asset = category.find(a => a.id === assetId);
      if (asset) return asset;
    }

    return null;
  }

  private async createLoadPromise(asset: AssetDefinition, deviceType: string): Promise<LoadedAsset> {
    return new Promise((resolve, reject) => {
      const src = this.getResponsiveSrc(asset, deviceType);
      
      switch (asset.type) {
        case 'image':
          const img = new Image();
          img.onload = () => resolve({ element: img, loaded: true });
          img.onerror = () => {
            if (asset.fallback) {
              const fallbackImg = new Image();
              fallbackImg.onload = () => resolve({ element: fallbackImg, loaded: true });
              fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${src}`));
              fallbackImg.src = asset.fallback;
            } else {
              reject(new Error(`Failed to load image: ${src}`));
            }
          };
          img.src = src;
          break;

        case 'audio':
          const audio = new Audio();
          audio.preload = 'auto';
          audio.oncanplaythrough = () => resolve({ element: audio, loaded: true });
          audio.onerror = () => {
            if (asset.fallback) {
              const fallbackAudio = new Audio();
              fallbackAudio.oncanplaythrough = () => resolve({ element: fallbackAudio, loaded: true });
              fallbackAudio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
              fallbackAudio.src = asset.fallback;
            } else {
              reject(new Error(`Failed to load audio: ${src}`));
            }
          };
          audio.src = src;
          break;

        case 'video':
          const video = document.createElement('video');
          video.preload = 'auto';
          video.oncanplaythrough = () => resolve({ element: video, loaded: true });
          video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
          video.src = src;
          break;

        default:
          reject(new Error(`Unsupported asset type: ${asset.type}`));
      }
    });
  }

  private getResponsiveSrc(asset: AssetDefinition, deviceType: string): string {
    if (asset.responsive && asset.responsive[deviceType as keyof typeof asset.responsive]) {
      return asset.responsive[deviceType as keyof typeof asset.responsive]!;
    }
    return asset.src;
  }

  async preloadGameAssets(gameType: string, deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'): Promise<void> {
    const gameAssets = this.assetDefinitions[gameType];
    if (!gameAssets) {
      throw new Error(`Game type ${gameType} not found`);
    }

    const preloadAssets: AssetDefinition[] = [];
    Object.values(gameAssets).forEach(category => {
      preloadAssets.push(...category.filter(asset => asset.preload));
    });

    const loadPromises = preloadAssets.map(asset => 
      this.loadAsset(asset.id, gameType, deviceType).catch(error => {
        console.warn(`Failed to preload asset ${asset.id}:`, error);
        return null;
      })
    );

    await Promise.allSettled(loadPromises);
  }

  getAsset(assetId: string, gameType: string, deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'): LoadedAsset | null {
    const cacheKey = `${gameType}-${assetId}-${deviceType}`;
    return this.loadedAssets.get(cacheKey) || null;
  }

  getAssetUrl(assetId: string, gameType: string, deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'): string | null {
    const asset = this.findAsset(assetId, gameType);
    if (!asset) return null;
    return this.getResponsiveSrc(asset, deviceType);
  }

  clearCache(gameType?: string): void {
    if (gameType) {
      const keysToDelete = Array.from(this.loadedAssets.keys()).filter(key => key.startsWith(gameType));
      keysToDelete.forEach(key => this.loadedAssets.delete(key));
    } else {
      this.loadedAssets.clear();
    }
  }

  getCacheStats(): { total: number; loaded: number; gameBreakdown: Record<string, number> } {
    const stats = {
      total: this.loadedAssets.size,
      loaded: Array.from(this.loadedAssets.values()).filter(asset => asset.loaded).length,
      gameBreakdown: {} as Record<string, number>
    };

    Array.from(this.loadedAssets.keys()).forEach(key => {
      const gameType = key.split('-')[0];
      stats.gameBreakdown[gameType] = (stats.gameBreakdown[gameType] || 0) + 1;
    });

    return stats;
  }

  // Skeleton/loading state generators
  generateSkeletonCard(): string {
    return `
      <div class="w-16 h-24 bg-nafl-grey-600 rounded-lg animate-pulse border-2 border-nafl-grey-500">
        <div class="p-1">
          <div class="w-3 h-3 bg-nafl-grey-500 rounded mb-1"></div>
          <div class="w-4 h-4 bg-nafl-grey-500 rounded"></div>
        </div>
      </div>
    `;
  }

  generateSkeletonChip(): string {
    return `
      <div class="w-12 h-12 bg-nafl-grey-600 rounded-full animate-pulse border-4 border-nafl-grey-500 flex items-center justify-center">
        <div class="w-6 h-2 bg-nafl-grey-500 rounded"></div>
      </div>
    `;
  }

  generateSkeletonCoin(): string {
    return `
      <div class="w-32 h-32 bg-nafl-grey-600 rounded-full animate-pulse border-4 border-nafl-grey-500 flex items-center justify-center">
        <div class="w-16 h-16 bg-nafl-grey-500 rounded-full"></div>
      </div>
    `;
  }

  // Asset optimization utilities
  optimizeForDevice(deviceType: 'mobile' | 'tablet' | 'desktop'): void {
    // Clear non-essential assets for mobile devices
    if (deviceType === 'mobile') {
      const keysToRemove = Array.from(this.loadedAssets.keys()).filter(key => {
        const asset = this.loadedAssets.get(key);
        return asset && !this.isEssentialForMobile(key);
      });
      
      keysToRemove.forEach(key => this.loadedAssets.delete(key));
    }
  }

  private isEssentialForMobile(assetKey: string): boolean {
    // Keep only essential assets for mobile performance
    const essentialPatterns = [
      'chip-', 'pepe-heads', 'bitcoin-tails', 'rock-icon', 'paper-icon', 'scissors-icon'
    ];
    
    return essentialPatterns.some(pattern => assetKey.includes(pattern));
  }
}

// Singleton instance
export const gameAssetManager = new GameAssetManager();

import { useState, useEffect } from 'react';

// React hook for using the asset manager
export const useGameAssets = (gameType: string, deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await gameAssetManager.preloadGameAssets(gameType, deviceType);
        
        setLoadingProgress(100);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assets');
        setIsLoading(false);
      }
    };

    preloadAssets();
  }, [gameType, deviceType]);

  return {
    isLoading,
    loadingProgress,
    error,
    getAsset: (assetId: string) => gameAssetManager.getAsset(assetId, gameType, deviceType),
    getAssetUrl: (assetId: string) => gameAssetManager.getAssetUrl(assetId, gameType, deviceType),
    loadAsset: (assetId: string) => gameAssetManager.loadAsset(assetId, gameType, deviceType)
  };
};