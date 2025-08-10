/**
 * Page Templates - Layout templates based on Figma homepage design
 * 
 * This file contains page template specifications extracted from the
 * Figma homepage design, providing consistent layout patterns for
 * different types of pages in the Naffles platform.
 */

import { designTokens } from './tokens';

// =============================================================================
// HOMEPAGE TEMPLATE - Primary design reference
// =============================================================================

export const homepageTemplate = {
  // Overall page structure
  structure: {
    width: '1280px',
    height: '1987px',
    backgroundColor: designTokens.colors.naffles.menu, // #1b1b1b
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
  },

  // Top navbar section
  topNavbar: {
    height: '39px',
    width: '100%',
    backgroundColor: designTokens.colors.naffles.menu,
    position: 'relative' as const,
    zIndex: 10,
    borderBottom: '1px solid #2a2a2a',
  },

  // Main content area
  mainContent: {
    display: 'flex',
    flex: 1,
    position: 'relative' as const,
    
    // Side navigation
    sideNav: {
      width: '150px',
      height: '100%',
      backgroundColor: designTokens.colors.naffles.menu,
      position: 'fixed' as const,
      left: 0,
      top: '39px',
      zIndex: 5,
      borderRight: '1px solid #2a2a2a',
    },
    
    // Content area
    content: {
      marginLeft: '150px',
      width: '1130px',
      position: 'relative' as const,
      
      // Top banner
      topBanner: {
        height: '314px',
        width: '100%',
        position: 'relative' as const,
        marginTop: '-58px', // Overlap with navbar
      },
      
      // Content sections
      contentSections: {
        padding: '30px 71px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '70px',
        
        // Individual section
        section: {
          width: '100%',
          position: 'relative' as const,
          
          // Games section
          games: {
            height: '218px',
          },
          
          // Allowlists section
          allowlists: {
            height: '218px',
          },
          
          // Token raffles section
          tokenRaffles: {
            height: '220px',
          },
          
          // NFT raffles section
          nftRaffles: {
            height: '220px',
          },
          
          // Crypto support section
          cryptoSupport: {
            height: '173px',
          },
        },
      },
    },
  },

  // Footer section
  footer: {
    height: '212.347px',
    width: '100%',
    backgroundColor: '#181818',
    position: 'relative' as const,
  },

  // Responsive breakpoints
  responsive: {
    mobile: {
      maxWidth: '768px',
      sideNav: {
        width: '100%',
        height: 'auto',
        position: 'static' as const,
        transform: 'translateX(-100%)', // Hidden by default
      },
      content: {
        marginLeft: '0',
        width: '100%',
        padding: '0 20px',
      },
    },
    tablet: {
      maxWidth: '1024px',
      sideNav: {
        width: '120px',
      },
      content: {
        marginLeft: '120px',
        width: 'calc(100% - 120px)',
        padding: '0 40px',
      },
    },
  },
};

// =============================================================================
// DASHBOARD TEMPLATE - For user profiles and admin interfaces
// =============================================================================

export const dashboardTemplate = {
  // Inherits from homepage but with different content structure
  structure: {
    ...homepageTemplate.structure,
    height: 'auto', // Dynamic height
    minHeight: '100vh',
  },

  // Same navbar and navigation
  topNavbar: homepageTemplate.topNavbar,
  sideNav: homepageTemplate.mainContent.sideNav,

  // Dashboard-specific content area
  content: {
    marginLeft: '150px',
    width: '1130px',
    padding: '40px 71px',
    
    // Dashboard header
    header: {
      marginBottom: '40px',
      
      title: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '48px',
        color: '#ffffff',
        lineHeight: '52px',
        marginBottom: '16px',
      },
      
      subtitle: {
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '18px',
        color: '#969696',
        lineHeight: '24px',
      },
      
      actions: {
        position: 'absolute' as const,
        top: '0',
        right: '0',
        display: 'flex',
        gap: '16px',
      },
    },
    
    // Dashboard grid
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    
    // Dashboard sections
    sections: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '40px',
    },
  },

  // Same footer
  footer: homepageTemplate.footer,
};

// =============================================================================
// LISTING TEMPLATE - For browsing raffles, communities, content
// =============================================================================

export const listingTemplate = {
  structure: {
    ...homepageTemplate.structure,
    height: 'auto',
    minHeight: '100vh',
  },

  topNavbar: homepageTemplate.topNavbar,
  sideNav: homepageTemplate.mainContent.sideNav,

  content: {
    marginLeft: '150px',
    width: '1130px',
    padding: '40px 71px',
    
    // Listing header with filters
    header: {
      marginBottom: '40px',
      
      titleSection: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        
        title: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          
          icon: {
            width: '32px',
            height: '32px',
          },
          
          text: {
            fontFamily: "'Bebas_Neue:Regular', sans-serif",
            fontSize: '36px',
            color: '#ffffff',
            lineHeight: '40px',
          },
        },
        
        viewToggle: {
          display: 'flex',
          gap: '8px',
          
          button: {
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            
            active: {
              backgroundColor: designTokens.colors.naffles.darkGrey,
              borderColor: designTokens.colors.naffles.yellow,
            },
          },
        },
      },
      
      // Filters bar
      filters: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 0',
        borderBottom: `1px solid ${designTokens.colors.naffles.lightBorder}`,
        
        filterGroup: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          
          label: {
            fontFamily: "'Roboto:Medium', sans-serif",
            fontSize: '14px',
            color: '#969696',
            minWidth: '80px',
          },
          
          select: {
            backgroundColor: designTokens.colors.naffles.darkGrey,
            border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#ffffff',
            fontSize: '14px',
            minWidth: '120px',
          },
        },
        
        searchBox: {
          flex: 1,
          maxWidth: '300px',
          position: 'relative' as const,
          
          input: {
            width: '100%',
            backgroundColor: designTokens.colors.naffles.darkGrey,
            border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
            borderRadius: '6px',
            padding: '8px 12px 8px 40px',
            color: '#ffffff',
            fontSize: '14px',
            
            '&::placeholder': {
              color: '#969696',
            },
          },
          
          icon: {
            position: 'absolute' as const,
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#969696',
          },
        },
      },
    },
    
    // Results area
    results: {
      // Grid view
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      },
      
      // List view
      list: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
        marginBottom: '40px',
      },
      
      // Pagination
      pagination: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '40px 0',
        
        button: {
          width: '40px',
          height: '40px',
          backgroundColor: 'transparent',
          border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#ffffff',
          fontSize: '14px',
          
          active: {
            backgroundColor: designTokens.colors.naffles.yellow,
            borderColor: designTokens.colors.naffles.yellow,
            color: '#050100',
          },
          
          disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
      },
    },
  },

  footer: homepageTemplate.footer,
};

// =============================================================================
// DETAIL TEMPLATE - For individual raffle and community pages
// =============================================================================

export const detailTemplate = {
  structure: {
    ...homepageTemplate.structure,
    height: 'auto',
    minHeight: '100vh',
  },

  topNavbar: homepageTemplate.topNavbar,
  sideNav: homepageTemplate.mainContent.sideNav,

  content: {
    marginLeft: '150px',
    width: '1130px',
    padding: '40px 71px',
    
    // Breadcrumb navigation
    breadcrumb: {
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      
      item: {
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '14px',
        color: '#969696',
        textDecoration: 'none',
        
        active: {
          color: '#ffffff',
        },
        
        hover: {
          color: designTokens.colors.naffles.yellow,
        },
      },
      
      separator: {
        color: '#464646',
        fontSize: '12px',
      },
    },
    
    // Main content area
    main: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px',
      marginBottom: '40px',
      
      // Primary content
      primary: {
        // Hero section
        hero: {
          marginBottom: '40px',
          
          image: {
            width: '100%',
            height: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            backgroundColor: designTokens.colors.naffles.darkGrey,
          },
          
          title: {
            fontFamily: "'Bebas_Neue:Regular', sans-serif",
            fontSize: '48px',
            color: '#ffffff',
            lineHeight: '52px',
            marginBottom: '16px',
          },
          
          description: {
            fontFamily: "'Roboto:Regular', sans-serif",
            fontSize: '16px',
            color: '#969696',
            lineHeight: '24px',
            marginBottom: '24px',
          },
          
          tags: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap' as const,
            
            tag: {
              backgroundColor: designTokens.colors.naffles.darkGrey,
              border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '12px',
              color: '#ffffff',
            },
          },
        },
        
        // Content sections
        sections: {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '32px',
        },
      },
      
      // Sidebar
      sidebar: {
        // Action card
        actionCard: {
          backgroundColor: designTokens.colors.naffles.darkGrey,
          border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          
          title: {
            fontFamily: "'Bebas_Neue:Regular', sans-serif",
            fontSize: '20px',
            color: '#ffffff',
            marginBottom: '16px',
          },
          
          stats: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '12px',
            marginBottom: '24px',
            
            stat: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              
              label: {
                fontSize: '14px',
                color: '#969696',
              },
              
              value: {
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: 'bold',
              },
            },
          },
          
          actions: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '12px',
          },
        },
        
        // Info cards
        infoCards: {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '16px',
        },
      },
    },
    
    // Related content
    related: {
      title: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '24px',
        color: '#ffffff',
        marginBottom: '24px',
      },
      
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
      },
    },
  },

  footer: homepageTemplate.footer,
};

// =============================================================================
// FORM TEMPLATE - For user input and configuration pages
// =============================================================================

export const formTemplate = {
  structure: {
    ...homepageTemplate.structure,
    height: 'auto',
    minHeight: '100vh',
  },

  topNavbar: homepageTemplate.topNavbar,
  sideNav: homepageTemplate.mainContent.sideNav,

  content: {
    marginLeft: '150px',
    width: '1130px',
    padding: '40px 71px',
    display: 'flex',
    justifyContent: 'center',
    
    // Form container
    formContainer: {
      width: '100%',
      maxWidth: '600px',
      
      // Form header
      header: {
        textAlign: 'center' as const,
        marginBottom: '40px',
        
        title: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '36px',
          color: '#ffffff',
          lineHeight: '40px',
          marginBottom: '16px',
        },
        
        description: {
          fontFamily: "'Roboto:Regular', sans-serif",
          fontSize: '16px',
          color: '#969696',
          lineHeight: '24px',
        },
      },
      
      // Form card
      card: {
        backgroundColor: designTokens.colors.naffles.darkGrey,
        border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
        borderRadius: '16px',
        padding: '32px',
        
        // Form sections
        section: {
          marginBottom: '32px',
          
          title: {
            fontFamily: "'Bebas_Neue:Regular', sans-serif",
            fontSize: '20px',
            color: '#ffffff',
            marginBottom: '16px',
          },
          
          description: {
            fontFamily: "'Roboto:Regular', sans-serif",
            fontSize: '14px',
            color: '#969696',
            lineHeight: '20px',
            marginBottom: '20px',
          },
        },
        
        // Form fields
        field: {
          marginBottom: '24px',
          
          label: {
            display: 'block',
            fontFamily: "'Roboto:Medium', sans-serif",
            fontSize: '14px',
            color: '#ffffff',
            marginBottom: '8px',
            
            required: {
              '&::after': {
                content: '" *"',
                color: '#ff4444',
              },
            },
          },
          
          input: {
            width: '100%',
            backgroundColor: designTokens.colors.naffles.menu,
            border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#ffffff',
            fontSize: '16px',
            
            '&::placeholder': {
              color: '#969696',
            },
            
            '&:focus': {
              borderColor: designTokens.colors.naffles.yellow,
              outline: 'none',
              boxShadow: `0 0 0 3px rgba(254, 255, 61, 0.1)`,
            },
            
            error: {
              borderColor: '#ff4444',
            },
          },
          
          helpText: {
            fontSize: '12px',
            color: '#969696',
            marginTop: '4px',
          },
          
          errorText: {
            fontSize: '12px',
            color: '#ff4444',
            marginTop: '4px',
          },
        },
        
        // Form actions
        actions: {
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${designTokens.colors.naffles.lightBorder}`,
        },
      },
    },
  },

  footer: homepageTemplate.footer,
};

// =============================================================================
// TEMPLATE INHERITANCE PATTERNS
// =============================================================================

export const templateInheritance = {
  // Base template - shared across all pages
  base: {
    topNavbar: homepageTemplate.topNavbar,
    sideNav: homepageTemplate.mainContent.sideNav,
    footer: homepageTemplate.footer,
    
    // Common responsive patterns
    responsive: homepageTemplate.responsive,
  },
  
  // Content templates - inherit base + specific content patterns
  content: {
    homepage: homepageTemplate,
    dashboard: dashboardTemplate,
    listing: listingTemplate,
    detail: detailTemplate,
    form: formTemplate,
  },
  
  // Layout utilities
  utils: {
    // Consistent header pattern
    pageHeader: {
      marginBottom: '40px',
      
      title: {
        fontFamily: "'Bebas_Neue:Regular', sans-serif",
        fontSize: '36px',
        color: '#ffffff',
        lineHeight: '40px',
        marginBottom: '16px',
      },
      
      subtitle: {
        fontFamily: "'Roboto:Regular', sans-serif",
        fontSize: '16px',
        color: '#969696',
        lineHeight: '24px',
      },
    },
    
    // Consistent section pattern
    section: {
      marginBottom: '40px',
      
      header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        
        title: {
          fontFamily: "'Bebas_Neue:Regular', sans-serif",
          fontSize: '24px',
          color: '#ffffff',
          lineHeight: '28px',
        },
      },
    },
    
    // Consistent card pattern
    card: {
      backgroundColor: designTokens.colors.naffles.darkGrey,
      border: `1px solid ${designTokens.colors.naffles.lightBorder}`,
      borderRadius: '16px',
      padding: '24px',
      
      hover: {
        borderColor: designTokens.colors.naffles.yellow,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      },
    },
  },
};

// =============================================================================
// EXPORT ALL TEMPLATES
// =============================================================================

export const pageTemplates = {
  homepage: homepageTemplate,
  dashboard: dashboardTemplate,
  listing: listingTemplate,
  detail: detailTemplate,
  form: formTemplate,
  inheritance: templateInheritance,
};

export default pageTemplates;