
import { useState } from 'react';
import {
  Shield,
  Eye,
  Brain,
  MapPin,
  Lock,
  Users,
  Bell,
  Camera,
  Cpu,
  Search
} from 'lucide-react';

export {
  Shield,
  Eye,
  Brain,
  MapPin,
  Lock,
  Users,
  Bell,
  Camera,
  Cpu,
  Search
};

export const H2Logo = ({ className }: { className?: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`font-black text-2xl text-brand-primary tracking-tighter flex items-center ${className}`}>
        H2 AI LAB
      </div>
    );
  }

  return (
    <img
      src="logo.png"
      alt="H2 AI LAB"
      className={`${className} object-contain block`}
      onError={() => setError(true)}
    />
  );
};
