import { Link } from 'react-router-dom';
import { Card } from '../ui/Card.jsx';

const FEATURES = [
  {
    title: 'AI Questions',
    description: 'Paste a job description and get role-specific interview questions tailored to the position.',
    icon: '🎯'
  },
  {
    title: 'Speak Out Loud',
    description: 'Record your answers in the browser. No extra software needed.',
    icon: '🎙️'
  },
  {
    title: 'Instant Feedback',
    description: 'Get scored on clarity, relevance, and confidence with actionable tips.',
    icon: '⚡'
  }
];

export function LandingSidebar() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full p-8 xl:p-10">
      {/* Branding Logo (Internal to sidebar for alignment) */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-on font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">E</div>
          <span className="text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">
            EchoPrep
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-[480px]">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase self-start">
            AI-Powered Preparation
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl xl:text-5xl font-bold text-text leading-[1.1] tracking-tight">
              Practice out loud.<br />
              <span className="text-primary">Land the role.</span>
            </h1>
            
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              EchoPrep turns any job description into a realistic mock interview.
              Record spoken answers, get AI scoring, and build confidence.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid gap-2.5">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex gap-4 items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/[0.07] transition-all duration-300 group">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-lg group-hover:scale-110 transition-transform shadow-inner">
                {feature.icon}
              </div>
              <div className="flex flex-col gap-0">
                <h3 className="text-sm font-bold text-text group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-[10px] text-muted leading-snug">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        

      </div>
    </div>
  );
}


