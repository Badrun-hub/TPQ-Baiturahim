import { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Check, Search, Calendar as CalendarIcon, MoreVertical, LogOut, Moon, Sun } from 'lucide-react';

// --- ACCORDION ---
export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {item.title}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-[1000px] p-4 pt-0' : 'max-h-0'}`}>
            <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- ALERT ---
export function Alert({ variant = 'info', title, children, icon: Icon }) {
  const variants = {
    info: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    success: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    error: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20',
  };

  return (
    <div className={`p-4 rounded-xl border flex gap-3 ${variants[variant]}`}>
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <div>
        {title && <h5 className="font-semibold mb-1 text-sm">{title}</h5>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}

// --- BADGE ---
export function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// --- BUTTON ---
export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300',
    outline: 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/25',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// --- CARD ---
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${className}`}>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// --- INPUT & FORMS ---
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// --- TABLE ---
export function Table({ headers, children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`px-5 py-4 font-semibold text-slate-600 dark:text-slate-400 ${h.className || ''}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// --- MODAL / DIALOG ---
export function Dialog({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-zoom-in">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- SKELETON ---
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />;
}

// --- OTHER COMPONENTS ---
export function Progress({ value, max = 100, className = '' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 transition-all duration-500" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function Avatar({ src, name, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'
      )}
    </div>
  );
}

export function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

export function Separator({ className = '' }) {
  return <div className={`h-[1px] w-full bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex text-sm text-slate-500 dark:text-slate-400 mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <span className="mx-2 text-slate-400">/</span>}
            {item.to ? (
              <a href={item.to} className="hover:text-blue-500 transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="font-medium text-slate-800 dark:text-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
