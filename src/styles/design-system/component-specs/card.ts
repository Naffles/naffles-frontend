/**
 * Card Component Specification
 * 
 * Comprehensive specification for card components based on Figma designs.
 * Includes variants, layouts, content patterns, and responsive behavior.
 */

import { colors, typography, spacing, shadows, borderRadius } from '../tokens';

export interface CardVariant {
  backgroundColor: string;
  border?: string;
  boxShadow?: string;
  padding: string;
  states?: {
    hover?: Record<string, string>;
    active?: Record<string, string>;
    focus?: Record<string, string>;
  };
}

export const cardSpec = {
  // Base properties applied to all cards
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.semantic.surface,
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
  } as const,

  // Variant styles
  variants: {
    default: {
      backgroundColor: colors.semantic.surface,
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: shadows.DEFAULT,
      padding: spacing[6],
    },
    elevated: {
      backgroundColor: colors.semantic.surface,
      boxShadow: shadows.lg,
      padding: spacing[6],
    },
    outlined: {
      backgroundColor: colors.semantic.surface,
      border: `1px solid ${colors.gray[300]}`,
      boxShadow: 'none',
      padding: spacing[6],
    },
    interactive: {
      backgroundColor: colors.semantic.surface,
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: shadows.DEFAULT,
      padding: spacing[6],
      cursor: 'pointer',
      states: {
        hover: {
          boxShadow: shadows.lg,
          transform: 'translateY(-2px)',
          borderColor: colors.gray[300],
        },
        active: {
          boxShadow: shadows.md,
          transform: 'translateY(-1px)',
        },
        focus: {
          boxShadow: `${shadows.lg}, 0 0 0 3px ${colors.primary[200]}`,
          outline: 'none',
        },
      },
    },
    compact: {
      backgroundColor: colors.semantic.surface,
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: shadows.sm,
      padding: spacing[4],
    },
    flush: {
      backgroundColor: colors.semantic.surface,
      border: `1px solid ${colors.gray[200]}`,
      boxShadow: shadows.DEFAULT,
      padding: '0',
    },
  } as Record<string, CardVariant>,

  // Content structure patterns
  structure: {
    header: {
      padding: spacing[6],
      paddingBottom: spacing[3],
      borderBottom: `1px solid ${colors.gray[200]}`,
      marginBottom: spacing[4],
      
      title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.semantic.text.primary,
        lineHeight: typography.lineHeight.tight,
        margin: '0',
      },
      
      subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[600],
        marginTop: spacing[1],
        margin: '0',
      },
      
      actions: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      },
    },
    
    body: {
      padding: spacing[6],
      paddingTop: '0',
      paddingBottom: '0',
      
      content: {
        fontSize: typography.fontSize.base,
        color: colors.semantic.text.primary,
        lineHeight: typography.lineHeight.relaxed,
      },
      
      description: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[600],
        lineHeight: typography.lineHeight.relaxed,
      },
    },
    
    footer: {
      padding: spacing[6],
      paddingTop: spacing[3],
      borderTop: `1px solid ${colors.gray[200]}`,
      marginTop: spacing[4],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      
      actions: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
      },
      
      meta: {
        fontSize: typography.fontSize.sm,
        color: colors.gray[500],
      },
    },
    
    media: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      
      aspectRatios: {
        square: '1/1',
        video: '16/9',
        photo: '4/3',
        banner: '3/1',
      },
    },
  },

  // Layout patterns
  layouts: {
    // Standard content card
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing[4],
    },
    
    // Media card with image/video
    media: {
      display: 'flex',
      flexDirection: 'column',
      
      mediaContainer: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${borderRadius.lg} ${borderRadius.lg} 0 0`,
      },
      
      content: {
        padding: spacing[6],
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[3],
      },
    },
    
    // Horizontal card layout
    horizontal: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[4],
      
      media: {
        flexShrink: 0,
        width: '6rem',
        height: '6rem',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
      },
      
      content: {
        flex: 1,
        minWidth: 0,
      },
    },
    
    // Grid card for collections
    grid: {
      display: 'grid',
      gap: spacing[4],
      
      responsive: {
        mobile: 'grid-template-columns: 1fr',
        tablet: 'grid-template-columns: repeat(2, 1fr)',
        desktop: 'grid-template-columns: repeat(3, 1fr)',
      },
    },
  },

  // Dynamic content patterns for Naffles platform
  dynamicContent: {
    // Raffle card template
    raffleCard: {
      structure: ['media', 'header', 'body', 'footer'],
      dataMapping: {
        '{{raffle.title}}': 'header.title',
        '{{raffle.description}}': 'body.description',
        '{{raffle.prizeImage}}': 'media.src',
        '{{raffle.endDate}}': 'footer.meta',
        '{{raffle.participants}}': 'footer.meta',
        '{{raffle.entryPrice}}': 'footer.actions',
      },
      states: ['active', 'ended', 'upcoming'],
    },
    
    // Community card template
    communityCard: {
      structure: ['media', 'header', 'body', 'footer'],
      dataMapping: {
        '{{community.name}}': 'header.title',
        '{{community.description}}': 'body.description',
        '{{community.avatar}}': 'media.src',
        '{{community.memberCount}}': 'footer.meta',
        '{{community.pointsName}}': 'body.content',
        '{{community.activity}}': 'footer.meta',
      },
      states: ['joined', 'available', 'private'],
    },
    
    // Game card template
    gameCard: {
      structure: ['media', 'header', 'body', 'footer'],
      dataMapping: {
        '{{game.name}}': 'header.title',
        '{{game.description}}': 'body.description',
        '{{game.thumbnail}}': 'media.src',
        '{{game.players}}': 'footer.meta',
        '{{game.status}}': 'header.subtitle',
      },
      states: ['available', 'playing', 'maintenance'],
    },
    
    // User profile card template
    userCard: {
      structure: ['header', 'body', 'footer'],
      dataMapping: {
        '{{user.username}}': 'header.title',
        '{{user.avatar}}': 'header.media',
        '{{user.tier}}': 'header.subtitle',
        '{{user.balance}}': 'body.content',
        '{{user.achievements}}': 'footer.meta',
      },
      states: ['online', 'offline', 'away'],
    },
  },

  // Responsive behavior
  responsive: {
    mobile: {
      padding: spacing[4],
      borderRadius: borderRadius.md,
      
      header: {
        padding: spacing[4],
        paddingBottom: spacing[2],
      },
      
      body: {
        padding: spacing[4],
        paddingTop: '0',
        paddingBottom: '0',
      },
      
      footer: {
        padding: spacing[4],
        paddingTop: spacing[2],
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing[2],
      },
    },
    
    tablet: {
      // Use default spacing
    },
    
    desktop: {
      // Use default spacing with potential for larger cards
      maxWidth: '24rem', // Optional constraint for very wide screens
    },
  },

  // State variations
  states: {
    loading: {
      opacity: '0.7',
      cursor: 'wait',
      
      skeleton: {
        backgroundColor: colors.gray[200],
        borderRadius: borderRadius.md,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
    
    error: {
      borderColor: colors.error[300],
      backgroundColor: colors.error[25],
      
      content: {
        color: colors.error[700],
      },
    },
    
    success: {
      borderColor: colors.success[300],
      backgroundColor: colors.success[25],
      
      content: {
        color: colors.success[700],
      },
    },
    
    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
      
      interactive: {
        pointerEvents: 'none',
      },
    },
  },

  // Usage guidelines
  usage: {
    default: {
      description: 'Standard content cards, information display',
      examples: ['Article previews', 'Product listings', 'User profiles'],
      bestPractices: [
        'Keep content scannable',
        'Use consistent spacing',
        'Limit to essential information',
      ],
    },
    elevated: {
      description: 'Important content, modal-like cards, featured items',
      examples: ['Featured raffles', 'Important announcements', 'Premium content'],
      bestPractices: [
        'Use sparingly for emphasis',
        'Ensure sufficient contrast',
        'Consider accessibility impact',
      ],
    },
    interactive: {
      description: 'Clickable cards, navigation items, selectable content',
      examples: ['Raffle entries', 'Game selection', 'Community browsing'],
      bestPractices: [
        'Provide clear hover feedback',
        'Include focus indicators',
        'Use appropriate cursor styles',
      ],
    },
  },

  // Accessibility requirements
  accessibility: {
    semantics: {
      role: 'article, region, or button for interactive cards',
      headings: 'Use proper heading hierarchy within cards',
      landmarks: 'Group related cards in sections',
    },
    
    keyboard: {
      focusable: 'Interactive cards must be keyboard focusable',
      tabOrder: 'Maintain logical tab order within card content',
      activation: 'Support Enter and Space key activation',
    },
    
    screenReader: {
      labels: 'Provide descriptive labels for card content',
      descriptions: 'Use aria-describedby for additional context',
      states: 'Announce dynamic state changes',
    },
    
    colorContrast: {
      text: 'Minimum 4.5:1 contrast ratio for text',
      interactive: 'Minimum 3:1 contrast for interactive elements',
      focus: 'Clear focus indicators with sufficient contrast',
    },
  },

  // Implementation examples
  examples: {
    react: `
import { Card } from '@/components/ui/Card';

// Basic card
<Card variant="default">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Subtitle>Card subtitle</Card.Subtitle>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here...</p>
  </Card.Body>
  <Card.Footer>
    <Card.Actions>
      <Button variant="primary">Action</Button>
    </Card.Actions>
  </Card.Footer>
</Card>

// Interactive raffle card
<Card variant="interactive" onClick={handleRaffleClick}>
  <Card.Media src={raffle.prizeImage} alt={raffle.title} />
  <Card.Header>
    <Card.Title>{raffle.title}</Card.Title>
  </Card.Header>
  <Card.Body>
    <p>{raffle.description}</p>
  </Card.Body>
  <Card.Footer>
    <Card.Meta>Ends {raffle.endDate}</Card.Meta>
    <Card.Actions>
      <Button size="sm">Enter Raffle</Button>
    </Card.Actions>
  </Card.Footer>
</Card>
    `,
    
    css: `
.card {
  border-radius: ${borderRadius.lg};
  background-color: ${colors.semantic.surface};
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.card--default {
  border: 1px solid ${colors.gray[200]};
  box-shadow: ${shadows.DEFAULT};
  padding: ${spacing[6]};
}

.card--interactive {
  cursor: pointer;
}

.card--interactive:hover {
  box-shadow: ${shadows.lg};
  transform: translateY(-2px);
}

.card__header {
  padding: ${spacing[6]};
  padding-bottom: ${spacing[3]};
  border-bottom: 1px solid ${colors.gray[200]};
  margin-bottom: ${spacing[4]};
}

.card__title {
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.semantic.text.primary};
  margin: 0;
}
    `,
  },
};

export default cardSpec;