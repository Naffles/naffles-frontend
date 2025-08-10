/**
 * Homepage Components - Figma-based component library
 * 
 * This file contains component specifications extracted directly from the
 * Figma homepage design, providing implementation guidelines for components
 * that match the actual Naffles design system.
 */

import { designTokens } from './tokens';

// =============================================================================
// NAFFLES BUTTON COMPONENTS - Based on Figma Homepage
// =============================================================================

export const nafflesButtonStyles = {
  // Base button styles from Figma
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '11px', // From Figma design
    fontFamily: "'Bebas_Neue:Regular', sans-serif", // From Figma
    fontWeight: 'normal',
    textTransform: 'uppercase' as const,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    outline: 'none',
    userSelect: 'none' as const,
  },

  // Size variants from Figma homepage
  sizes: {
    sm: {
      fontSize: '15px',
      lineHeight: '20px',
      padding: '8px 18px',
      height: '32px',
    },
    md: {
      fontSize: '20px',
      lineHeight: '24px',
      padding: '12px 28px',
      height: '48px',
    },
    lg: {
      fontSize: '20px',
      lineHeight: '24px',
      padding: '15px 38px',
      height: '56px',
    },
  },

  // Style variants from Figma homepage
  variants: {
    // Primary Naffles Yellow button (Connect Wallet, Get Started Free)
    primary: {
      backgroundColor: designTokens.colors.naffles.yellow, // #feff3d
      color: '#050100', // Dark text from Figma
      border: '2.088px solid rgba(254,255,61,0.5)',
      states: {
        hover: {
          backgroundColor: '#e6e635',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(254, 255, 61, 0.3)',
        },
        active: {
          backgroundColor: '#d9d930',
          transform: 'translateY(0)',
        },
        disabled: {
          backgroundColor: designTokens.colors.gray[300],
          color: designTokens.colors.gray[500],
          cursor: 'not-allowed',
          border: 'none',
          transform: 'none',
        },
      },
    },
    
    // Secondary dark button (Deposit button style)
    secondary: {
      backgroundColor: designTokens.colors.naffles.darkGrey, // #2a2a2a
      color: designTokens.colors.naffles.yellow,
      border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
      states: {
        hover: {
          backgroundColor: '#3a3a3a',
          boxShadow: '0 4px 12px rgba(42, 42, 42, 0.3)',
        },
        active: {
          backgroundColor: '#1a1a1a',
        },
        disabled: {
          backgroundColor: designTokens.colors.gray[600],
          color: designTokens.colors.gray[400],
          cursor: 'not-allowed',
          border: `1px solid ${designTokens.colors.gray[500]}`,
        },
      },
    },
  },
};

// =============================================================================
// NAFFLES CARD COMPONENTS - Based on Figma Homepage
// =============================================================================

export const nafflesCardStyles = {
  // Base card styles
  base: {
    borderRadius: '15.509px', // From game cards in Figma
    overflow: 'hidden',
    position: 'relative' as const,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Game card variant (from Games section)
  variants: {
    gameCard: {
      backgroundColor: designTokens.colors.naffles.menu, // #1b1b1b
      border: '4.847px solid #292929',
      width: '235px',
      height: '180px',
      boxShadow: '0px 0px 22.065px 0px rgba(0,0,0,0.15)',
      
      gameImage: {
        backgroundColor: '#044c32',
        height: '172px',
        width: '100%',
        position: 'absolute' as const,
        top: '5px',
        left: '0',
        overflow: 'hidden',
      },
      
      gameName: {
        position: 'absolute' as const,
        top: '1px',
        left: '0',
        width: '100%',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("game-name-bg.png")', // From Figma
        
        text: {
          fontFamily: "'Roboto:Bold', sans-serif",
          fontWeight: 'bold',
          fontSize: '9px',
          color: '#ffffff',
          textAlign: 'center' as const,
        },
      },
      
      gameTitle: {
        position: 'absolute' as const,
        bottom: '20px',
        left: '46.25px',
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '14px',
        color: '#ffffff',
        lineHeight: '16.181px',
      },
    },

    // Raffle card variant (from Token/NFT Raffles sections)
    raffleCard: {
      backgroundColor: designTokens.colors.naffles.darkGrey, // #2a2a2a
      border: '2px solid #464646',
      borderRadius: '14.85px',
      width: '148px',
      height: '179px',
      
      prizeImage: {
        width: '83px',
        height: '83px',
        position: 'absolute' as const,
        top: '20px',
        left: '33.22px',
        borderRadius: '8px',
        overflow: 'hidden',
      },
      
      prizeTitle: {
        position: 'absolute' as const,
        bottom: '52px',
        left: '8.22px',
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '12px',
        color: '#ffffff',
        lineHeight: '14px',
      },
      
      prizeValue: {
        position: 'absolute' as const,
        bottom: '52px',
        right: '8.22px',
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '12px',
        color: designTokens.colors.naffles.aqua, // #02b1b1
        lineHeight: '14px',
      },
      
      ticketsInfo: {
        position: 'absolute' as const,
        bottom: '32px',
        left: '9.22px',
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '8px',
        color: '#969696',
        lineHeight: '9px',
      },
      
      priceInfo: {
        position: 'absolute' as const,
        bottom: '12px',
        left: '9.22px',
        display: 'flex',
        alignItems: 'center',
        gap: '4.64px',
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '8px',
        lineHeight: '11px',
      },
    },

    // Allowlist card variant
    allowlistCard: {
      backgroundColor: designTokens.colors.naffles.menu, // #1b1b1b
      border: '4.847px solid #212121',
      borderRadius: '15.509px',
      width: '187px',
      height: '177px',
      
      communityImage: {
        position: 'absolute' as const,
        top: '0',
        left: '0',
        width: '100%',
        height: '101.5px',
        background: 'linear-gradient(to bottom, transparent 75.57%, #1b1b1b 99.708%)',
        overflow: 'hidden',
      },
      
      communityName: {
        position: 'absolute' as const,
        bottom: '52px',
        left: '46.25px',
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '14px',
        color: '#ffffff',
        lineHeight: '16.181px',
      },
      
      liveAllowlists: {
        position: 'absolute' as const,
        bottom: '32px',
        left: '11.68px',
        display: 'flex',
        alignItems: 'center',
        gap: '3.678px',
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '8px',
        color: '#d9d9d9',
      },
      
      entries: {
        position: 'absolute' as const,
        bottom: '12px',
        left: '11.68px',
        display: 'flex',
        alignItems: 'center',
        gap: '3.678px',
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '8px',
        color: '#d9d9d9',
      },
    },
  },
};

// =============================================================================
// NAFFLES NAVIGATION COMPONENTS - Based on Figma Homepage
// =============================================================================

export const nafflesNavigationStyles = {
  // Top navbar (from homepage)
  topNavbar: {
    height: '39px',
    backgroundColor: designTokens.colors.naffles.menu, // #1b1b1b
    width: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
    
    logo: {
      position: 'absolute' as const,
      left: '37px',
      top: '7px',
      width: '54px',
      height: '25px',
      backgroundColor: designTokens.colors.naffles.darkGrey,
      border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
      borderRadius: '3px',
      padding: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    rightNav: {
      position: 'absolute' as const,
      right: '13px',
      top: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      
      notifications: {
        width: '25px',
        height: '25px',
        backgroundColor: designTokens.colors.naffles.darkGrey,
        border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
        
        badge: {
          position: 'absolute' as const,
          top: '-2px',
          right: '-2px',
          width: '13px',
          height: '13px',
          backgroundColor: '#ff4444',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#ffffff',
          fontFamily: "'Roboto:Regular', sans-serif",
        },
      },
      
      wallet: {
        width: '25px',
        height: '25px',
        backgroundColor: designTokens.colors.naffles.darkGrey,
        border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },

  // Side menu (from homepage)
  sideMenu: {
    width: '150px',
    height: '600px',
    backgroundColor: designTokens.colors.naffles.menu, // #1b1b1b
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    
    item: {
      height: '35px',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: designTokens.colors.naffles.menu,
      
      icon: {
        width: '16px',
        height: '16px',
        flexShrink: 0,
      },
      
      text: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '14px',
        lineHeight: '22px',
        color: '#ffffff', // Active item
        
        inactive: {
          color: '#8c8c8c', // Inactive items
        },
      },
      
      states: {
        hover: {
          backgroundColor: '#2a2a2a',
        },
        active: {
          backgroundColor: '#333333',
          borderLeft: `3px solid ${designTokens.colors.naffles.yellow}`,
        },
      },
    },
  },
};

// =============================================================================
// NAFFLES SECTION COMPONENTS - Based on Figma Homepage
// =============================================================================

export const nafflesSectionStyles = {
  // Top banner section
  topBanner: {
    height: '314px',
    width: '100%',
    position: 'relative' as const,
    overflow: 'hidden',
    
    backgroundImage: {
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    
    content: {
      position: 'absolute' as const,
      left: '117px',
      top: '51px',
      zIndex: 2,
      
      subtitle: {
        fontFamily: "'Roboto_Condensed:Regular', sans-serif",
        fontSize: '14px',
        color: '#ffffff',
        marginBottom: '8px',
      },
      
      title: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '32px',
        color: '#ffffff',
        lineHeight: '34px',
        marginBottom: '8px',
      },
      
      highlight: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '80px',
        color: designTokens.colors.naffles.yellow, // #fbfc4e
        lineHeight: '64px',
        marginBottom: '20px',
      },
      
      features: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '20px',
        
        item: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          
          icon: {
            width: '24px',
            height: '24px',
          },
          
          text: {
            fontFamily: "'Bebas_Neue:Regular', sans-serif",
            fontSize: '14px',
            color: '#ffffff',
          },
        },
      },
    },
    
    connectButton: {
      position: 'absolute' as const,
      left: '118px',
      bottom: '68px',
      zIndex: 2,
    },
  },

  // Content sections
  contentSection: {
    padding: '30px 71px',
    backgroundColor: designTokens.colors.naffles.menu, // #1b1b1b
    
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '41px',
      
      title: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        
        icon: {
          width: '24px',
          height: '24px',
        },
        
        text: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '24px',
          color: '#ffffff',
          lineHeight: '22px',
        },
      },
      
      showAll: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        
        text: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '12px',
          color: '#ffffff',
        },
        
        arrows: {
          display: 'flex',
          gap: '4px',
          
          arrow: {
            width: '16px',
            height: '16px',
            border: '1px solid #c4c4c4',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            
            states: {
              hover: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
        },
      },
    },
    
    cardGrid: {
      display: 'flex',
      gap: '11.768px',
      overflowX: 'auto',
      paddingBottom: '10px',
      
      // Hide scrollbar but keep functionality
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const,
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },

  // Crypto support section
  cryptoSection: {
    height: '173px',
    borderRadius: '15px',
    background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.7) 100%), linear-gradient(100.119deg, rgb(220, 42, 191) 0.47708%, rgb(118, 23, 103) 45.468%)',
    padding: '22px 56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative' as const,
    overflow: 'hidden',
    
    content: {
      zIndex: 2,
      
      subtitle: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '24px',
        color: '#ffffff',
        lineHeight: '22px',
      },
      
      title: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '48px',
        color: '#ffffff',
        lineHeight: '43px',
        margin: '8px 0',
      },
      
      description: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '24px',
        color: '#ffffff',
        lineHeight: '22px',
        marginBottom: '20px',
      },
      
      button: {
        // Uses primary button style
      },
    },
    
    cryptoIcons: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '30px',
      zIndex: 2,
      
      row: {
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
        
        icon: {
          width: '24px',
          height: '24px',
          flexShrink: 0,
        },
      },
    },
    
    requestText: {
      position: 'absolute' as const,
      bottom: '37px',
      right: '56px',
      fontSize: '12px',
      zIndex: 2,
      
      normal: {
        fontFamily: "'Roboto:Regular', sans-serif",
        color: '#969696',
      },
      
      link: {
        fontFamily: "'Roboto:Bold', sans-serif",
        color: '#ffffff',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

// =============================================================================
// NAFFLES FOOTER COMPONENT - Based on Figma Homepage
// =============================================================================

export const nafflesFooterStyles = {
  container: {
    height: '212.347px',
    backgroundColor: '#181818',
    padding: '36px 72px',
    position: 'relative' as const,
    overflow: 'hidden',
    
    logo: {
      position: 'absolute' as const,
      left: '72.51px',
      top: '36.25px',
      width: '248.601px',
      height: '84.347px',
    },
    
    licenseIcon: {
      position: 'absolute' as const,
      left: '381.04px',
      top: '65.11px',
      width: '55.491px',
      height: '55.491px',
    },
    
    legalText: {
      position: 'absolute' as const,
      left: '447.63px',
      top: '88.79px',
      width: '783.538px',
      fontFamily: "'Roboto:Regular', sans-serif",
      fontSize: '16px',
      color: '#ffffff',
      lineHeight: '24px',
      
      links: {
        color: '#ffffff',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
    
    copyright: {
      position: 'absolute' as const,
      left: '189.41px',
      bottom: '28px',
      fontFamily: "'Bebas_Neue:Regular', sans-serif",
      fontSize: '16.28px',
      color: '#626262',
      lineHeight: '42.173px',
    },
    
    policies: {
      position: 'absolute' as const,
      right: '72px',
      bottom: '28px',
      fontFamily: "'Bebas_Neue:Regular', sans-serif",
      fontSize: '16.28px',
      color: '#595959',
      lineHeight: '42.173px',
      textAlign: 'right' as const,
    },
  },
};

// =============================================================================
// EXPORT ALL NAFFLES COMPONENTS
// =============================================================================

export const nafflesComponents = {
  buttons: nafflesButtonStyles,
  cards: nafflesCardStyles,
  navigation: nafflesNavigationStyles,
  sections: nafflesSectionStyles,
  footer: nafflesFooterStyles,
};

export default nafflesComponents;