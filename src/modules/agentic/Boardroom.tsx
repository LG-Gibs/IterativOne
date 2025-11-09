import { useState } from 'react';
import { FileText, Tag, Link as LinkIcon, Calendar, Search } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';

export default function Boardroom() {
  const { researchItems } = useAgentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set(researchItems.flatMap(item => item.tags)));

  const filteredItems = researchItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">The Boardroom</h1>
          <p className="text-xl text-gray-600">Centralized research repository with AI-powered insights</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research items..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  {item.summary && (
                    <p className="text-gray-600 mb-3">{item.summary}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.createdAt.toLocaleDateString()}
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <LinkIcon className="w-4 h-4" />
                      View Source
                    </a>
                  </div>

                  {item.linkedProjects.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Linked to: {item.linkedProjects.map(p => (
                          <span key={p} className="font-medium text-blue-600">{p}</span>
                        )).reduce((prev: any, curr) => [prev, ', ', curr])}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No research items found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
