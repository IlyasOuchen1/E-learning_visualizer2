import React from 'react';
import { ChevronRight, Clock, CheckCircle, Circle, Upload } from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  completedSections: string[];
  contentData: any;
  onNewImport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionChange, completedSections, contentData, onNewImport }) => {
  const getContentTitle = () => {
    // Essayer différentes sources pour le titre
    if (contentData.metadata?.titre) return contentData.metadata.titre;
    if (contentData.metadata?.title) return contentData.metadata.title;
    
    // Extraire le titre du premier script si disponible
    const firstScript = Object.values(contentData.scripts)[0] as any;
    if (firstScript?.activite?.sequence) return firstScript.activite.sequence;
    
    return 'Contenu E-learning';
  };

  const getContentSubtitle = () => {
    // Essayer différentes sources pour le sous-titre
    if (contentData.metadata?.sous_titre) return contentData.metadata.sous_titre;
    if (contentData.metadata?.subtitle) return contentData.metadata.subtitle;
    if (contentData.metadata?.description) return contentData.metadata.description;
    
    return 'Apprentissage interactif';
  };

  const getDifficultyColor = (difficulte: string) => {
    switch (difficulte) {
      case 'facile': return 'text-green-600';
      case 'moyen': return 'text-orange-600';
      case 'difficile': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📖';
      case 'quiz': return '❓';
      case 'accordion': return '🔽';
      case 'video': return '🎥';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  const getSectionOrder = (key: string) => {
    const match = key.match(/^(\d+)-/);
    return match ? parseInt(match[1]) : 999;
  };

  const sortedSections = Object.entries(contentData.scripts).sort((a, b) => {
    return getSectionOrder(a[0]) - getSectionOrder(b[0]);
  });

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {contentData.metadata?.titre || 'Contenu E-learning'}
            </h2>
            <p className="text-blue-100 text-sm">
              {contentData.metadata?.sous_titre || 'Apprentissage interactif'}
            </p>
          </div>
          <button
            onClick={onNewImport}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
            title="Importer nouveau contenu"
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${(completedSections.length / Object.keys(contentData.scripts).length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-blue-100 mt-1">
          {completedSections.length} / {Object.keys(contentData.scripts).length} sections complétées
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {sortedSections.map(([key, section]) => {
            const isCompleted = completedSections.includes(key);
            const isCurrent = currentSection === key;
            const activite = section.activite;

            return (
              <div
                key={key}
                onClick={() => onSectionChange(key)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                  isCurrent 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getActivityTypeIcon(activite.type_activite)}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activite.num_ecran}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    {isCurrent && <ChevronRight className="h-4 w-4 text-blue-600" />}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {activite.titre_ecran}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {activite.sous_titre}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600">{activite.duree_estimee} min</span>
                    </div>
                    <span className={`font-medium ${getDifficultyColor(activite.difficulte)}`}>
                      {activite.difficulte}
                    </span>
                  </div>
                  <span className="bg-gray-200 px-2 py-1 rounded text-xs font-medium">
                    {activite.type_activite}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;