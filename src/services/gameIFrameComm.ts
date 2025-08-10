// Game IFrame Communication Service
// Handles secure postMessage communication between parent and game iframes

export interface GameMessage {
  type: string;
  payload: any;
  source: 'parent' | 'game';
  timestamp: number;
  messageId: string;
  nonce?: string;
  signature?: string;
}

export interface BetConfirmationData {
  betAmount: string;
  tokenType: string;
  gameType: string;
  sessionId?: string | null;
  playerId: string;
}

export interface GameStateData {
  state: 'loading' | 'ready' | 'playing' | 'paused' | 'completed' | 'error';
  gameType: string;
  sessionId?: string | null;
  data?: any;
}

export interface GameResultData {
  result: 'win' | 'lose' | 'draw';
  gameType: string;
  sessionId?: string | null;
  winAmount?: string;
  details?: any;
}

export type GameMessageHandler = (message: GameMessage) => void;

class GameIFrameCommService {
  private messageHandlers: Map<string, GameMessageHandler[]> = new Map();
  private allowedOrigins: string[] = [];
  private messageQueue: GameMessage[] = [];
  private isInitialized = false;
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
  private securityEvents: Array<{ type: string; data: any; timestamp: number }> = [];
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly RATE_LIMIT_MAX = 100; // Max messages per window

  constructor() {
    this.setupAllowedOrigins();
    this.initializeMessageListener();
  }

  private setupAllowedOrigins() {
    this.allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://naffles.com',
      'https://staging.naffles.com',
      'https://app.naffles.com'
    ];

    // Add custom origins from environment
    const customOrigins = process.env.NEXT_PUBLIC_ALLOWED_IFRAME_ORIGINS;
    if (customOrigins) {
      this.allowedOrigins.push(...customOrigins.split(','));
    }
  }

  private initializeMessageListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleIncomingMessage.bind(this));
      this.isInitialized = true;
    }
  }

  private handleIncomingMessage(event: MessageEvent) {
    // Validate origin in production
    if (process.env.NODE_ENV === 'production' && !this.allowedOrigins.includes(event.origin)) {
      console.warn('GameIFrameComm: Rejected message from unauthorized origin:', event.origin);
      this.logSecurityEvent('unauthorized_origin', { origin: event.origin });
      return;
    }

    try {
      // Validate event data exists
      if (!event.data || typeof event.data !== 'object') {
        console.warn('GameIFrameComm: Invalid event data:', event.data);
        return;
      }

      const message: GameMessage = {
        ...event.data,
        timestamp: Date.now(),
        messageId: this.generateMessageId()
      };

      // Validate message structure
      if (!this.isValidMessage(message)) {
        console.warn('GameIFrameComm: Invalid message structure:', message);
        this.logSecurityEvent('invalid_message_structure', { message });
        return;
      }

      // Rate limiting check
      if (!this.checkRateLimit(message.source)) {
        console.warn('GameIFrameComm: Rate limit exceeded for source:', message.source);
        return;
      }

      // Process message
      this.processMessage(message);
    } catch (error) {
      console.error('GameIFrameComm: Error processing message:', error);
      this.logSecurityEvent('message_processing_error', { error: error.message });
    }
  }

  private isValidMessage(message: any): message is GameMessage {
    return (
      message &&
      typeof message.type === 'string' &&
      message.payload !== undefined &&
      ['parent', 'game'].includes(message.source)
    );
  }

  private processMessage(message: GameMessage) {
    const handlers = this.messageHandlers.get(message.type) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error(`GameIFrameComm: Error in handler for ${message.type}:`, error);
      }
    });

    // Store message in queue for debugging
    this.messageQueue.push(message);
    if (this.messageQueue.length > 100) {
      this.messageQueue.shift();
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateNonce(): string {
    return Math.random().toString(36).substr(2, 16);
  }

  private createMessageSignature(type: string, payload: any, source: string): string {
    // Simple client-side signature (server will do proper verification)
    const message = JSON.stringify({ type, payload, source, timestamp: Date.now() });
    return btoa(message).slice(0, 32);
  }

  private getTargetOrigin(iframe: HTMLIFrameElement): string {
    try {
      const src = iframe.src;
      const url = new URL(src);
      return `${url.protocol}//${url.host}`;
    } catch (error) {
      console.warn('Could not determine iframe origin, using current origin');
      return window.location.origin;
    }
  }

  private getParentOrigin(): string {
    try {
      // Try to get parent origin from document.referrer
      if (document.referrer) {
        const url = new URL(document.referrer);
        return `${url.protocol}//${url.host}`;
      }
      
      // Fallback to allowed origins
      const currentHost = window.location.host;
      if (currentHost.includes('localhost')) {
        return window.location.origin;
      }
      
      // Default to main domain
      return 'https://naffles.com';
    } catch (error) {
      console.warn('Could not determine parent origin, using current origin');
      return window.location.origin;
    }
  }

  private checkRateLimit(source: string): boolean {
    const now = Date.now();
    const key = `${source}_rate_limit`;
    const current = this.rateLimitMap.get(key);

    if (!current || now > current.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW });
      return true;
    }

    if (current.count >= this.RATE_LIMIT_MAX) {
      return false;
    }

    current.count++;
    return true;
  }

  private logSecurityEvent(type: string, data: any): void {
    this.securityEvents.push({
      type,
      data,
      timestamp: Date.now()
    });

    // Keep only last 50 security events
    if (this.securityEvents.length > 50) {
      this.securityEvents.shift();
    }

    // In production, you might want to send these to a security monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.warn(`Security Event [${type}]:`, data);
    }
  }

  // Public API

  /**
   * Send message to game iframe with secure origin validation
   */
  sendToGame(iframe: HTMLIFrameElement, type: string, payload: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (!iframe.contentWindow) {
        console.error('GameIFrameComm: No content window available');
        resolve(false);
        return;
      }

      // Validate payload size (prevent large payloads)
      const payloadSize = JSON.stringify(payload).length;
      if (payloadSize > 100000) { // 100KB limit
        console.error('GameIFrameComm: Payload too large:', payloadSize);
        this.logSecurityEvent('payload_too_large', { type, payloadSize });
        resolve(false);
        return;
      }

      // Create secure message with signature
      const message: GameMessage = {
        type,
        payload,
        source: 'parent',
        timestamp: Date.now(),
        messageId: this.generateMessageId(),
        nonce: this.generateNonce(),
        signature: this.createMessageSignature(type, payload, 'parent')
      };

      try {
        // Use specific origin instead of wildcard
        const targetOrigin = this.getTargetOrigin(iframe);
        iframe.contentWindow.postMessage(message, targetOrigin);
        
        // Add to message queue for tracking
        this.messageQueue.push(message);
        if (this.messageQueue.length > 100) {
          this.messageQueue.shift();
        }
        
        resolve(true);
      } catch (error) {
        console.error('GameIFrameComm: Error sending message to game:', error);
        this.logSecurityEvent('send_message_error', { type, error: error.message });
        resolve(false);
      }
    });
  }

  /**
   * Send message to parent window (from iframe) with secure origin
   */
  sendToParent(type: string, payload: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (!window.parent || window.parent === window) {
        console.error('GameIFrameComm: No parent window available');
        resolve(false);
        return;
      }

      // Validate payload size
      const payloadSize = JSON.stringify(payload).length;
      if (payloadSize > 100000) { // 100KB limit
        console.error('GameIFrameComm: Payload too large:', payloadSize);
        this.logSecurityEvent('payload_too_large', { type, payloadSize });
        resolve(false);
        return;
      }

      // Create secure message with signature
      const message: GameMessage = {
        type,
        payload,
        source: 'game',
        timestamp: Date.now(),
        messageId: this.generateMessageId(),
        nonce: this.generateNonce(),
        signature: this.createMessageSignature(type, payload, 'game')
      };

      try {
        // Use specific parent origin instead of wildcard
        const parentOrigin = this.getParentOrigin();
        window.parent.postMessage(message, parentOrigin);
        
        // Add to message queue for tracking
        this.messageQueue.push(message);
        if (this.messageQueue.length > 100) {
          this.messageQueue.shift();
        }
        
        resolve(true);
      } catch (error) {
        console.error('GameIFrameComm: Error sending message to parent:', error);
        this.logSecurityEvent('send_message_error', { type, error: error.message });
        resolve(false);
      }
    });
  }

  /**
   * Register message handler
   */
  onMessage(type: string, handler: GameMessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    this.messageHandlers.get(type)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Remove all handlers for a message type
   */
  removeHandlers(type: string): void {
    this.messageHandlers.delete(type);
  }

  /**
   * Get message history for debugging
   */
  getMessageHistory(): GameMessage[] {
    return [...this.messageQueue];
  }

  /**
   * Clear message history
   */
  clearMessageHistory(): void {
    this.messageQueue = [];
  }

  // Predefined message types and helpers

  /**
   * Send bet confirmation to game with validation
   */
  async sendBetConfirmation(iframe: HTMLIFrameElement, betData: BetConfirmationData): Promise<boolean> {
    // Validate bet data
    if (!betData.betAmount || !betData.tokenType || !betData.gameType || !betData.playerId) {
      console.error('GameIFrameComm: Invalid bet data:', betData);
      return false;
    }

    // Validate bet amount is a valid number
    const betAmount = parseFloat(betData.betAmount);
    if (isNaN(betAmount) || betAmount <= 0) {
      console.error('GameIFrameComm: Invalid bet amount:', betData.betAmount);
      return false;
    }

    return await this.sendToGame(iframe, 'BET_CONFIRMED', betData);
  }

  /**
   * Send game initialization
   */
  sendGameInitialization(iframe: HTMLIFrameElement, config: any): void {
    this.sendToGame(iframe, 'INITIALIZE_GAME', config);
  }

  /**
   * Send game action
   */
  sendGameAction(iframe: HTMLIFrameElement, action: string, data: any): void {
    this.sendToGame(iframe, 'GAME_ACTION', { action, data });
  }

  /**
   * Request game state
   */
  requestGameState(iframe: HTMLIFrameElement): void {
    this.sendToGame(iframe, 'REQUEST_GAME_STATE', {});
  }

  /**
   * Pause game
   */
  pauseGame(iframe: HTMLIFrameElement): void {
    this.sendToGame(iframe, 'PAUSE_GAME', {});
  }

  /**
   * Resume game
   */
  resumeGame(iframe: HTMLIFrameElement): void {
    this.sendToGame(iframe, 'RESUME_GAME', {});
  }

  /**
   * End game
   */
  endGame(iframe: HTMLIFrameElement): void {
    this.sendToGame(iframe, 'END_GAME', {});
  }

  // From game to parent helpers

  /**
   * Notify parent that game is ready
   */
  notifyGameReady(gameType: string, config?: any): void {
    this.sendToParent('GAME_READY', { gameType, config });
  }

  /**
   * Notify parent of game state change
   */
  notifyGameStateChange(stateData: GameStateData): void {
    this.sendToParent('GAME_STATE_CHANGED', stateData);
  }

  /**
   * Notify parent of game completion
   */
  notifyGameCompleted(resultData: GameResultData): void {
    this.sendToParent('GAME_COMPLETED', resultData);
  }

  /**
   * Notify parent of game error
   */
  notifyGameError(error: string, details?: any): void {
    this.sendToParent('GAME_ERROR', { error, details });
  }

  /**
   * Request bet from parent
   */
  requestBet(gameType: string, minAmount?: string, maxAmount?: string): void {
    this.sendToParent('BET_REQUESTED', { gameType, minAmount, maxAmount });
  }

  /**
   * Request resize
   */
  requestResize(width: number, height: number): void {
    this.sendToParent('RESIZE_REQUEST', { width, height });
  }

  /**
   * Validate origin for security
   */
  isOriginAllowed(origin: string): boolean {
    return this.allowedOrigins.includes(origin);
  }

  /**
   * Add allowed origin
   */
  addAllowedOrigin(origin: string): void {
    if (!this.allowedOrigins.includes(origin)) {
      this.allowedOrigins.push(origin);
    }
  }

  /**
   * Remove allowed origin
   */
  removeAllowedOrigin(origin: string): void {
    const index = this.allowedOrigins.indexOf(origin);
    if (index > -1) {
      this.allowedOrigins.splice(index, 1);
    }
  }

  /**
   * Get connection status and security info
   */
  getConnectionStatus(): {
    isInitialized: boolean;
    allowedOrigins: string[];
    messageCount: number;
    handlerCount: number;
    securityEvents: number;
    rateLimitStatus: Array<{ source: string; count: number; resetTime: number }>;
  } {
    return {
      isInitialized: this.isInitialized,
      allowedOrigins: [...this.allowedOrigins],
      messageCount: this.messageQueue.length,
      handlerCount: Array.from(this.messageHandlers.values()).reduce((sum, handlers) => sum + handlers.length, 0),
      securityEvents: this.securityEvents.length,
      rateLimitStatus: Array.from(this.rateLimitMap.entries()).map(([key, value]) => ({
        source: key,
        count: value.count,
        resetTime: value.resetTime
      }))
    };
  }

  /**
   * Get security events for monitoring
   */
  getSecurityEvents(): Array<{ type: string; data: any; timestamp: number }> {
    return [...this.securityEvents];
  }

  /**
   * Clear security events
   */
  clearSecurityEvents(): void {
    this.securityEvents = [];
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleIncomingMessage.bind(this));
    }
    this.messageHandlers.clear();
    this.messageQueue = [];
    this.rateLimitMap.clear();
    this.securityEvents = [];
    this.isInitialized = false;
  }
}

// Export singleton instance
export const gameIFrameComm = new GameIFrameCommService();

// Export types for external use
export type {
  GameMessage,
  BetConfirmationData,
  GameStateData,
  GameResultData,
  GameMessageHandler
};