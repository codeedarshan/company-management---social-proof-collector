import React from 'react';
import { RatingStats } from '../types';
import { Star, TrendingUp, CheckCircle2, Clock, ThumbsUp } from 'lucide-react';

interface MetricsCardProps {
  stats: RatingStats;
  spaceName: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ stats, spaceName }) => {
  const starsArray = [5, 4, 3, 2, 1] as const;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Overall Rating Block */}
        <div className="flex items-center space-x-5 lg:border-r lg:border-slate-100 lg:pr-8">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
            <span className="text-3xl font-extrabold text-indigo-700 tracking-tight">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(stats.averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Social Proof Score
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {spaceName}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Based on <strong className="text-slate-800">{stats.approvedCount}</strong> verified reviews
              </span>
            </p>
          </div>
        </div>

        {/* Breakdown Distribution Bars */}
        <div className="flex-1 max-w-md space-y-1.5">
          {starsArray.map((stars) => {
            const count = stats.distribution[stars] || 0;
            const percentage =
              stats.approvedCount > 0 ? Math.round((count / stats.approvedCount) * 100) : 0;

            return (
              <div key={stars} className="flex items-center text-xs space-x-2">
                <div className="flex items-center space-x-1 w-12 text-slate-600 font-medium">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-16 text-right text-[11px] text-slate-400 font-mono">
                  {count} <span className="text-slate-300">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:border-l lg:border-slate-100 lg:pl-8">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{stats.approvedCount}</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> Pending
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{stats.pendingCount}</div>
          </div>

          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-indigo-600" /> Approval Rate
            </div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">{stats.approvalRate}%</div>
          </div>
        </div>

      </div>
    </div>
  );
};
