
import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface RoadmapItem {
  date: string;
  milestone: string;
  description: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}