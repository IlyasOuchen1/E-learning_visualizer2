import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface JsonImporterProps {
  onContentLoad: (content: any) => void;
}

const JsonImporter: React.FC<JsonImporterProps> = ({ onContentLoad }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateJsonStructure = (data: any): boolean => {
    // Vérifier la structure de base
    if (!data || typeof data !== 'object') return false;
    if (!data.metadata || !data.scripts) return false;
    if (typeof data.scripts !== 'object') return false;

    // Vérifier qu'il y a au moins un script
    const scriptKeys = Object.keys(data.scripts);
    if (scriptKeys.length === 0) return false;

    // Vérifier la structure d'au moins un script
    const firstScript = data.scripts[scriptKeys[0]];
    if (!firstScript.activite || !firstScript.script) return false;

    return true;
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Vérifier que c'est un fichier JSON
      if (!file.name.toLowerCase().endsWith('.json')) {
        throw new Error('Veuillez sélectionner un fichier JSON (.json)');
      }

      // Lire le contenu du fichier
      const text = await file.text();
      
      // Parser le JSON
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Le fichier JSON n\'est pas valide. Vérifiez la syntaxe.');
      }

      // Valider la structure
      if (!validateJsonStructure(jsonData)) {
        throw new Error('La structure du fichier JSON ne correspond pas au format attendu pour un contenu e-learning.');
      }

      // Charger le contenu
      onContentLoad(jsonData);
      setSuccess(true);
      
      // Masquer le message de succès après 2 secondes
      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Importateur de Contenu E-learning
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenue ! Importez votre fichier JSON de contenu pédagogique pour commencer votre parcours d'apprentissage interactif.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Zone de drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`h-8 w-8 ${isDragOver ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  📁 Glissez-déposez votre fichier JSON ici
                </p>
                <p className="text-gray-600 mb-4">
                  ou cliquez pour sélectionner un fichier
                </p>
                
                <label className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors duration-200 shadow-md hover:shadow-lg">
                  <Upload className="h-5 w-5 mr-2" />
                  📂 Choisir un fichier JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Messages d'état */}
          {isLoading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800 font-medium">Chargement du fichier...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-800 font-medium mb-1">Erreur de chargement</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Fichier chargé avec succès !</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📋 Format JSON attendu
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Le fichier doit contenir un objet avec les propriétés <code className="bg-gray-200 px-1 rounded">metadata</code> et <code className="bg-gray-200 px-1 rounded">scripts</code></p>
              <p>• Chaque script doit avoir une structure <code className="bg-gray-200 px-1 rounded">activite</code> et <code className="bg-gray-200 px-1 rounded">script</code></p>
              <p>• Les types d'activités supportés : <code className="bg-gray-200 px-1 rounded">text</code>, <code className="bg-gray-200 px-1 rounded">quiz</code>, <code className="bg-gray-200 px-1 rounded">accordion</code>, <code className="bg-gray-200 px-1 rounded">video</code>, <code className="bg-gray-200 px-1 rounded">image</code></p>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Conseil</h4>
              <p className="text-blue-800 text-sm">
                Assurez-vous que votre fichier JSON est bien formaté et contient toutes les sections nécessaires. 
                L'application validera automatiquement la structure avant de charger le contenu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonImporter;