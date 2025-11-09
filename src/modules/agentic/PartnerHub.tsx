import { Target, TrendingUp, CheckCircle, Clock, ArrowRight, Brain } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAgentPlatform } from '../../context/AgentPlatformProvider';

export default function PartnerHub() {
  const { goals, projects, vestedInterestScore, agents } = useAgentStore();
  const { openAgentSidebar } = useAgentPlatform();
  
  const cofounder = agents.find(a => a.role === 'cofounder');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Partner Hub</h1>
          <p className="text-xl text-gray-600">Your strategic command center</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-blue-100 mb-1">VestedInterest™ Score</p>
                <p className="text-4xl font-bold">{vestedInterestScore}</p>
              </div>
              <Brain className="w-12 h-12 text-blue-100" />
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: `${vestedInterestScore}%` }} />
            </div>
            <p className="text-sm text-blue-100 mt-2">Partnership depth growing strong</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-sm text-gray-600">{projects.filter(p => p.status === 'active').length} in progress</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Goals Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {goals.filter(g => g.status === 'completed').length}/{goals.length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600">Strong momentum this month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Goals</h2>
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-700' :
                          goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
              <ArrowRight className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.agents.map(a => `Agent-${a.toUpperCase()}`).join(', ')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{project.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {cofounder && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{cofounder.avatar}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cofounder.name} - Your {cofounder.title}</h3>
                <p className="text-gray-700 mb-4">{cofounder.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={openAgentSidebar}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Start Conversation
                  </button>
                  <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-200">
                    Review Strategy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
