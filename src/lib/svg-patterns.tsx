import React from 'react';

export type PatternType = 'topographic' | 'dotgrid' | 'diagonal-hatch';

interface PatternComponentProps {
  id: string;
  opacity?: number;
}

const TopographicPattern: React.FC<PatternComponentProps> = ({ id, opacity = 0.06 }) => (
  <svg className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ opacity }}>
    <defs>
      <pattern id={id} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <path
          d="M10 10 Q 30 20, 50 10 T 90 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M10 30 Q 30 40, 50 30 T 90 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M10 50 Q 30 60, 50 50 T 90 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M10 70 Q 30 80, 50 70 T 90 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <path
          d="M10 90 Q 30 100, 50 90 T 90 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

const DotGridPattern: React.FC<PatternComponentProps> = ({ id, opacity = 0.06 }) => (
  <svg className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ opacity }}>
    <defs>
      <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

const DiagonalHatchPattern: React.FC<PatternComponentProps> = ({ id, opacity = 0.06 }) => (
  <svg className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ opacity }}>
    <defs>
      <pattern id={id} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <path
          d="M0 10 L10 0 M-1 1 L1 -1 M9 11 L11 9"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export const getPatternByCategory = (category: string | null | undefined): PatternType => {
  if (!category) return 'dotgrid';

  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('strategy') || categoryLower.includes('market')) {
    return 'topographic';
  }

  if (categoryLower.includes('execution') || categoryLower.includes('tactics') || categoryLower.includes('tactical')) {
    return 'dotgrid';
  }

  if (categoryLower.includes('growth') || categoryLower.includes('marketing')) {
    return 'diagonal-hatch';
  }

  return 'dotgrid';
};

interface SVGPatternProps {
  category?: string | null;
  id: string;
  opacity?: number;
}

export const SVGPattern: React.FC<SVGPatternProps> = ({ category, id, opacity = 0.06 }) => {
  const patternType = getPatternByCategory(category);

  switch (patternType) {
    case 'topographic':
      return <TopographicPattern id={id} opacity={opacity} />;
    case 'dotgrid':
      return <DotGridPattern id={id} opacity={opacity} />;
    case 'diagonal-hatch':
      return <DiagonalHatchPattern id={id} opacity={opacity} />;
    default:
      return <DotGridPattern id={id} opacity={opacity} />;
  }
};
