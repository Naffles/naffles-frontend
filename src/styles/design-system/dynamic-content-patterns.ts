/**
 * Dynamic Content Patterns - Data mapping and state variations
 * 
 * This file contains patterns for dynamic content based on the Figma homepage
 * design, providing guidelines for how dynamic data should be displayed,
 * including loading states, empty states, and error handling.
 */

import { designTokens } from './tokens';

// =============================================================================
// COMPONENT NAMING CONVENTIONS - For Figma mapping
// =============================================================================

export const componentNaming = {
  // Template components (for individual dynamic items)
  templates: {
    gameCard: 'GameCard-Template',
    raffleCard: 'RaffleCard-Template',
    allowlistCard: 'AllowlistCard-Template',
    communityCard: 'CommunityCard-Template',
    userCard: 'UserCard-Template',
    transactionItem: 'TransactionItem-Template',
    notificationItem: 'NotificationItem-Template',
  },
  
  // Container components (for layout containers)
  containers: {
    gameGrid: 'GameGrid-Container',
    raffleGrid: 'RaffleGrid-Container',
    allowlistGrid: 'AllowlistGrid-Container',
    communityList: 'CommunityList-Container',
    userList: 'UserList-Container',
    transactionList: 'TransactionList-Container',
  },
  
  // State components (for different scenarios)
  states: {
    loading: 'Component-LoadingState',
    empty: 'Component-EmptyState',
    error: 'Component-ErrorState',
    success: 'Component-SuccessState',
  },
};

// =============================================================================
// DATA MAPPING PATTERNS - From Figma to dynamic content
// =============================================================================

export const dataMappingPatterns = {
  // Game card data mapping
  gameCard: {
    // Static elements from Figma
    structure: {
      width: '235px',
      height: '180px',
      borderRadius: '15.509px',
      border: '4.847px solid #292929',
    },
    
    // Dynamic data mappings
    data: {
      gameId: '{{game.id}}',
      gameName: '{{game.name}}', // Maps to game title text
      gameImage: '{{game.imageUrl}}', // Maps to background image
      gameType: '{{game.type}}', // e.g., 'slots', 'blackjack', 'coin-toss'
      isActive: '{{game.isActive}}', // Boolean for availability
      playerCount: '{{game.currentPlayers}}', // Current active players
    },
    
    // State variations
    states: {
      active: {
        border: '4.847px solid #292929',
        opacity: 1,
        cursor: 'pointer',
      },
      inactive: {
        border: '4.847px solid #464646',
        opacity: 0.6,
        cursor: 'not-allowed',
      },
      loading: {
        backgroundColor: '#1b1b1b',
        backgroundImage: 'linear-gradient(90deg, #1b1b1b 25%, #2a2a2a 50%, #1b1b1b 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      },
    },
  },

  // Raffle card data mapping (Token Raffles)
  tokenRaffleCard: {
    structure: {
      width: '148px',
      height: '179px',
      borderRadius: '14.85px',
      backgroundColor: '#2a2a2a',
      border: '2px solid #464646',
    },
    
    data: {
      raffleId: '{{raffle.id}}',
      tokenSymbol: '{{raffle.prize.tokenSymbol}}', // e.g., 'USDT', 'ETH'
      tokenAmount: '{{raffle.prize.amount}}', // e.g., '1,000'
      ticketsLeft: '{{raffle.ticketsRemaining}}', // e.g., '69'
      totalTickets: '{{raffle.totalTickets}}', // e.g., '23,000'
      ticketPrice: '{{raffle.ticketPrice}}', // e.g., '0.005'
      ticketCurrency: '{{raffle.ticketCurrency}}', // e.g., 'ETH'
      usdPrice: '{{raffle.ticketPriceUSD}}', // e.g., '~$16 USD'
      endDate: '{{raffle.endDate}}',
      status: '{{raffle.status}}', // 'active', 'ended', 'upcoming'
    },
    
    states: {
      active: {
        border: '2px solid #464646',
        opacity: 1,
      },
      ending: {
        border: '2px solid #feff3d',
        boxShadow: '0 0 12px rgba(254, 255, 61, 0.3)',
      },
      ended: {
        border: '2px solid #666666',
        opacity: 0.7,
        '&::after': {
          content: '"ENDED"',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
    },
  },

  // NFT Raffle card data mapping
  nftRaffleCard: {
    structure: {
      width: '148px',
      height: '179px',
      borderRadius: '14.85px',
      backgroundColor: '#000000',
      border: '2px solid #464646',
    },
    
    data: {
      raffleId: '{{raffle.id}}',
      nftName: '{{raffle.prize.nftName}}', // e.g., 'Bored Ape Yacht Club'
      nftId: '{{raffle.prize.nftId}}', // e.g., '#9419'
      nftImage: '{{raffle.prize.nftImageUrl}}',
      collectionName: '{{raffle.prize.collectionName}}',
      ticketsLeft: '{{raffle.ticketsRemaining}}',
      totalTickets: '{{raffle.totalTickets}}',
      ticketPrice: '{{raffle.ticketPrice}}',
      ticketCurrency: '{{raffle.ticketCurrency}}',
      usdPrice: '{{raffle.ticketPriceUSD}}',
      endDate: '{{raffle.endDate}}',
      status: '{{raffle.status}}',
    },
    
    states: {
      active: {
        border: '2px solid #464646',
        opacity: 1,
      },
      featured: {
        border: '2px solid #dc2abf',
        boxShadow: '0 0 16px rgba(220, 42, 191, 0.4)',
      },
      soldOut: {
        opacity: 0.6,
        '&::after': {
          content: '"SOLD OUT"',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 68, 68, 0.9)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
    },
  },

  // Allowlist card data mapping
  allowlistCard: {
    structure: {
      width: '187px',
      height: '177px',
      borderRadius: '15.509px',
      backgroundColor: '#1b1b1b',
      border: '4.847px solid #212121',
    },
    
    data: {
      allowlistId: '{{allowlist.id}}',
      communityName: '{{allowlist.community.name}}',
      communityImage: '{{allowlist.community.imageUrl}}',
      liveAllowlists: '{{allowlist.community.liveAllowlistCount}}', // e.g., '4'
      totalEntries: '{{allowlist.totalEntries}}', // e.g., '169,691'
      entryPrice: '{{allowlist.entryPrice}}',
      entryCurrency: '{{allowlist.entryCurrency}}',
      endDate: '{{allowlist.endDate}}',
      status: '{{allowlist.status}}',
      requirements: '{{allowlist.requirements}}', // Array of requirement objects
    },
    
    states: {
      active: {
        border: '4.847px solid #212121',
        opacity: 1,
      },
      featured: {
        border: '4.847px solid #feff3d',
        boxShadow: '0 0 16px rgba(254, 255, 61, 0.3)',
      },
      closed: {
        opacity: 0.6,
        filter: 'grayscale(50%)',
      },
    },
  },
};

// =============================================================================
// CONTAINER LAYOUT PATTERNS - For dynamic content grids
// =============================================================================

export const containerPatterns = {
  // Games section container (from homepage)
  gamesContainer: {
    structure: {
      width: '982px',
      height: '218px',
      display: 'flex',
      gap: '11.768px',
      overflowX: 'auto',
      padding: '0',
      boxShadow: '0px 0px 22.065px 0px rgba(0,0,0,0.15)',
    },
    
    // Responsive behavior
    responsive: {
      mobile: {
        width: '100%',
        gap: '8px',
        padding: '0 16px',
      },
      tablet: {
        width: '100%',
        gap: '10px',
        padding: '0 24px',
      },
    },
    
    // Scroll behavior
    scrolling: {
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    
    // Loading state
    loading: {
      display: 'flex',
      gap: '11.768px',
      children: Array(4).fill({
        width: '235px',
        height: '180px',
        backgroundColor: '#2a2a2a',
        borderRadius: '15.509px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }),
    },
    
    // Empty state
    empty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '180px',
      backgroundColor: '#2a2a2a',
      borderRadius: '15.509px',
      border: '2px dashed #464646',
      
      content: {
        textAlign: 'center',
        color: '#969696',
        
        icon: {
          fontSize: '48px',
          marginBottom: '16px',
          opacity: 0.5,
        },
        
        title: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '18px',
          marginBottom: '8px',
        },
        
        description: {
          fontFamily: "'Roboto:Regular', sans-serif",
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
    },
  },

  // Raffles container (Token/NFT)
  rafflesContainer: {
    structure: {
      width: '977px',
      display: 'flex',
      gap: '17.612px',
      overflowX: 'auto',
      padding: '0',
      boxShadow: '0px 0px 22.064px 0px rgba(0,0,0,0.15)',
    },
    
    responsive: {
      mobile: {
        width: '100%',
        gap: '12px',
        padding: '0 16px',
      },
      tablet: {
        width: '100%',
        gap: '16px',
        padding: '0 24px',
      },
    },
    
    loading: {
      display: 'flex',
      gap: '17.612px',
      children: Array(6).fill({
        width: '148px',
        height: '179px',
        backgroundColor: '#2a2a2a',
        borderRadius: '14.85px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }),
    },
    
    empty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '179px',
      backgroundColor: '#2a2a2a',
      borderRadius: '14.85px',
      border: '2px dashed #464646',
      
      content: {
        textAlign: 'center',
        color: '#969696',
        
        title: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '16px',
          marginBottom: '8px',
        },
        
        description: {
          fontFamily: "'Roboto:Regular', sans-serif",
          fontSize: '12px',
          lineHeight: '16px',
        },
      },
    },
  },

  // Allowlists container
  allowlistsContainer: {
    structure: {
      width: '982px',
      display: 'flex',
      gap: '11.768px',
      overflowX: 'auto',
      padding: '0',
      boxShadow: '0px 0px 22.065px 0px rgba(0,0,0,0.15)',
    },
    
    responsive: {
      mobile: {
        width: '100%',
        gap: '8px',
        padding: '0 16px',
      },
      tablet: {
        width: '100%',
        gap: '10px',
        padding: '0 24px',
      },
    },
    
    loading: {
      display: 'flex',
      gap: '11.768px',
      children: Array(5).fill({
        width: '187px',
        height: '177px',
        backgroundColor: '#2a2a2a',
        borderRadius: '15.509px',
        animation: 'pulse 1.5s ease-in-out infinite',
      }),
    },
    
    empty: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '177px',
      backgroundColor: '#2a2a2a',
      borderRadius: '15.509px',
      border: '2px dashed #464646',
      
      content: {
        textAlign: 'center',
        color: '#969696',
        
        title: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '16px',
          marginBottom: '8px',
        },
        
        description: {
          fontFamily: "'Roboto:Regular', sans-serif",
          fontSize: '12px',
          lineHeight: '16px',
        },
      },
    },
  },
};

// =============================================================================
// STATE VARIATIONS - Loading, empty, error states
// =============================================================================

export const stateVariations = {
  // Loading states
  loading: {
    // Skeleton loader for cards
    cardSkeleton: {
      backgroundColor: '#2a2a2a',
      borderRadius: '15px',
      overflow: 'hidden',
      position: 'relative',
      
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        animation: 'shimmer 1.5s infinite',
      },
      
      elements: {
        image: {
          width: '100%',
          height: '60%',
          backgroundColor: '#464646',
          marginBottom: '12px',
        },
        
        title: {
          width: '80%',
          height: '16px',
          backgroundColor: '#464646',
          borderRadius: '4px',
          marginBottom: '8px',
        },
        
        subtitle: {
          width: '60%',
          height: '12px',
          backgroundColor: '#464646',
          borderRadius: '4px',
          marginBottom: '8px',
        },
        
        details: {
          width: '90%',
          height: '10px',
          backgroundColor: '#464646',
          borderRadius: '4px',
        },
      },
    },
    
    // Spinner for inline loading
    spinner: {
      width: '24px',
      height: '24px',
      border: '2px solid #464646',
      borderTop: '2px solid #feff3d',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    
    // Progress bar for longer operations
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#464646',
      borderRadius: '2px',
      overflow: 'hidden',
      
      fill: {
        height: '100%',
        backgroundColor: '#feff3d',
        borderRadius: '2px',
        transition: 'width 0.3s ease',
      },
    },
  },

  // Empty states
  empty: {
    // No games available
    noGames: {
      icon: '🎮',
      title: 'No Games Available',
      description: 'Check back later for new games to play.',
      action: {
        text: 'Refresh',
        onClick: '{{refreshGames}}',
      },
    },
    
    // No raffles available
    noRaffles: {
      icon: '🎫',
      title: 'No Raffles Available',
      description: 'Be the first to create a raffle or check back later.',
      action: {
        text: 'Create Raffle',
        onClick: '{{createRaffle}}',
      },
    },
    
    // No allowlists available
    noAllowlists: {
      icon: '📋',
      title: 'No Allowlists Available',
      description: 'No active allowlists at the moment.',
      action: {
        text: 'Create Allowlist',
        onClick: '{{createAllowlist}}',
      },
    },
    
    // Search no results
    noSearchResults: {
      icon: '🔍',
      title: 'No Results Found',
      description: 'Try adjusting your search terms or filters.',
      action: {
        text: 'Clear Filters',
        onClick: '{{clearFilters}}',
      },
    },
  },

  // Error states
  error: {
    // Network error
    networkError: {
      icon: '🌐',
      title: 'Connection Error',
      description: 'Unable to load content. Please check your connection.',
      action: {
        text: 'Retry',
        onClick: '{{retry}}',
      },
    },
    
    // Server error
    serverError: {
      icon: '⚠️',
      title: 'Server Error',
      description: 'Something went wrong on our end. Please try again.',
      action: {
        text: 'Retry',
        onClick: '{{retry}}',
      },
    },
    
    // Permission error
    permissionError: {
      icon: '🔒',
      title: 'Access Denied',
      description: 'You don\'t have permission to view this content.',
      action: {
        text: 'Go Back',
        onClick: '{{goBack}}',
      },
    },
    
    // Not found error
    notFoundError: {
      icon: '❓',
      title: 'Content Not Found',
      description: 'The content you\'re looking for doesn\'t exist.',
      action: {
        text: 'Go Home',
        onClick: '{{goHome}}',
      },
    },
  },

  // Success states
  success: {
    // Action completed
    actionCompleted: {
      icon: '✅',
      title: 'Success!',
      description: 'Your action was completed successfully.',
      autoHide: true,
      duration: 3000,
    },
    
    // Data saved
    dataSaved: {
      icon: '💾',
      title: 'Saved',
      description: 'Your changes have been saved.',
      autoHide: true,
      duration: 2000,
    },
    
    // Transaction confirmed
    transactionConfirmed: {
      icon: '🎉',
      title: 'Transaction Confirmed',
      description: 'Your transaction has been processed successfully.',
      action: {
        text: 'View Details',
        onClick: '{{viewTransaction}}',
      },
    },
  },
};

// =============================================================================
// ANIMATION PATTERNS - For state transitions
// =============================================================================

export const animationPatterns = {
  // Keyframe animations
  keyframes: {
    shimmer: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
    
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    
    spin: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    
    fadeIn: {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    
    slideIn: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
  },
  
  // Transition patterns
  transitions: {
    // Card hover effect
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.2s ease-in-out',
    },
    
    // Button press effect
    buttonPress: {
      transform: 'translateY(1px)',
      transition: 'transform 0.1s ease-in-out',
    },
    
    // Smooth color transition
    colorTransition: {
      transition: 'color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    },
    
    // Scale effect
    scaleHover: {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s ease-in-out',
    },
  },
};

// =============================================================================
// EXPORT ALL PATTERNS
// =============================================================================

export const dynamicContentPatterns = {
  naming: componentNaming,
  dataMapping: dataMappingPatterns,
  containers: containerPatterns,
  states: stateVariations,
  animations: animationPatterns,
};

export default dynamicContentPatterns;