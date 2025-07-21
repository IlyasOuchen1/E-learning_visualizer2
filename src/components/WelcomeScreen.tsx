import React from 'react';
import { BookOpen, Clock, Users, Target, Upload } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  contentData: any;
  onNewImport: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, contentData, onNewImport }) => {
  const { metadata } = contentData;

  const totalDuration = Object.values(contentData.scripts).reduce((total: number, script: any) => {
    return total + (script.activite?.duree_estimee || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {contentData.metadata?.titre || 'Contenu E-learning'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {contentData.metadata?.description || 'Découvrez un parcours d\'apprentissage interactif personnalisé pour développer vos compétences.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Modules</h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">{metadata.nombre_scripts}</p>
            <p className="text-sm text-gray-600">sections d'apprentissage</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Durée</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">{totalDuration}</p>
            <p className="text-sm text-gray-600">minutes environ</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Activités</h3>
            <p className="text-2xl font-bold text-orange-600 mb-1">{metadata.types_activites.length}</p>
            <p className="text-sm text-gray-600">types d'exercices</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Niveau</h3>
            <p className="text-2xl font-bold text-purple-600 mb-1">Mix</p>
            <p className="text-sm text-gray-600">facile à difficile</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Contenu du Programme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metadata.types_activites.map((type: string, index: number) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                  <span className="text-2xl">
                    {type === 'text' ? '📖' : type === 'quiz' ? '❓' : '🔽'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {type === 'text' ? 'Contenu Textuel' : type === 'quiz' ? 'Quiz Interactifs' : 'Sections Accordéon'}
                </h3>
                <p className="text-sm text-gray-600">
                  {type === 'text' 
                    ? 'Lectures approfondies sur les événements historiques' 
                    : type === 'quiz' 
                    ? 'Évaluations pour tester vos connaissances'
                    : 'Explorations structurées par thème'}
                </p>
              </div>
            ))}
          </div>
        </div>


        <div className="text-center">
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl mr-4"
          >
            Commencer l'apprentissage
          </button>
          <button
            onClick={onNewImport}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Upload className="h-5 w-5 inline mr-2" />
            Importer nouveau contenu
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Généré le {new Date(metadata.date_generation).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;