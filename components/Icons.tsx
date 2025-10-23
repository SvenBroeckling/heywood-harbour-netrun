import React from 'react';
import { NodeType } from '../types';

interface IconProps {
  type?: NodeType;
  className?: string;
}

const commonIconProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
};

export const LogoIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg {...commonIconProps} className={className} viewBox="0 0 24 24">
        <path d="M12 22V8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        <path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4z" />
        <path d="M2.5 14.5c2.5 2.5 6 2.5 8.5 0" />
        <path d="M21.5 14.5c-2.5 2.5-6 2.5-8.5 0" />
    </svg>
);


export const NodeIcon: React.FC<IconProps> = ({ type, className = "w-8 h-8" }) => {
  const commonProps = {
    className,
    ...commonIconProps
  };

  switch (type) {
    case NodeType.ENTRYPOINT:
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path d="M10 21v-6.5a3.5 3.5 0 0 0-7 0V21" />
          <path d="M14 21v-6.5a3.5 3.5 0 0 1 7 0V21" />
          <path d="M12 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
          <path d="M12 21V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3" />
        </svg>
      );
    case NodeType.PASSWORD:
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      );
    case NodeType.CONTROL_NODE:
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 12.94 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
          <path d="M12 21.84c-1.5 0-2.75-1.06-4-1.06-3 0-6-8-6-12.22A4.91 4.91 0 0 1 7 5c2.22 0 4 1.44 5 2 1-.56 2.78-2 5-2a4.9 4.9 0 0 1 5 4.78C22 12.94 19 22 16 22c-1.25 0-2.5-1.06-4-1.06z" />
        </svg>
      );
    case NodeType.FILE:
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      );
    case NodeType.BLACK_ICE:
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69z" />
        </svg>
      );
    case NodeType.BRANCH:
         return (
        <svg {...commonProps} viewBox="0 0 24 24">
            <path d="M6 3v12" />
            <path d="M18 9v6" />
            <path d="M12 21V9" />
            <path d="M3 15h18" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
  }
};