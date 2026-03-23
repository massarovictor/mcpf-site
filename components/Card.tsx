import React from 'react';
import { GlassCard } from './GlassCard';

type CardProps = React.ComponentProps<typeof GlassCard>;

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <GlassCard {...props}>{children}</GlassCard>;
};
