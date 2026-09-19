import React, { useState, useEffect } from 'react';
import { 
  Wand2, Copy, RefreshCw, Check, ShieldCheck, ShieldAlert, Cpu
} from 'lucide-react';
import { generateSecurePassword } from '../utils/security';

interface GeneratorViewProps {
  onTriggerToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ onTriggerToast }) => {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    // Ensure at least one character set
    const effectiveUpper = useUpper || (!useLower && !useNumbers && !useSpecial);
    const pwd = generateSecurePassword(
      length,
      effectiveUpper,
      useLower,
      useNumbers,
      useSpecial
    );
    setGeneratedPassword(pwd);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, useUpper, useLower, useNumbers, useSpecial]);

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      onTriggerToast('Cryptographic password copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onTriggerToast('Failed to copy automatically.', 'error');
    }
  };

  // Determine strength badge
  const strengthTier = length >= 14 ? 'Strong (Enterprise)' : length >= 10 ? 'Medium' : 'Weak';
  const strengthClass = length >= 14 
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : length >= 10 
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1629]/80 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Wand2 className="w-6 h-6 text-indigo-400" />
              <span>Cryptographic Password Generator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Construct high-entropy credentials powered by CSPRNG (<code className="text-cyan-400 font-mono">crypto.getRandomValues</code> & Python <code className="text-cyan-400 font-mono">secrets</code>).
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold self-start sm:self-auto">
            <Cpu className="w-3.5 h-3.5" />
            <span>CSPRNG Entropy</span>
          </div>
        </div>

        {/* Big Output Field */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Generated Credential</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400 text-[11px]">{length} characters</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${strengthClass}`}>
                {strengthTier}
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              id="generator-password-output"
              type="text"
              readOnly
              value={generatedPassword}
              className="w-full px-4 py-4 rounded-xl bg-[#080d1a] border border-cyan-500/30 text-cyan-300 text-lg sm:text-xl font-mono font-bold tracking-wider text-center focus:outline-none focus:border-cyan-400 transition-all select-all shadow-inner"
            />
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            id="generator-copy-btn"
            onClick={handleCopy}
            className="flex-1 min-w-[150px] py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Password'}</span>
          </button>

          <button
            id="generator-regenerate-btn"
            onClick={handleGenerate}
            className="flex-1 min-w-[150px] py-3 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Configuration Parameters */}
        <div className="border-t border-slate-800 pt-6 space-y-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Entropy Configuration
          </h4>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Password Length</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">{length} characters</span>
            </div>
            <input
              id="generator-length-slider"
              type="range"
              min={8}
              max={50}
              value={length}
              onChange={e => setLength(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8 (Basic)</span>
              <span>16 (Recommended)</span>
              <span>32 (Enterprise)</span>
              <span>50 (Paranoid)</span>
            </div>
          </div>

          {/* Checkboxes / Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ToggleOption
              id="toggle-upper"
              label="Uppercase Letters"
              sublabel="A, B, C, D..."
              checked={useUpper}
              onChange={v => {
                if (!v && !useLower && !useNumbers && !useSpecial) return;
                setUseUpper(v);
              }}
            />
            <ToggleOption
              id="toggle-lower"
              label="Lowercase Letters"
              sublabel="a, b, c, d..."
              checked={useLower}
              onChange={v => {
                if (!v && !useUpper && !useNumbers && !useSpecial) return;
                setUseLower(v);
              }}
            />
            <ToggleOption
              id="toggle-numbers"
              label="Numerical Digits"
              sublabel="0, 1, 2, 3..."
              checked={useNumbers}
              onChange={v => {
                if (!v && !useUpper && !useLower && !useSpecial) return;
                setUseNumbers(v);
              }}
            />
            <ToggleOption
              id="toggle-special"
              label="Special Characters"
              sublabel="! @ # $ % ^ & *"
              checked={useSpecial}
              onChange={v => {
                if (!v && !useUpper && !useLower && !useNumbers) return;
                setUseSpecial(v);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function ToggleOption({
  id,
  label,
  sublabel,
  checked,
  onChange
}: {
  id: string;
  label: string;
  sublabel: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/20 flex items-center justify-between cursor-pointer transition-colors"
    >
      <div>
        <div className="text-xs font-semibold text-slate-200">{label}</div>
        <div className="text-[10px] text-slate-500 font-mono">{sublabel}</div>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded-md border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
      />
    </label>
  );
}
