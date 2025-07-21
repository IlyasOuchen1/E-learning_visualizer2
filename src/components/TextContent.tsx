import React from 'react';
import { Clock, BookOpen, Target } from 'lucide-react';

interface TextContentProps {
  content: any;
  onComplete: () => void;
}

const TextContent: React.FC<TextContentProps> = ({ content, onComplete }) => {
  const { activite, script } = content;

  const formatMarkdownText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-800 mb-6 mt-8">$1</h1>')
      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/(\n|^)([^<\n-].*?)(\n|$)/g, '<p class="mb-4 text-gray-700 leading-relaxed">$2</p>')
      .replace(/(<li.*?>[\s\S]*?<\/li>)/g, '<ul class="list-disc pl-6 mb-4 space-y-1">$1</ul>');
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">
            {activite.num_ecran}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {activite.titre_ecran}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {activite.sous_titre}
        </p>
        
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{activite.duree_estimee} minutes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span className="capitalize">{activite.difficulte}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {activite.niveau_bloom}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-content"
            dangerouslySetInnerHTML={{ __html: formatMarkdownText(script) }}
          />
        </div>
      </div>

      {/* Objective */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Objectif d'apprentissage
        </h3>
        <p className="text-blue-800">
          {activite.objectif_lie}
        </p>
      </div>

      {/* Complete Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Marquer comme terminé
        </button>
      </div>
    </div>
  );
};

export default TextContent;