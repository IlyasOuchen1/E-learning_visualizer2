import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TextContent from './components/TextContent';
import QuizContent from './components/QuizContent';
import AccordionContent from './components/AccordionContent';
import VideoContent from './components/VideoContent';
import ImageContent from './components/ImageContent';
import WelcomeScreen from './components/WelcomeScreen';
import JsonImporter from './components/JsonImporter';
import defaultContentData from './data/content.json';

function App() {
  const [currentSection, setCurrentSection] = useState<string>('');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [contentData, setContentData] = useState<any>(null);
  const [showImporter, setShowImporter] = useState(true);

  useEffect(() => {
    // Vérifier le localStorage
    const savedContent = localStorage.getItem('e-learning-content');
    const savedProgress = localStorage.getItem('e-learning-progress');
    
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setContentData(parsedContent);
        setShowImporter(false);
        
        if (savedProgress) {
          const { completed, current } = JSON.parse(savedProgress);
          setCompletedSections(completed || []);
          setCurrentSection(current || '');
        }
      } catch (error) {
        console.error('Error loading saved content:', error);
        // En cas d'erreur, afficher l'importateur
        setShowImporter(true);
      }
    } else {
      // Pas de contenu sauvegardé, afficher l'importateur
      setShowImporter(true);
    }
  }, []);

  useEffect(() => {
    // Update document title based on content
    if (contentData?.metadata) {
      const title = contentData.metadata.titre || 
                   contentData.metadata.title || 
                   'Template E-learning';
      document.title = title;
    }
  }, [contentData]);

  useEffect(() => {
    // Save progress to localStorage
    if (contentData && (currentSection || completedSections.length > 0)) {
      localStorage.setItem('e-learning-progress', JSON.stringify({
        completed: completedSections,
        current: currentSection
      }));
      
    }
  }, [currentSection, completedSections, contentData]);

  const handleContentLoad = (newContent: any) => {
    setContentData(newContent);
    setShowImporter(false);
    setShowWelcome(true);
    setCurrentSection('');
    setCompletedSections([]);
    
    // Save the new content
    localStorage.setItem('e-learning-content', JSON.stringify(newContent));
    // Clear old progress
    localStorage.removeItem('e-learning-progress');
  };

  const handleNewImport = () => {
    setShowImporter(true);
    setShowWelcome(true);
    setCurrentSection('');
    setCompletedSections([]);
    // Clear saved data
    localStorage.removeItem('e-learning-content');
    localStorage.removeItem('e-learning-progress');
  };

  // Show importer if no content is loaded
  if (showImporter || !contentData) {
    return <JsonImporter onContentLoad={handleContentLoad} />;
  }

  const handleStart = () => {
    setShowWelcome(false);
    if (!currentSection) {
      // Get first section in order
      const firstSection = Object.keys(contentData.scripts).sort((a, b) => {
        const aNum = parseInt(a.match(/^(\d+)-/)?.[1] || '999');
        const bNum = parseInt(b.match(/^(\d+)-/)?.[1] || '999');
        return aNum - bNum;
      })[0];
      setCurrentSection(firstSection);
    }
  };


  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
  };

  const handleComplete = () => {
    if (currentSection && !completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    
    // Move to next section
    const sections = Object.keys(contentData.scripts).sort((a, b) => {
      const aNum = parseInt(a.match(/^(\d+)-/)?.[1] || '999');
      const bNum = parseInt(b.match(/^(\d+)-/)?.[1] || '999');
      return aNum - bNum;
    });
    
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    } else {
      // Toutes les sections sont terminées
      handleLearningComplete();
    }
  };

  const handleLearningComplete = () => {
    // Logique de fin d'apprentissage
    console.log('Apprentissage terminé !');
  };

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStart={handleStart} 
        contentData={contentData}
        onNewImport={handleNewImport}
      />
    );
  }

  const currentContent = contentData.scripts[currentSection];

  const renderContent = () => {
    if (!currentContent) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sélectionnez une section
            </h2>
            <p className="text-gray-600">
              Choisissez une section dans la barre latérale pour commencer.
            </p>
          </div>
        </div>
      );
    }

    const activityType = currentContent.activite.type_activite;

    switch (activityType) {
      case 'text':
        return <TextContent content={currentContent} onComplete={handleComplete} />;
      case 'quiz':
        return <QuizContent content={currentContent} onComplete={handleComplete} />;
      case 'accordion':
        return <AccordionContent content={currentContent} onComplete={handleComplete} />;
      case 'video':
        return <VideoContent content={currentContent} onComplete={handleComplete} />;
      case 'image':
        return <ImageContent content={currentContent} onComplete={handleComplete} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Type d'activité non supporté
              </h2>
              <p className="text-gray-600">
                Le type d'activité "{activityType}" n'est pas encore supporté.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        completedSections={completedSections}
        contentData={contentData}
        onNewImport={handleNewImport}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;