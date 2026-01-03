
import React from 'react';
import { AIAnalysisResult } from '../types';
import { ShieldCheck, AlertTriangle, Lightbulb, UserCheck, TrendingUp, Info, ExternalLink } from 'lucide-react';

interface AIAnalysisPanelProps {
  analysis: AIAnalysisResult;
  isLoading: boolean;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-24 bg-slate-200 rounded"></div>
        <div className="h-24 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" />
          AI Vetting Report
        </h3>
        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
          Confidence: {analysis.confidenceScore}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <TrendingUp size={18} />
            Cost Analysis
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{analysis.costVetting}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <UserCheck size={18} />
            Contractor Background
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{analysis.contractorBackground}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold">
          <Info size={18} />
          Timeline Feasibility
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{analysis.timelineFeasibility}</p>
      </div>

      {analysis.redFlags.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
            <AlertTriangle size={18} />
            Critical Red Flags
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {analysis.redFlags.map((flag, i) => <li key={i}>{flag}</li>)}
          </ul>
        </div>
      )}

      {analysis.suggestions.length > 0 && (
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
            <Lightbulb size={18} />
            Citizen Suggestions
          </div>
          <ul className="list-disc list-inside text-sm text-emerald-600 space-y-1">
            {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {analysis.sources && analysis.sources.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Verification Sources</div>
          <div className="flex flex-col gap-2">
            {analysis.sources.map((source, i) => (
              <a 
                key={i}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 transition truncate"
              >
                <ExternalLink size={12} />
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
