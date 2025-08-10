// Mock API service for demo purposes when backend is not running
interface MockGameResponse {
  data: {
    result: 'win' | 'lose' | 'draw';
    score: number;
    playerHand?: any[];
    dealerHand?: any[];
    playerValue?: number;
    dealerValue?: number;
    canHit?: boolean;
    canStand?: boolean;
    canDouble?: boolean;
    canSplit?: boolean;
    gameStatus?: string;
    houseChoice?: 'rock' | 'paper' | 'scissors';
  };
}

class MockGameAPI {
  private isEnabled: boolean;
  private requestCount: number = 0;
  private readonly RATE_LIMIT = 10; // Max requests per minute for demo

  constructor() {
    // Enable mock API when backend is not available
    this.isEnabled = !process.env.NEXT_PUBLIC_ENDPOINT || process.env.NODE_ENV === 'development';
  }

  private simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 300 + Math.random() * 700); // 300-1000ms delay
    });
  }

  private checkRateLimit(): void {
    this.requestCount++;
    if (this.requestCount > this.RATE_LIMIT) {
      throw {
        response: {
          data: {
            statusCode: 429,
            message: 'Rate limit exceeded. Please wait before playing again.'
          }
        }
      };
    }
    
    // Reset counter after 1 minute
    setTimeout(() => {
      this.requestCount = Math.max(0, this.requestCount - 1);
    }, 60000);
  }

  async mockCoinToss(choice?: string): Promise<MockGameResponse> {
    if (!this.isEnabled) throw new Error('Mock API not enabled');
    
    await this.simulateNetworkDelay();
    this.checkRateLimit();

    const outcomes = ['heads', 'tails'];
    const actualResult = outcomes[Math.floor(Math.random() * outcomes.length)];
    const isWin = choice === actualResult;
    
    return {
      data: {
        result: isWin ? 'win' : 'lose',
        score: isWin ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10),
        houseChoice: actualResult as any
      }
    };
  }

  async mockRockPaperScissors(choice?: string): Promise<MockGameResponse> {
    if (!this.isEnabled) throw new Error('Mock API not enabled');
    
    await this.simulateNetworkDelay();
    this.checkRateLimit();

    const choices = ['rock', 'paper', 'scissors'];
    const houseChoice = choices[Math.floor(Math.random() * choices.length)] as 'rock' | 'paper' | 'scissors';
    
    let result: 'win' | 'lose' | 'draw';
    
    if (choice === houseChoice) {
      result = 'draw';
    } else if (
      (choice === 'rock' && houseChoice === 'scissors') ||
      (choice === 'paper' && houseChoice === 'rock') ||
      (choice === 'scissors' && houseChoice === 'paper')
    ) {
      result = 'win';
    } else {
      result = 'lose';
    }

    return {
      data: {
        result,
        score: result === 'win' ? Math.floor(Math.random() * 30) + 15 : 
               result === 'draw' ? Math.floor(Math.random() * 10) + 5 : 
               Math.floor(Math.random() * 5),
        houseChoice
      }
    };
  }

  async mockBlackjack(action: string, gameData?: any): Promise<MockGameResponse> {
    if (!this.isEnabled) throw new Error('Mock API not enabled');
    
    await this.simulateNetworkDelay();
    this.checkRateLimit();

    // Generate mock cards with proper values
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    const generateCard = () => {
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      
      let numericValue: number;
      if (value === 'A') {
        numericValue = 11; // Will be adjusted for aces later
      } else if (['J', 'Q', 'K'].includes(value)) {
        numericValue = 10;
      } else {
        numericValue = parseInt(value);
      }
      
      return { suit, value, numericValue };
    };

    const calculateHandValue = (hand: any[]) => {
      let value = 0;
      let aces = 0;
      
      for (let card of hand) {
        if (card.value === 'A') {
          aces++;
          value += 11;
        } else {
          value += card.numericValue;
        }
      }
      
      // Adjust for aces
      while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
      }
      
      return value;
    };

    // For the React component, we'll mainly use this for fallback
    // The actual game logic is now handled in the component itself
    const playerHand = [generateCard(), generateCard()];
    const dealerHand = [generateCard(), generateCard()];
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);
    const isWin = Math.random() > 0.4; // 60% win rate for demo

    return {
      data: {
        result: isWin ? 'win' : 'lose',
        score: isWin ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 20),
        playerHand,
        dealerHand,
        playerValue,
        dealerValue,
        canHit: playerValue < 21,
        canStand: true,
        canDouble: playerHand.length === 2 && playerValue < 21,
        canSplit: playerHand[0].value === playerHand[1].value,
        gameStatus: 'playing'
      }
    };
  }

  isAPIEnabled(): boolean {
    return this.isEnabled;
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  resetRateLimit(): void {
    this.requestCount = 0;
  }
}

export const mockGameAPI = new MockGameAPI();

// Axios interceptor to catch failed requests and use mock API
export const setupMockInterceptor = (axiosInstance: any) => {
  axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const { config } = error;
      
      // Only mock game API calls
      if (!config.url?.includes('/game/demo/') || !mockGameAPI.isAPIEnabled()) {
        return Promise.reject(error);
      }

      console.log('🎮 Using mock API for:', config.url);

      try {
        if (config.url.includes('/game/demo/cointoss')) {
          const choice = config.data ? JSON.parse(config.data).choice : undefined;
          return await mockGameAPI.mockCoinToss(choice);
        }
        
        if (config.url.includes('/game/demo/rock-paper-scissors')) {
          const choice = config.data ? JSON.parse(config.data).choice : undefined;
          return await mockGameAPI.mockRockPaperScissors(choice);
        }
        
        if (config.url.includes('/game/demo/blackjack')) {
          const requestData = config.data ? JSON.parse(config.data) : {};
          return await mockGameAPI.mockBlackjack(requestData.action || 'start', requestData);
        }
      } catch (mockError) {
        console.error('Mock API error:', mockError);
        return Promise.reject(mockError);
      }

      return Promise.reject(error);
    }
  );
};