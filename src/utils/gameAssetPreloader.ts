interface AssetPreloadConfig {
  images: string[];
  videos?: string[];
  sounds?: string[];
}

interface PreloadResult {
  loaded: number;
  total: number;
  progress: number;
  completed: boolean;
  errors: string[];
}

class GameAssetPreloader {
  private loadedAssets: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.loadedAssets.has(src)) {
      return this.loadedAssets.get(src);
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.set(src, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  async preloadVideo(src: string): Promise<HTMLVideoElement> {
    if (this.loadedAssets.has(src)) {
      return this.loadedAssets.get(src);
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise<HTMLVideoElement>((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.oncanplaythrough = () => {
        this.loadedAssets.set(src, video);
        resolve(video);
      };
      video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
      video.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  async preloadSound(src: string): Promise<HTMLAudioElement> {
    if (this.loadedAssets.has(src)) {
      return this.loadedAssets.get(src);
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.oncanplaythrough = () => {
        this.loadedAssets.set(src, audio);
        resolve(audio);
      };
      audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
      audio.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  async preloadAssets(config: AssetPreloadConfig, onProgress?: (result: PreloadResult) => void): Promise<PreloadResult> {
    const allAssets = [
      ...config.images,
      ...(config.videos || []),
      ...(config.sounds || [])
    ];

    const result: PreloadResult = {
      loaded: 0,
      total: allAssets.length,
      progress: 0,
      completed: false,
      errors: []
    };

    const promises = [
      ...config.images.map(src => this.preloadImage(src).catch(err => {
        result.errors.push(err.message);
        return null;
      })),
      ...(config.videos || []).map(src => this.preloadVideo(src).catch(err => {
        result.errors.push(err.message);
        return null;
      })),
      ...(config.sounds || []).map(src => this.preloadSound(src).catch(err => {
        result.errors.push(err.message);
        return null;
      }))
    ];

    // Track progress
    let completed = 0;
    promises.forEach(promise => {
      promise.then(() => {
        completed++;
        result.loaded = completed;
        result.progress = (completed / result.total) * 100;
        onProgress?.(result);
      });
    });

    await Promise.allSettled(promises);
    
    result.completed = true;
    result.progress = 100;
    onProgress?.(result);

    return result;
  }

  getAsset(src: string): any {
    return this.loadedAssets.get(src);
  }

  clearCache(): void {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }
}

// Game-specific asset configurations
export const BLACKJACK_ASSETS: AssetPreloadConfig = {
  images: [
    '/static/games/blackjack/table-bg.jpg',
    '/static/games/blackjack/card-back.png',
    '/static/games/blackjack/chips/chip-10.png',
    '/static/games/blackjack/chips/chip-25.png',
    '/static/games/blackjack/chips/chip-50.png',
    '/static/games/blackjack/chips/chip-100.png'
  ],
  sounds: [
    '/static/games/blackjack/card-deal.mp3',
    '/static/games/blackjack/chip-place.mp3',
    '/static/games/blackjack/win.mp3',
    '/static/games/blackjack/lose.mp3'
  ]
};

export const COIN_TOSS_ASSETS: AssetPreloadConfig = {
  images: [
    '/static/games/coin-toss/pepe-heads.png',
    '/static/games/coin-toss/bitcoin-tails.png',
    '/static/games/coin-toss/moon.png',
    '/static/games/coin-toss/stars-bg.jpg'
  ],
  sounds: [
    '/static/games/coin-toss/coin-throw.mp3',
    '/static/games/coin-toss/coin-land.mp3'
  ]
};

export const RPS_ASSETS: AssetPreloadConfig = {
  images: [
    '/static/games/rps/rock-icon.png',
    '/static/games/rps/paper-icon.png',
    '/static/games/rps/scissors-icon.png',
    '/static/games/rps/hand-silhouette.png'
  ],
  sounds: [
    '/static/games/rps/countdown.mp3',
    '/static/games/rps/reveal.mp3'
  ]
};

export const gameAssetPreloader = new GameAssetPreloader();

// Hook for using the preloader in components
export const useGameAssetPreloader = () => {
  return {
    preloadAssets: gameAssetPreloader.preloadAssets.bind(gameAssetPreloader),
    getAsset: gameAssetPreloader.getAsset.bind(gameAssetPreloader),
    clearCache: gameAssetPreloader.clearCache.bind(gameAssetPreloader)
  };
};