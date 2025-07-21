import React, { useState } from 'react';
import { Clock, Target, ChevronDown, ChevronRight, List } from 'lucide-react';

interface AccordionContentProps {
  content: any;
  onComplete: () => void;
}

interface AccordionSection {
  title: string;
  content: string;
  isOpen: boolean;
}

const AccordionContent: React.FC<AccordionContentProps> = ({ content, onComplete }) => {
  const { activite, script } = content;
  const [sections, setSections] = useState<AccordionSection[]>([]);
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  React.useEffect(() => {
    parseSections();
  }, [script]);

  const parseSections = () => {
    const lines = script.split('\n');
    const parsedSections: AccordionSection[] = [];
    let currentSection: AccordionSection | null = null;
    let currentContent: string[] = [];
    let inSection = false;

    lines.forEach((line, index) => {
      // Match section headers like "**Section 1: Title**" or "**Section 1: Title (Action)**"
      const sectionMatch = line.match(/^\*\*Section\s+\d+\s*:\s*(.+?)(\s*\([^)]*\))?\*\*$/);
      
      if (sectionMatch) {
        // Save previous section if it exists
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          parsedSections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          title: sectionMatch[1].trim(),
          content: '',
          isOpen: false
        };
        currentContent = [];
        inSection = true;
      } else if (inSection && line.trim() !== '' && !line.match(/^---+$/)) {
        // Add content to current section, skip separator lines
        currentContent.push(line);
      } else if (line.match(/^---+$/) && currentSection) {
        // End of section marker
        currentSection.content = currentContent.join('\n').trim();
        parsedSections.push(currentSection);
        currentSection = null;
        currentContent = [];
        inSection = false;
      }
    });

    // Add the last section if it exists
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      parsedSections.push(currentSection);
    }

    // If no sections found with the standard format, try alternative parsing
    if (parsedSections.length === 0) {
      const alternativeSections = parseAlternativeFormat(script);
      setSections(alternativeSections);
    } else {
      setSections(parsedSections);
    }
  };

  const parseAlternativeFormat = (text: string): AccordionSection[] => {
    // Try to parse different formats
    const sections: AccordionSection[] = [];
    
    // Look for numbered sections or headers
    const headerMatches = text.match(/(?:^|\n)((?:\d+\.|\*\*|##)\s*.+?)(?=\n(?:\d+\.|\*\*|##)|$)/gs);
    
    if (headerMatches && headerMatches.length > 1) {
      headerMatches.forEach((match, index) => {
        const lines = match.trim().split('\n');
        const title = lines[0].replace(/^\d+\.\s*|\*\*|\##/g, '').trim();
        const content = lines.slice(1).join('\n').trim();
        
        if (title && content) {
          sections.push({
            title,
            content,
            isOpen: false
          });
        }
      });
    } else {
      // Fallback: create sections from paragraphs
      const paragraphs = text.split('\n\n').filter(p => p.trim());
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.length > 50) { // Only substantial paragraphs
          const lines = paragraph.split('\n');
          const title = `Section ${index + 1}`;
          sections.push({
            title,
            content: paragraph.trim(),
            isOpen: false
          });
        }
      });
    }

    return sections;
  };

  const toggleSection = (index: number) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gm, '<li class="mb-2 ml-4">$1</li>')
      .replace(/(\n|^)([^<\n-].*?)(\n|$)/g, '<p class="mb-3 text-gray-700 leading-relaxed">$2</p>')
      .replace(/(<li.*?>[\s\S]*?<\/li>)/g, '<ul class="list-disc pl-6 mb-4 space-y-1">$1</ul>');
  };

  const handleComplete = () => {
    onComplete();
  };

  const allSectionsOpened = sections.length > 0 && openSections.size === sections.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <List className="h-5 w-5" />
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
      <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Instructions
        </h2>
        <p className="text-blue-800 mb-3">
          {activite.resume_contenu}
        </p>
        <p className="text-sm text-blue-700">
          Cliquez sur chaque section pour révéler son contenu. Explorez toutes les sections pour compléter cette activité.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {openSections.size} sur {sections.length} sections explorées
          </span>
          <span className="text-sm text-gray-500">
            {sections.length > 0 ? Math.round((openSections.size / sections.length) * 100) : 0}% terminé
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${sections.length > 0 ? (openSections.size / sections.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Debug info */}
      {sections.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Debug:</strong> Aucune section détectée. Contenu brut affiché ci-dessous.
          </p>
        </div>
      )}

      {/* Accordion Sections */}
      <div className="space-y-4">
        {sections.length > 0 ? (
          sections.map((section, index) => {
            const isOpen = openSections.has(index);
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-gray-500 transform transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500 transform transition-transform duration-200" />
                    )}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4">
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Fallback: show raw content
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenu</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(script) }}
            />
          </div>
        )}
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
          disabled={sections.length > 0 && !allSectionsOpened}
          className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg ${
            sections.length === 0 || allSectionsOpened
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {sections.length === 0 || allSectionsOpened ? 'Marquer comme terminé' : 'Explorez toutes les sections'}
        </button>
      </div>
    </div>
  );
};

export default AccordionContent;