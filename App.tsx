import React, { useState } from 'react';
import { AppState, Question, QuizResult } from './types';
import { generateQuestions, analyzePerformance } from './services/geminiService';
import { Button } from './components/Button';
import { QuestionCard } from './components/QuestionCard';
import { TestimonialCard } from './components/TestimonialCard';
import { BrainCircuit, HeartHandshake, Sparkles, RefreshCcw, Flame, LockOpen, ArrowRight, Users, Share2, Check, Link as LinkIcon } from 'lucide-react';

const testimonials = [
  {
    name: "Ricardo Mendes",
    text: "Eu travava sempre que o assunto acabava. O ebook de 'Quebra de Gelo' salvou meu último encontro. Ela não parava de rir e a conexão foi imediata.",
    role: "Comprou há 2 semanas"
  },
  {
    name: "Lucas Ferreira",
    text: "Achei que fosse papo furado, mas a técnica de Tensão Positiva é surreal. Transformei um 'oi' desajeitado em três encontros na mesma semana.",
    role: "Aluno do Método"
  },
  {
    name: "André Silva",
    text: "Direto ao ponto. Sem teorias malucas, só psicologia aplicada. Li de manhã e apliquei no bar à noite. O resultado fala por si só.",
    role: "Aluno Verificado"
  }
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  // UI States for question flow
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const startQuiz = async () => {
    setAppState(AppState.LOADING);
    try {
      const generatedQuestions = await generateQuestions();
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setAppState(AppState.QUIZ);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestionIndex].correctOptionIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setAppState(AppState.ANALYZING);
      try {
        const analysis = await analyzePerformance(score, questions.length);
        setResult(analysis);
        setAppState(AppState.RESULTS);
      } catch (error) {
        console.error(error);
        setResult({
          score,
          totalQuestions: questions.length,
          feedback: "Análise indisponível no momento, mas parabéns por completar o quiz!",
          archetype: "Participante"
        });
        setAppState(AppState.RESULTS);
      }
    }
  };

  const restartQuiz = () => {
    setAppState(AppState.WELCOME);
    setQuestions([]);
    setResult(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const openSalesLink = () => {
    window.open('https://pay.kiwify.com.br/ZXa3bQ4', '_blank');
  };

  const handleShareLink = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mestre da Conversa',
        text: 'Descubra os E-books Psicológicos que Transformam Qualquer Conversa.',
        url: url
      }).catch(() => {
        // Fallback to clipboard if share cancels or fails
        navigator.clipboard.writeText(url).then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        });
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      });
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return (
          <div className="text-center max-w-4xl px-6 animate-fade-in flex flex-col items-center relative">
            
            {/* Share Button Top Right */}
            <div className="absolute top-0 right-0 p-4 md:p-0 md:-top-16 md:-right-12">
                <button
                onClick={handleShareLink}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:border-red-900/50 transition-all backdrop-blur-md shadow-lg group"
                >
                {linkCopied ? (
                    <>
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Link Copiado!</span>
                    </>
                ) : (
                    <>
                    <Share2 className="w-3 h-3 group-hover:text-red-500 transition-colors" />
                    <span>Compartilhar Quiz</span>
                    </>
                )}
                </button>
            </div>

            <div className="mb-10 relative">
              <div className="absolute -inset-4 bg-red-600/20 rounded-full blur-2xl"></div>
              <div className="relative bg-zinc-900 rounded-full p-8 border border-zinc-800 shadow-2xl">
                <Flame className="w-16 h-16 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              PSICOLOGIA <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
                DA ATRAÇÃO
              </span>
            </h1>
            
            <div className="h-1 w-24 bg-red-700 mx-auto mb-8 rounded-full"></div>

            <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed font-light">
              Descubra os E-books Psicológicos que Transformam <span className="text-white font-medium">Qualquer Conversa Chata</span> em um <span className="text-white font-medium">Encontro sem Esforço</span>.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto mb-16">
              <Button onClick={startQuiz} className="text-lg px-10 py-4 w-full md:w-auto">
                INICIAR AVALIAÇÃO
              </Button>
            </div>

            {/* Mini Social Proof for Welcome Screen */}
            <div className="w-full border-t border-zinc-900 pt-8">
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold mb-6">Resultados Reais de Alunos</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                {testimonials.map((t, i) => (
                  <div key={i} className="hidden md:block">
                     <TestimonialCard {...t} />
                  </div>
                ))}
                {/* Mobile only shows first one */}
                <div className="md:hidden">
                   <TestimonialCard {...testimonials[0]} />
                </div>
              </div>
            </div>
          </div>
        );

      case AppState.LOADING:
        return (
          <div className="text-center animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl text-white font-bold tracking-tight">Calibrando Cenários...</h2>
            <p className="text-red-500/80 mt-3 font-medium tracking-wide text-sm uppercase">Acessando banco de dados comportamental</p>
          </div>
        );

      case AppState.QUIZ:
        return (
          <div className="w-full px-4 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-8 flex items-center justify-between text-zinc-500 text-xs font-bold tracking-widest uppercase">
              <span>Fase {currentQuestionIndex + 1} / {questions.length}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${score > 0 ? 'bg-red-500' : 'bg-zinc-700'}`}></div>
                <span>Acertos: {score}</span>
              </div>
            </div>
            
            {/* Professional Progress Bar */}
            <div className="w-full max-w-2xl h-1 bg-zinc-900 rounded-full mb-12 overflow-hidden border border-zinc-800/50">
              <div 
                className="h-full bg-red-700 shadow-[0_0_10px_rgba(185,28,28,0.5)] transition-all duration-700 ease-in-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            
            <QuestionCard 
              question={questions[currentQuestionIndex]}
              selectedOptionIndex={selectedOption}
              onOptionSelect={handleOptionSelect}
              showExplanation={showExplanation}
              onNext={handleNextQuestion}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            />
          </div>
        );

      case AppState.ANALYZING:
        return (
          <div className="text-center animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl text-white font-bold tracking-tight">Processando Perfil...</h2>
          </div>
        );

      case AppState.RESULTS:
        if (!result) return null;
        return (
          <div className="w-full max-w-4xl px-4 animate-fade-in-up pb-12">
            <div className="bg-black border border-zinc-800 rounded-2xl shadow-2xl text-center relative overflow-hidden">
              
              <div className="p-8 md:p-12 relative z-10">
                {/* Header Result */}
                <div className="mb-8 inline-block px-4 py-1.5 rounded-full border border-red-900/30 text-red-500 text-xs font-bold tracking-[0.2em] uppercase">
                  Diagnóstico Final
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                  {result.archetype}
                </h2>
                
                <div className="text-lg text-zinc-500 mb-10 font-light">
                  Potencial de Atração: <span className="text-white font-bold">{Math.round((result.score / result.totalQuestions) * 100)}%</span>
                </div>

                {/* Mentor Report */}
                <div className="bg-zinc-900/50 rounded-lg p-8 mb-12 text-left border-l-2 border-red-700 mx-auto max-w-2xl">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-red-500" /> Relatório do Mentor
                  </h3>
                  <p className="text-zinc-300 leading-7 font-light whitespace-pre-line">
                    {result.feedback}
                  </p>
                </div>

                {/* Testimonials Section in Results */}
                <div className="mb-12 text-left">
                  <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                    <Users className="w-5 h-5 text-red-600" />
                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">Quem aplicou, aprovou</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testimonials.map((t, i) => (
                      <TestimonialCard key={i} {...t} />
                    ))}
                  </div>
                </div>

                {/* Sales Section */}
                <div className="flex flex-col items-center gap-6 pt-8 border-t border-zinc-900 bg-gradient-to-b from-transparent to-red-950/10 -mx-8 md:-mx-12 px-8 md:px-12 pb-4">
                  <div className="text-center max-w-lg">
                    <h3 className="text-2xl text-white font-bold mb-2">Não deixe a conversa morrer.</h3>
                    <p className="text-zinc-400 text-sm">
                      Acesse agora o guia completo e descubra os gatilhos exatos para gerar atração instantânea, assim como o {testimonials[0].name.split(' ')[0]} e o {testimonials[1].name.split(' ')[0]}.
                    </p>
                  </div>

                  <Button 
                    onClick={openSalesLink} 
                    variant="primary" 
                    className="w-full md:w-auto px-12 py-5 text-lg shadow-xl shadow-red-900/20 hover:shadow-red-700/40 uppercase tracking-wider font-bold group"
                  >
                    <LockOpen className="w-5 h-5 mr-1" />
                    Destravar E-books Secretos
                    <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button onClick={restartQuiz} variant="outline" className="text-xs px-6 py-2 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 bg-transparent">
                    <RefreshCcw className="w-3 h-3 mr-2" />
                    Refazer Teste
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case AppState.ERROR:
        return (
          <div className="text-center max-w-md px-4">
             <div className="text-red-600 text-6xl mb-6">⚠️</div>
             <h2 className="text-2xl text-white font-bold mb-3">Falha na Conexão</h2>
             <p className="text-zinc-500 mb-8">O servidor não respondeu. Verifique sua chave de API.</p>
             <Button onClick={restartQuiz} variant="outline">Tentar Novamente</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-red-900/50 selection:text-white">
      {/* Professional Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-950/20 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900/50 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
