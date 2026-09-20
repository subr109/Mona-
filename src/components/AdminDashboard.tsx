import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  Heart,
  MessageCircle,
  Camera,
  Activity,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Lock,
  ArrowRight
} from 'lucide-react';
import { AICharacter } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    companions,
    adminUpdateCompanion,
    adminCreateCompanion,
    reports,
    resolveReport,
    auditLogs,
    login,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'companions' | 'reports' | 'logs'>('overview');
  const [searchChar, setSearchChar] = useState('');
  const [editingChar, setEditingChar] = useState<AICharacter | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Admin inline gate state
  const [gateEmail, setGateEmail] = useState('sroy22000@gmail.com');
  const [gatePassword, setGatePassword] = useState('');
  const [gateError, setGateError] = useState('');

  const handleGateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    const res = login(gateEmail, gatePassword);
    if (!res.success) {
      setGateError(res.error || 'Invalid administrator credentials.');
    }
  };

  // New character form state
  const [newChar, setNewChar] = useState({
    name: '',
    age: 25,
    gender: 'female' as 'female' | 'male',
    country: '',
    city: '',
    flag: '🌍',
    primaryLanguage: 'English',
    languages: ['English'],
    biography: '',
    quote: '',
    personality: '',
    personalityTraits: ['Romantic', 'Caring'],
    interests: ['Music', 'Art'],
    communicationStyle: 'Gentle, romantic, attentive',
    relationshipStyle: 'Devoted, loyal',
    backstory: '',
    profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    visualIdentity: {
      faceDescription: 'Warm, expressive features',
      hair: 'Soft wave',
      hairColor: 'Dark brown',
      eyeColor: 'Hazel',
      skinTone: 'Warm olive',
      approximateAge: 25,
      bodyDescription: 'Graceful',
      fashionStyle: 'Classic refined elegance',
      distinctiveFeatures: 'Warm smile'
    },
    systemPrompt: 'You are an 18+ adult fictional romantic companion on MONA.',
    active: true,
    mood: 'Romantic' as any,
    popularityScore: 90
  });

  // Role Gate
  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 text-left px-4">
        <div className="rounded-2xl border border-amber-800/50 bg-[#15101a] p-6 sm:p-7 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/70 border border-amber-600/60 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-white text-center mb-1">
            Administrator Access Required
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-6">
            This portal is restricted to authorized MONA personnel. Please enter your administrator credentials.
          </p>

          {gateError && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-xs text-rose-200">
              {gateError}
            </div>
          )}

          <form onSubmit={handleGateLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Admin Email ID</label>
              <input
                type="email"
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                placeholder="sroy22000@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Admin Password</label>
              <input
                type="password"
                value={gatePassword}
                onChange={(e) => setGatePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold text-xs tracking-wide shadow-lg shadow-amber-950/50 transition cursor-pointer"
            >
              Sign In to Admin Portal
            </button>

            <button
              type="button"
              onClick={() => setActiveView('discovery')}
              className="w-full py-2 text-center text-xs text-zinc-400 hover:text-white transition cursor-pointer"
            >
              Return to Companions
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredCompanions = companions.filter(
    (c) =>
      c.name.toLowerCase().includes(searchChar.toLowerCase()) ||
      c.country.toLowerCase().includes(searchChar.toLowerCase()) ||
      c.city.toLowerCase().includes(searchChar.toLowerCase())
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingChar) {
      adminUpdateCompanion(editingChar);
      setEditingChar(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChar.name.trim() || !newChar.country.trim()) return;
    adminCreateCompanion(newChar);
    setCreateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#171224] border border-amber-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-600 flex items-center justify-center text-amber-400 shadow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-white">
              MONA Platform Control & Moderation
            </h1>
            <p className="text-xs text-amber-300/80">
              Admin: {currentUser.email} • 100 AI Companions Live
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center rounded-xl bg-zinc-900 p-1 border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'overview' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('companions')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'companions' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Companions ({companions.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'reports' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Safety Reports ({reports.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'logs' ? 'bg-amber-950 text-amber-200 border border-amber-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#14101e] border border-zinc-800">
              <span className="text-zinc-400 text-xs font-medium">Total Registered Users</span>
              <p className="text-2xl font-bold text-white mt-1">12,480</p>
              <span className="text-[11px] text-emerald-400 mt-1 block">↑ 14% this week</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#14101e] border border-zinc-800">
              <span className="text-zinc-400 text-xs font-medium">Active AI Companions</span>
              <p className="text-2xl font-bold text-rose-300 mt-1">{companions.length}</p>
              <span className="text-[11px] text-zinc-400 mt-1 block">50 Women • 50 Men</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#14101e] border border-zinc-800">
              <span className="text-zinc-400 text-xs font-medium">Messages Exchanged Today</span>
              <p className="text-2xl font-bold text-purple-300 mt-1">84,210</p>
              <span className="text-[11px] text-emerald-400 mt-1 block">Avg latency 420ms</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#14101e] border border-zinc-800">
              <span className="text-zinc-400 text-xs font-medium">Photos Generated</span>
              <p className="text-2xl font-bold text-pink-300 mt-1">6,432</p>
              <span className="text-[11px] text-zinc-400 mt-1 block">100% Non-explicit verified</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#14101e] border border-zinc-800 space-y-3 text-xs">
            <h3 className="text-sm font-serif font-bold text-white">System Health & Compliance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-zinc-400">Gemini 3.8 Flash (Chat)</p>
                <p className="text-emerald-400 font-semibold mt-0.5">● Operational</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-zinc-400">Safety & 18+ Filter</p>
                <p className="text-emerald-400 font-semibold mt-0.5">● Enforcing Non-Explicit Policy</p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-zinc-400">Memory Engine</p>
                <p className="text-emerald-400 font-semibold mt-0.5">● Encrypted & Synced</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANIONS MANAGEMENT */}
      {activeTab === 'companions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchChar}
                onChange={(e) => setSearchChar(e.target.value)}
                placeholder="Search companions to edit..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Companion</span>
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#14101e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Character</th>
                    <th className="p-3">Gender / Age</th>
                    <th className="p-3">Origin</th>
                    <th className="p-3">Personality</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredCompanions.slice(0, 50).map((char) => (
                    <tr key={char.id} className="hover:bg-zinc-900/40 transition">
                      <td className="p-3 flex items-center gap-2.5">
                        <img
                          src={char.thumbnailUrl}
                          alt={char.name}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white">{char.name}</p>
                          <p className="text-[10px] text-zinc-500">{char.id}</p>
                        </div>
                      </td>
                      <td className="p-3 capitalize">
                        {char.gender} • {char.age}
                      </td>
                      <td className="p-3">
                        {char.flag} {char.city}, {char.country}
                      </td>
                      <td className="p-3 max-w-[160px] truncate text-zinc-400">
                        {char.personality}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[10px]">
                          Active (18+)
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setEditingChar(char)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAFETY REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-[#14101e] overflow-hidden p-5">
            <h3 className="text-sm font-serif font-bold text-white mb-3">
              User Moderation & Safety Reports ({reports.length})
            </h3>

            {reports.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No reports filed.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold text-[10px]">
                          {rep.reason}
                        </span>
                        <span className="text-zinc-500 text-[11px]">{rep.createdAt}</span>
                        <span className="text-zinc-400 text-[11px]">Reporter: {rep.reporterEmail}</span>
                      </div>
                      <p className="text-zinc-300">{rep.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rep.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => resolveReport(rep.id, 'resolved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-xs cursor-pointer"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => resolveReport(rep.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-400 capitalize text-xs">
                          {rep.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-zinc-800 bg-[#14101e] p-5 space-y-3">
          <h3 className="text-sm font-serif font-bold text-white mb-2">Immutable Admin Audit Logs</h3>
          <div className="space-y-2 text-xs font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-between text-zinc-300">
                <div>
                  <span className="text-amber-400 font-semibold">[{log.action}]</span>{' '}
                  <span>Target: {log.targetType} ({log.targetId})</span>
                </div>
                <span className="text-zinc-500 text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Character Modal */}
      {editingChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-900/50 bg-[#171224] p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setEditingChar(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-serif font-bold text-white mb-1">
              Edit Companion: {editingChar.name}
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Adjust character personality, quote, and prompts.</p>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingChar.name}
                    onChange={(e) => setEditingChar({ ...editingChar, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Age (18+)</label>
                  <input
                    type="number"
                    min={18}
                    value={editingChar.age}
                    onChange={(e) => setEditingChar({ ...editingChar, age: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Signature Quote</label>
                <input
                  type="text"
                  value={editingChar.quote}
                  onChange={(e) => setEditingChar({ ...editingChar, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={editingChar.biography}
                  onChange={(e) => setEditingChar({ ...editingChar, biography: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">System Prompt Directive</label>
                <textarea
                  rows={3}
                  value={editingChar.systemPrompt}
                  onChange={(e) => setEditingChar({ ...editingChar, systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingChar(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-semibold cursor-pointer"
                >
                  Save Companion Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Companion Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-900/50 bg-[#171224] p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-serif font-bold text-white mb-1">
              Create New AI Companion
            </h2>
            <p className="text-xs text-zinc-400 mb-4">Add a new fictional adult companion to the roster.</p>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={newChar.name}
                    onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Gender</label>
                  <select
                    value={newChar.gender}
                    onChange={(e) => setNewChar({ ...newChar, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newChar.city}
                    onChange={(e) => setNewChar({ ...newChar, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newChar.country}
                    onChange={(e) => setNewChar({ ...newChar, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Flag Emoji</label>
                  <input
                    type="text"
                    value={newChar.flag}
                    onChange={(e) => setNewChar({ ...newChar, flag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Personality Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Poetic • Caring • Adventurous"
                  value={newChar.personality}
                  onChange={(e) => setNewChar({ ...newChar, personality: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Signature Romantic Quote</label>
                <input
                  type="text"
                  required
                  value={newChar.quote}
                  onChange={(e) => setNewChar({ ...newChar, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Biography</label>
                <textarea
                  rows={2}
                  required
                  value={newChar.biography}
                  onChange={(e) => setNewChar({ ...newChar, biography: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-semibold cursor-pointer"
                >
                  Publish Companion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
