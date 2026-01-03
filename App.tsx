
import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, BarChart3, Users, MessageSquare, 
  ThumbsUp, ThumbsDown, Filter, ChevronRight, Gavel, 
  LayoutDashboard, Loader2, ShieldCheck as ShieldIcon
} from 'lucide-react';
import { Project, ProjectStatus, AIAnalysisResult } from './types';
import { MOCK_PROJECTS } from './constants';
import { BudgetPie, TimelineBar } from './components/StatsCharts';
import { AIAnalysisPanel } from './components/AIAnalysisPanel';
import { vetProject, crawlPublicProjects } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'pitches' | 'dashboard'>('feed');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, AIAnalysisResult>>({});
  const [isVetting, setIsVetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  const handleCrawl = async () => {
    if (!searchQuery) return;
    setIsCrawling(true);
    try {
      const newProjects = await crawlPublicProjects(searchQuery);
      // Convert crawled results to full Project objects for UI.
      // We map the results which now correctly typed via any[] from service.
      const formatted: Project[] = (newProjects as any[]).map((p, i) => ({
        id: `crawled-${i}-${Date.now()}`,
        title: p.title || 'Unknown Project',
        description: p.description || 'No description available',
        location: searchQuery,
        status: (p.status as ProjectStatus) || ProjectStatus.PROPOSED,
        budget: p.budget ? Number(p.budget) : 0,
        allocatedDate: new Date().toISOString().split('T')[0],
        deadline: p.deadline || 'TBD',
        contractor: { name: p.contractorName || 'Unknown', rating: 0, pastProjects: 0 },
        tags: ['Crawled', 'Public Domain'],
        votes: 0, upvotes: 0, downvotes: 0,
        budgetBreakdown: [{ category: 'Total', amount: p.budget ? Number(p.budget) : 0 }],
        timeline: [{ phase: 'Initial Phase', status: 'Proposed', date: 'N/A' }]
      }));
      setProjects(prev => [...formatted, ...prev]);
    } catch (error) {
      console.error("Crawl error:", error);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleVetProject = async (project: Project) => {
    if (aiAnalysis[project.id]) {
      setSelectedProject(project);
      return;
    }
    
    setSelectedProject(project);
    setIsVetting(true);
    const result = await vetProject(project);
    if (result) {
      setAiAnalysis(prev => ({ ...prev, [project.id]: result }));
    }
    setIsVetting(false);
  };

  const vote = (id: string, type: 'up' | 'down') => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes,
          downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes,
          votes: p.votes + 1
        };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Gavel size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              CitizenConnect <span className="text-slate-400 font-medium text-sm">v1.0</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-1/3">
            <Search className="text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search location (e.g. Mumbai, Delhi)..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCrawl()}
            />
            {isCrawling && <Loader2 className="animate-spin text-indigo-600" size={18} />}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md shadow-indigo-100">
              <Plus size={18} /> Pitch Idea
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden cursor-pointer shadow-sm">
              <img src="https://picsum.photos/100" alt="Avatar" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Navigation Menus */}
        <div className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'feed' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <LayoutDashboard size={20} /> Project Feed
          </button>
          <button 
            onClick={() => setActiveTab('pitches')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'pitches' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Users size={20} /> Community Pitches
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <BarChart3 size={20} /> Live Dashboard
          </button>
          <div className="pt-6 border-t border-slate-200 mt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">My Locality</h4>
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600">
              <MapPin size={16} className="text-indigo-400" />
              Whitefield, Bengaluru
            </div>
          </div>
        </div>

        {/* Middle Content - Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          {activeTab === 'feed' && (
            <>
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="font-bold text-lg">Active Projects</h2>
                <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
                  <Filter size={16} /> Filter
                </button>
              </div>

              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${project.status === ProjectStatus.ONGOING ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {project.status}
                          </span>
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            <MapPin size={12} /> {project.location}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{project.title}</h3>
                      </div>
                      <button 
                        onClick={() => handleVetProject(project)}
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        <ShieldIcon size={20} />
                      </button>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl mb-4 text-sm">
                      <div>
                        <span className="text-slate-400 block text-xs">Total Budget</span>
                        <span className="font-bold text-indigo-600">₹{(project.budget/100000).toFixed(1)}L</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-xs">Contractor</span>
                        <span className="font-bold text-slate-700 truncate block">{project.contractor.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => vote(project.id, 'up')}
                          className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition"
                        >
                          <ThumbsUp size={18} />
                          <span className="text-sm font-medium">{project.upvotes}</span>
                        </button>
                        <button 
                          onClick={() => vote(project.id, 'down')}
                          className="flex items-center gap-1 text-slate-500 hover:text-red-600 transition"
                        >
                          <ThumbsDown size={18} />
                          <span className="text-sm font-medium">{project.downvotes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition">
                          <MessageSquare size={18} />
                          <span className="text-sm font-medium">12</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline"
                      >
                        Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'dashboard' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Regional Infrastructure Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
                    <BarChart3 size={16} /> Budget Allocation (Current Projects)
                  </h4>
                  <div className="h-64">
                    <BudgetPie data={MOCK_PROJECTS[0].budgetBreakdown} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-emerald-600 font-bold text-xl">82%</div>
                    <div className="text-emerald-700 text-xs">Contractor Trust Rating</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="text-amber-600 font-bold text-xl">12 Days</div>
                    <div className="text-amber-700 text-xs">Avg. Project Delay</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="text-indigo-600 font-bold text-xl">1.4 Cr</div>
                    <div className="text-indigo-700 text-xs">Citizen Tax Tracking</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Details & AI Panel */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            {selectedProject ? (
              <>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Project Insights</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs text-slate-400 block mb-1">Timeline Progress</span>
                      <TimelineBar timeline={selectedProject.timeline} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Official Cost</span>
                        <span className="font-bold">₹{(selectedProject.budget/100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Citizen Valuation</span>
                        <span className="font-bold text-emerald-600">₹{(selectedProject.budget/100000 * 0.8).toFixed(1)}L</span>
                      </div>
                    </div>
                  </div>
                </div>

                {aiAnalysis[selectedProject.id] ? (
                  <AIAnalysisPanel analysis={aiAnalysis[selectedProject.id]} isLoading={isVetting} />
                ) : (
                  <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200">
                    <h3 className="font-bold text-lg mb-2">Request AI Audit</h3>
                    <p className="text-indigo-100 text-xs mb-4">
                      Gemini will crawl latest news and media reports to vet the contractor and budget for this project.
                    </p>
                    <button 
                      onClick={() => handleVetProject(selectedProject)}
                      disabled={isVetting}
                      className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
                    >
                      {isVetting ? <Loader2 className="animate-spin" size={18} /> : <ShieldIcon size={18} />}
                      {isVetting ? 'Analyzing...' : 'Start Audit'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <ShieldIcon size={32} />
                </div>
                <h3 className="font-bold text-slate-400 mb-1">No Project Selected</h3>
                <p className="text-slate-400 text-xs">Select a project from the feed to view detailed AI analysis and blueprints.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-2xl z-50">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default App;
