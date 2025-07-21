import React, { useState } from 'react';
import { Clock, Target, Image as ImageIcon, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

interface ImageContentProps {
  content: any;
  onComplete: () => void;
}

const ImageContent: React.FC<ImageContentProps> = ({ content, onComplete }) => {
  const { activite, script } = content;
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set());

  // Parse image data from script
  const parseImageData = (scriptText: string) => {
    const lines = scriptText.split('\n');
    let imageData = {
      title: '',
      description: '',
      images: [] as Array<{
        url: string;
        caption: string;
        description: string;
        alt: string;
      }>,
      instructions: '',
      analysis: ''
    };

    let currentSection = '';
    let currentImage: any = {};

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('**Titre') || trimmedLine.includes('# Titre')) {
        imageData.title = trimmedLine.replace(/[*#]/g, '').replace('Titre', '').replace(':', '').trim();
      } else if (trimmedLine.includes('**Description') || trimmedLine.includes('## Description')) {
        currentSection = 'description';
      } else if (trimmedLine.includes('**Instructions') || trimmedLine.includes('## Instructions')) {
        currentSection = 'instructions';
      } else if (trimmedLine.includes('**Analyse') || trimmedLine.includes('## Analyse')) {
        currentSection = 'analysis';
      } else if (trimmedLine.includes('**Image') || trimmedLine.includes('## Image')) {
        if (currentImage.url) {
          imageData.images.push(currentImage);
        }
        currentImage = {};
        currentSection = 'image';
      } else if (trimmedLine.includes('URL:') || trimmedLine.includes('url:')) {
        currentImage.url = trimmedLine.replace(/URL:|url:/i, '').trim();
      } else if (trimmedLine.includes('Caption:') || trimmedLine.includes('caption:')) {
        currentImage.caption = trimmedLine.replace(/Caption:|caption:/i, '').trim();
      } else if (trimmedLine.includes('Alt:') || trimmedLine.includes('alt:')) {
        currentImage.alt = trimmedLine.replace(/Alt:|alt:/i, '').trim();
      } else if (currentSection === 'description' && trimmedLine && !trimmedLine.startsWith('**')) {
        imageData.description += trimmedLine + ' ';
      } else if (currentSection === 'instructions' && trimmedLine && !trimmedLine.startsWith('**')) {
        imageData.instructions += trimmedLine + ' ';
      } else if (currentSection === 'analysis' && trimmedLine && !trimmedLine.startsWith('**')) {
        imageData.analysis += trimmedLine + ' ';
      } else if (currentSection === 'image' && trimmedLine && !trimmedLine.includes(':')) {
        currentImage.description = (currentImage.description || '') + trimmedLine + ' ';
      }
    });

    // Add last image if exists
    if (currentImage.url) {
      imageData.images.push(currentImage);
    }

    // Clean up text fields
    imageData.description = imageData.description.trim();
    imageData.instructions = imageData.instructions.trim();
    imageData.analysis = imageData.analysis.trim();

    // If no images found in structured format, try to extract URLs from text
    if (imageData.images.length === 0) {
      const urlMatches = scriptText.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi);
      if (urlMatches) {
        urlMatches.forEach((url, index) => {
          imageData.images.push({
            url,
            caption: `Image ${index + 1}`,
            description: '',
            alt: `Image ${index + 1}`
          });
        });
      }
    }

    return imageData;
  };

  const imageData = parseImageData(script);

  const handleImageView = (index: number) => {
    setSelectedImage(index);
    setViewedImages(prev => new Set([...prev, index]));
    setIsZoomed(false);
    setRotation(0);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleComplete = () => {
    onComplete();
  };

  const allImagesViewed = imageData.images.length === 0 || viewedImages.size === imageData.images.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <ImageIcon className="h-5 w-5" />
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

      {/* Instructions */}
      {imageData.instructions && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Instructions
          </h2>
          <p className="text-blue-800">
            {imageData.instructions}
          </p>
        </div>
      )}

      {/* Description */}
      {imageData.description && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {imageData.description}
          </p>
        </div>
      )}

      {/* Progress */}
      {imageData.images.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {viewedImages.size} sur {imageData.images.length} images visualisées
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((viewedImages.size / imageData.images.length) * 100)}% terminé
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${(viewedImages.size / imageData.images.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {imageData.images.length > 0 ? (
        <div className="space-y-8">
          {/* Main Image Display */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img
                src={imageData.images[selectedImage]?.url || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg'}
                alt={imageData.images[selectedImage]?.alt || 'Image d\'apprentissage'}
                className={`w-full h-96 object-cover transition-all duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                style={{ transform: `rotate(${rotation}deg) ${isZoomed ? 'scale(1.5)' : 'scale(1)'}` }}
                onClick={handleZoom}
              />
              
              {/* Image Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleZoom}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                >
                  {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleRotate}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <a
                  href={imageData.images[selectedImage]?.url}
                  download
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            {/* Image Caption */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {imageData.images[selectedImage]?.caption || `Image ${selectedImage + 1}`}
              </h3>
              {imageData.images[selectedImage]?.description && (
                <p className="text-gray-700">
                  {imageData.images[selectedImage].description}
                </p>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          {imageData.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageView(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg'}
                    alt={image.alt || `Miniature ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  {viewedImages.has(index) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    {image.caption || `Image ${index + 1}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Fallback content when no images */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contenu visuel
          </h3>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: script.replace(/\n/g, '<br>') }} />
          </div>
        </div>
      )}

      {/* Analysis */}
      {imageData.analysis && (
        <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            Analyse et réflexion
          </h3>
          <p className="text-yellow-800">
            {imageData.analysis}
          </p>
        </div>
      )}

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
          disabled={!allImagesViewed}
          className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
            allImagesViewed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allImagesViewed ? 'Marquer comme terminé' : 'Visualisez toutes les images'}
        </button>
      </div>
    </div>
  );
};

export default ImageContent;