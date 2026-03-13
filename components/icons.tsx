import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const defaults = {
  size: 32,
  color: '#C9A961',
  strokeWidth: 1.5,
};

function iconProps(props: IconProps) {
  return {
    width: props.size ?? defaults.size,
    height: props.size ?? defaults.size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    className: props.className,
  };
}

function s(props: IconProps) {
  return {
    stroke: props.color ?? defaults.color,
    strokeWidth: props.strokeWidth ?? defaults.strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

// ─── Feature Card Icons ─────────────────────────────

export function CameraIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <rect x="2" y="6" width="20" height="14" rx="2" {...s(props)} />
      <circle cx="12" cy="13" r="4" {...s(props)} />
      <path d="M7 6L8.5 3h7L17 6" {...s(props)} />
      <circle cx="12" cy="13" r="1.5" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.8} />
    </svg>
  );
}

export function ChartIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 3v18h18" {...s(props)} />
      <path d="M7 16l4-6 4 4 5-8" {...s(props)} />
      <circle cx="7" cy="16" r="1" fill={props.color ?? defaults.color} />
      <circle cx="11" cy="10" r="1" fill={props.color ?? defaults.color} />
      <circle cx="15" cy="14" r="1" fill={props.color ?? defaults.color} />
      <circle cx="20" cy="6" r="1" fill={props.color ?? defaults.color} />
    </svg>
  );
}

export function BrainIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.8 4 7.5 4 9.5c0 1.5.8 2.8 2 3.5-.2.5-.3 1-.3 1.5 0 2.5 2 4.5 4.5 4.5.5 0 1-.1 1.4-.2" {...s(props)} />
      <path d="M12 2c2.5 0 4.5 1.5 5 3.5 1.5.3 3 2 3 4 0 1.5-.8 2.8-2 3.5.2.5.3 1 .3 1.5 0 2.5-2 4.5-4.5 4.5-.5 0-1-.1-1.4-.2" {...s(props)} />
      <path d="M12 2v17" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} strokeDasharray="2 2" />
      <path d="M8 8.5h3M13 8.5h3" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M9 12h2M13 12h2" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
    </svg>
  );
}

export function ShieldIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2L3 7v5c0 5.5 3.8 10.3 9 11.5 5.2-1.2 9-6 9-11.5V7L12 2z" {...s(props)} />
      <path d="M9 12l2 2 4-4" {...s(props)} />
    </svg>
  );
}

// ─── Category Icons ─────────────────────────────────

export function FlowerIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 22V8" {...s(props)} />
      <path d="M9 14c-3-1-5-4-5-7 3-1 6 0 8 3" {...s(props)} />
      <path d="M15 14c3-1 5-4 5-7-3-1-6 0-8 3" {...s(props)} />
      <path d="M12 8c0-3 1.5-5 4-6-1 3-1.5 5-4 6z" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.15" />
      <path d="M12 8c0-3-1.5-5-4-6 1 3 1.5 5 4 6z" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.15" />
      <circle cx="12" cy="6" r="2" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.2" />
    </svg>
  );
}

export function VaporIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <rect x="9" y="12" width="6" height="10" rx="1" {...s(props)} />
      <path d="M10 12V6a2 2 0 0 1 4 0v6" {...s(props)} />
      <path d="M9 15h6" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M12 2v1" {...s(props)} />
      <path d="M10 3.5c0-1 .5-1.5 1-1.5" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
    </svg>
  );
}

export function PreRollIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M5 21L19 3" {...s(props)} />
      <path d="M7.5 18.5l-3 3" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M4 20l2 2" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M16.5 5.5L19 3" {...s(props)} />
      <ellipse cx="17.5" cy="4.5" rx="2.5" ry="1" transform="rotate(-45 17.5 4.5)" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.15" />
      <path d="M8 17l1-1M10 15l1-1M12 13l1-1M14 11l1-1" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} strokeDasharray="0.5 1.5" />
    </svg>
  );
}

export function EdibleIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" {...s(props)} />
      <path d="M3 9h18" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} />
      <rect x="6" y="12" width="5" height="4" rx="0.5" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} fill={props.color ?? defaults.color} fillOpacity="0.1" />
      <rect x="13" y="12" width="5" height="4" rx="0.5" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} fill={props.color ?? defaults.color} fillOpacity="0.1" />
    </svg>
  );
}

export function DiamondIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <polygon points="12,2 22,9 12,22 2,9" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.08" />
      <path d="M2 9h20" {...s(props)} />
      <path d="M7 9l5-7 5 7" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M7 9l5 13 5-13" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
    </svg>
  );
}

export function BeverageIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 4h12l-2 16H8L6 4z" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.06" />
      <path d="M6 4h12" {...s(props)} />
      <path d="M7 8h10" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} />
      <path d="M4 4h16" {...s(props)} />
      <path d="M10 2v2M14 2v2" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
    </svg>
  );
}

export function TinctureIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 3h6v3l2 2v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8l2-2V3z" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.06" />
      <path d="M9 3h6" {...s(props)} />
      <path d="M7 10h10" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} />
      <path d="M12 14v4" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M10 16h4" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
    </svg>
  );
}

export function CbdIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="9" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.08" />
      <circle cx="12" cy="12" r="5" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <circle cx="12" cy="12" r="1.5" fill={props.color ?? defaults.color} fillOpacity="0.4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} />
    </svg>
  );
}

// ─── UI Icons ───────────────────────────────────────

export function PackageIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 2L3 7l9 5 9-5-9-5z" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.1" />
      <path d="M3 7v10l9 5V12" {...s(props)} />
      <path d="M21 7v10l-9 5V12" {...s(props)} />
      <path d="M7.5 4.5L16.5 9.5" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} />
    </svg>
  );
}

export function ScanIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 7V3h4" {...s(props)} />
      <path d="M17 3h4v4" {...s(props)} />
      <path d="M21 17v4h-4" {...s(props)} />
      <path d="M7 21H3v-4" {...s(props)} />
      <circle cx="12" cy="12" r="3" {...s(props)} />
      <path d="M12 8v1M12 15v1M8 12h1M15 12h1" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.6} />
    </svg>
  );
}

export function LockIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <rect x="5" y="11" width="14" height="10" rx="2" {...s(props)} />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" {...s(props)} />
      <circle cx="12" cy="16" r="1.5" fill={props.color ?? defaults.color} />
    </svg>
  );
}

export function ZapIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.15" />
    </svg>
  );
}

export function CheckIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M5 12l5 5L20 7" {...s(props)} />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="10" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.1" />
      <path d="M8 12l3 3 5-5" {...s(props)} />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" {...s(props)} />
    </svg>
  );
}

export function ClickIcon(props: IconProps = {}) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9 3.5V2M5.06 5.06L4 4M3.5 9H2M5.06 12.94L4 14" {...s(props)} strokeWidth={(props.strokeWidth ?? defaults.strokeWidth) * 0.7} />
      <path d="M12 9a3 3 0 1 0-6 0 3 3 0 0 0 3 3" {...s(props)} />
      <path d="M12 12l-1 8 3-3.5 3.5 1L12 12z" {...s(props)} fill={props.color ?? defaults.color} fillOpacity="0.2" />
    </svg>
  );
}

// ─── Animated Checkbox ──────────────────────────────

export function AnimatedCheckbox({ checked, color }: { checked: boolean; color?: string }) {
  const c = color ?? defaults.color;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animated-checkbox">
      <rect
        x="3" y="3" width="18" height="18" rx="4"
        stroke={checked ? c : 'rgba(255,255,255,0.25)'}
        strokeWidth="1.5"
        fill={checked ? `${c}15` : 'transparent'}
        style={{ transition: 'all 0.3s ease' }}
      />
      <path
        d="M7 12.5l3.5 3.5 6.5-7"
        stroke={checked ? c : 'transparent'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: 'all 0.3s ease',
          strokeDasharray: 20,
          strokeDashoffset: checked ? 0 : 20,
        }}
      />
    </svg>
  );
}

// ─── Product Image Placeholder ──────────────────────

export function ProductPlaceholder(props: IconProps = {}) {
  const sz = props.size ?? 80;
  return (
    <svg width={sz} height={sz} viewBox="0 0 80 80" fill="none" className={props.className}>
      <rect width="80" height="80" rx="8" fill="rgba(201,169,97,0.06)" />
      <path d="M30 55V35c0-2 1-4 3-5l7-4 7 4c2 1 3 3 3 5v20" stroke={props.color ?? defaults.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <path d="M40 26v-4M36 28c-4-1-6-5-6-9 4-1 7 1 9 4" stroke={props.color ?? defaults.color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M44 28c4-1 6-5 6-9-4-1-7 1-9 4" stroke={props.color ?? defaults.color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// ─── Effect Dot ─────────────────────────────────────

const effectColors: Record<string, string> = {
  'Uplifted': '#E8C547',
  'Euphoric': '#D4A843',
  'Creative': '#B89B6A',
  'Relaxed': '#7BA47B',
  'Happy': '#E8C547',
  'Focused': '#8AA4C8',
  'Energized': '#D4843A',
  'Sleepy': '#7B7BA4',
  'Calm': '#7BA47B',
};

export function EffectTag({ effect }: { effect: string }) {
  const color = effectColors[effect] ?? '#C9A961';
  return (
    <span className="effect-tag" style={{ '--effect-color': color } as React.CSSProperties}>
      <span className="effect-dot" style={{ background: color }} />
      {effect}
    </span>
  );
}

export function parseEffects(effectsString: string): string[] {
  return effectsString
    .replace(/[^\w\s•·]/gu, '')
    .split(/[•·]/)
    .map(e => e.trim())
    .filter(Boolean);
}

// ─── Category Icon Map ──────────────────────────────

export const categoryIcons: Record<string, (props: IconProps) => React.ReactElement> = {
  'Flower': FlowerIcon,
  'Vaporizers': VaporIcon,
  'Pre-Rolls': PreRollIcon,
  'Edibles': EdibleIcon,
  'Concentrates': DiamondIcon,
  'Beverages': BeverageIcon,
  'Tinctures': TinctureIcon,
  'CBD': CbdIcon,
};
