import React, { useState } from 'react';
import { Clock, Target, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoContentProps {
  content: any;
  onComplete: () => void;
}

const VideoContent: React.FC<VideoContentProps> = ({ content, onComplete }) => {
  const { activite, script } = content;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Parse video data from script
  const parseVideoData = (scriptText: string) => {
    const lines = scriptText.split('\n');
    let videoData = {
      title: '',
      description: '',
      videoUrl: '',
      duration: 0,
      transcript: '',
      objectives: []
    };

    let currentSection = '';
    let transcriptLines: string[] = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('**Titre') || trimmedLine.includes('# Titre')) {
        videoData.title = trimmedLine.replace(/[*#]/g, '').replace('Titre', '').replace(':', '').trim();
      } else if (trimmedLine.includes('**Description') || trimmedLine.includes('## Description')) {
        currentSection = 'description';
      } else if (trimmedLine.includes('**URL') || trimmedLine.includes('**Lien') || trimmedLine.includes('video_url')) {
        const urlMatch = trimmedLine.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          videoData.videoUrl = urlMatch[0];
        }
      } else if (trimmedLine.includes('**Transcript') || trimmedLine.includes('## Transcript')) {
        currentSection = 'transcript';
      } else if (trimmedLine.includes('**Objectifs') || trimmedLine.includes('## Objectifs')) {
        currentSection = 'objectives';
      } else if (currentSection === 'description' && trimmedLine && !trimmedLine.startsWith('**')) {
        videoData.description += trimmedLine + ' ';
      } else if (currentSection === 'transcript' && trimmedLine && !trimmedLine.startsWith('**')) {
        transcriptLines.push(trimmedLine);
      } else if (currentSection === 'objectives' && trimmedLine.startsWith('-')) {
        videoData.objectives.push(trimmedLine.replace('-', '').trim());
      }
    });

    videoData.transcript = transcriptLines.join('\n');
    videoData.description = videoData.description.trim();

    return videoData;
  };

  const videoData = parseVideoData(script);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleComplete = () => {
    onComplete();
  };

  // Simulate video progress (in real implementation, this would come from video element)
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <Play className="h-5 w-5" />
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

      {/* Video Player */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="relative bg-gray-900 aspect-video">
          {videoData.videoUrl ? (
            <iframe
              src={videoData.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={videoData.title || activite.titre_ecran}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="bg-white/20 rounded-full p-6 mb-4 inline-block">
                  <Play className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {videoData.title || activite.titre_ecran}
                </h3>
                <p className="text-gray-300 mb-6">
                  {videoData.description || activite.resume_contenu}
                </p>
                <button
                  onClick={handlePlayPause}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isPlaying ? 'Pause' : 'Lire la vidéo'}
                </button>
              </div>
            </div>
          )}
          
          {/* Custom Controls Overlay (for demo video) */}
          {!videoData.videoUrl && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                
                <div className="flex-1">
                  <div className="bg-white/30 rounded-full h-1">
                    <div 
                      className="bg-blue-500 rounded-full h-1 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleMute}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                
                <button className="text-white hover:text-blue-400 transition-colors">
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Information */}
      {videoData.description && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            À propos de cette vidéo
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {videoData.description}
          </p>
        </div>
      )}

      {/* Learning Objectives */}
      {videoData.objectives.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Objectifs d'apprentissage
          </h3>
          <ul className="space-y-2">
            {videoData.objectives.map((objective, index) => (
              <li key={index} className="flex items-start text-blue-800">
                <span className="text-blue-600 mr-2">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transcript */}
      {videoData.transcript && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transcription
          </h3>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {videoData.transcript}
            </pre>
          </div>
        </div>
      )}

      {/* Objective */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Objectif d'apprentissage
        </h3>
        <p className="text-blue-800">
          {activite.objectif_lie}
        </p>
      </div>

      {/* Complete Button */}
      <div className="flex justify-center">
        <button
          onClick={handleComplete}
          disabled={!hasStarted && progress < 80}
          className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
            hasStarted || progress >= 80
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {hasStarted || progress >= 80 ? 'Marquer comme terminé' : 'Regardez la vidéo pour continuer'}
        </button>
      </div>
    </div>
  );
};

export default VideoContent;