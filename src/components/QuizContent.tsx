import React, { useState } from 'react';
import { Clock, Target, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuizContentProps {
  content: any;
  onComplete: () => void;
}

interface Question {
  question: string;
  options: { [key: string]: string };
  correct: string;
}

const QuizContent: React.FC<QuizContentProps> = ({ content, onComplete }) => {
  const { activite, script } = content;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Parse quiz data from script
  const parseQuizData = (scriptText: string): Question[] => {
    try {
      // Try different JSON extraction patterns
      let jsonMatch = scriptText.match(/```json\n([\s\S]*?)\n```/);
      
      if (!jsonMatch) {
        // Try without markdown code blocks
        jsonMatch = scriptText.match(/\[([\s\S]*)\]/);
        if (jsonMatch) {
          jsonMatch[1] = '[' + jsonMatch[1] + ']';
        }
      }
      
      if (jsonMatch) {
        const jsonText = jsonMatch[1].trim();
        return JSON.parse(jsonText);
      }
      
      // Try to parse the entire script as JSON
      if (scriptText.trim().startsWith('[') || scriptText.trim().startsWith('{')) {
        return JSON.parse(scriptText.trim());
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      console.log('Script content:', scriptText);
      return [];
    }
  };

  const questions: Question[] = parseQuizData(script);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || '');
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
    }
  };

  const getScore = () => {
    return answers.filter((answer, index) => answer === questions[index]?.correct).length;
  };

  const getScorePercentage = () => {
    return Math.round((getScore() / questions.length) * 100);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-red-700">
            Impossible de charger les questions du quiz. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = getScore();
    const percentage = getScorePercentage();
    const isPass = percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <HelpCircle className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              {activite.num_ecran} - Résultats
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activite.titre_ecran}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              isPass ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPass ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isPass ? 'Félicitations !' : 'Continuez vos efforts'}
            </h2>
            <p className="text-gray-600 mb-6">
              Vous avez obtenu {score} sur {questions.length} ({percentage}%)
            </p>
            
            <div className="bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  isPass ? 'bg-green-600' : 'bg-red-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Question {index + 1}: {question.question}
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(question.options).map(([key, option]) => (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border ${
                              key === question.correct
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : key === userAnswer && !isCorrect
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            <span className="font-medium">{key}:</span> {option}
                            {key === question.correct && (
                              <span className="float-right text-green-600">✓ Correct</span>
                            )}
                            {key === userAnswer && !isCorrect && (
                              <span className="float-right text-red-600">✗ Votre réponse</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <HelpCircle className="h-5 w-5" />
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
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} sur {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}% terminé
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {Object.entries(question.options).map(([key, option]) => (
            <label
              key={key}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedAnswer === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={key}
                checked={selectedAnswer === key}
                onChange={() => handleAnswerSelect(key)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswer === key
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === key && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-medium text-gray-900 mr-3">{key}:</span>
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
            currentQuestion === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          Précédent
        </button>
        
        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
            !selectedAnswer
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
        </button>
      </div>
    </div>
  );
};

export default QuizContent;