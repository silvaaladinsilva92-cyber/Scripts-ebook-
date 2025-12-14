import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialProps {
  name: string;
  text: string;
  role?: string;
}

export const TestimonialCard: React.FC<TestimonialProps> = ({ name, text, role = "Aluno Verificado" }) => {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 p-6 rounded-xl relative hover:border-red-900/50 transition-colors text-left">
      <Quote className="absolute top-4 right-4 w-8 h-8 text-red-900/20" />
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-red-600 text-red-600" />
        ))}
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-900 to-black flex items-center justify-center text-xs font-bold text-white border border-red-900/30">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-zinc-200 text-sm font-semibold">{name}</p>
          <p className="text-zinc-600 text-[10px] uppercase tracking-wider">{role}</p>
        </div>
      </div>
    </div>
  );
};
