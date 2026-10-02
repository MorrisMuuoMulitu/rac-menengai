/**
 * Shared icon mapping for content-driven lists (service areas, district
 * priorities, Rotary's areas of focus). Keeps `IconKey` values in `data.ts`
 * free of JSX while letting any page render them consistently.
 */
import type { ReactNode } from 'react';
import {
  Award,
  Book,
  Building,
  CalendarDays,
  Droplets,
  Flag,
  GraduationCap,
  Handshake,
  Heart,
  HeartPulse,
  Leaf,
  MapPin,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import type { IconKey } from '../data';

const ICONS: Record<IconKey, ReactNode> = {
  leaf: <Leaf aria-hidden="true" />,
  heart: <Heart aria-hidden="true" />,
  book: <Book aria-hidden="true" />,
  users: <Users aria-hidden="true" />,
  star: <Star aria-hidden="true" />,
  droplets: <Droplets aria-hidden="true" />,
  heartPulse: <HeartPulse aria-hidden="true" />,
  graduation: <GraduationCap aria-hidden="true" />,
  sparkles: <Sparkles aria-hidden="true" />,
  trending: <TrendingUp aria-hidden="true" />,
  shield: <Shield aria-hidden="true" />,
  handshake: <Handshake aria-hidden="true" />,
  calendar: <CalendarDays aria-hidden="true" />,
  mapPin: <MapPin aria-hidden="true" />,
  award: <Award aria-hidden="true" />,
  flag: <Flag aria-hidden="true" />,
  building: <Building aria-hidden="true" />,
  wallet: <Wallet aria-hidden="true" />,
  messageCircle: <MessageCircle aria-hidden="true" />,
};

export function FocusIcon({ name }: { name: IconKey }) {
  return <>{ICONS[name] ?? ICONS.star}</>;
}