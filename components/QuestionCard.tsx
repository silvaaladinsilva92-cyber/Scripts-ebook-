import React from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOptionIndex: number | null;
  onOptionSelect: (index: number) => void;
  showExplanation: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionIndex,
  onOptionSelect,
  showExplanation,
  onNext,
  isLastQuestion
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-900/90 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-zinc-800">
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed tracking-tight">
        {question.scenario}
      </h3>

      <div className="space-y-4 mb-8">
        {question.options.map((option, index) => {
          let optionStyle = "border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700";
          let Icon = null;

          if (showExplanation) {
            if (index === question.correctOptionIndex) {
              optionStyle = "border-green-800 bg-green-950/20 text-green-400";
              Icon = CheckCircle2;
            } else if (index === selectedOptionIndex && index !== question.correctOptionIndex) {
              optionStyle = "border-red-800 bg-red-950/20 text-red-400";
              Icon = XCircle;
            } else {
              optionStyle = "border-zinc-900 bg-black/20 text-zinc-600 opacity-50";
            }
          } else if (selectedOptionIndex === index) {
            // Selected state - Red theme
            optionStyle = "border-red-700 bg-red-950/30 text-white shadow-[0_0_15px_rgba(185,28,28,0.2)]";
          }

          return (
            <button
              key={index}
              onClick={() => !showExplanation && onOptionSelect(index)}
              disabled={showExplanation}
              className={`w-full text-left p-5 rounded-lg border transition-all duration-300 flex items-center justify-between group ${optionStyle}`}
            >
              <span className="flex-1 pr-4">{option}</span>
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              {!Icon && !showExplanation && (
                <div className={`w-4 h-4 rounded-full border ${selectedOptionIndex === index ? 'border-red-500 bg-red-600' : 'border-zinc-600 group-hover:border-zinc-400'} transition-colors`} />
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="animate-fade-in-up">
          <div className="bg-gradient-to-b from-zinc-900 to-black border-l-4 border-red-700 rounded-r-lg p-6 mb-8">
            <h4 className="text-red-500 font-bold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              Análise Psicológica
            </h4>
            <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
              {question.explanation}
            </p>
          </div>
          
          <button
            onClick={onNext}
            className="w-full py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {isLastQuestion ? 'Ver Diagnóstico' : 'Próximo Desafio'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
