import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flag, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen, reportingTarget, submitReport } = useApp();
  const [reason, setReason] = useState<
    'Unsafe Content' | 'Harassment' | 'Inappropriate Image' | 'Impersonation' | 'Technical Issue' | 'Other'
  >('Unsafe Content');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitReport({
      targetType: (reportingTarget?.type as any) || 'companion',
      targetId: reportingTarget?.id || 'unknown',
      reason,
      description: description.trim()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setReportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-900/40 bg-[#161222] p-6 shadow-2xl text-left">
        <button
          onClick={() => setReportModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-rose-400">
          <Flag className="w-5 h-5" />
          <h2 className="text-lg font-serif font-bold text-white">
            Report a Safety or Content Concern
          </h2>
        </div>

        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
          MONA takes user comfort, adult content safety, and fictional boundary enforcement very seriously. Reports are reviewed by human administrators.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm font-semibold text-white">Report Submitted</p>
            <p className="text-xs text-zinc-400">Thank you. Our moderation team will investigate promptly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Unsafe Content">Unsafe / Explicit Content Violation</option>
                <option value="Inappropriate Image">Inappropriate Image</option>
                <option value="Harassment">Harassment or Discomfort</option>
                <option value="Impersonation">Impersonation Concern</option>
                <option value="Technical Issue">Technical Glitch</option>
                <option value="Other">Other Policy Question</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened or why this content was flagged..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium shadow transition cursor-pointer"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
