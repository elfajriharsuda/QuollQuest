interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

interface QuestionGenerationRequest {
  topic: string;
  level: number;
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

class AIService {
  private async callOpenAI(prompt: string): Promise<any> {
    // In a real implementation, you would call OpenAI API here
    // For now, we'll simulate AI generation with more realistic questions
    return this.generateRealisticQuestions(prompt);
  }

  private generateRealisticQuestions(prompt: string): any {
    const topicMatch = prompt.match(/topic:\s*([^,\n]+)/i);
    const levelMatch = prompt.match(/level:\s*(\d+)/i);
    const topic = topicMatch ? topicMatch[1].trim() : 'Programming';
    const level = levelMatch ? parseInt(levelMatch[1]) : 0;

    const questionTemplates = this.getQuestionTemplates(topic, level);
    
    return {
      questions: questionTemplates.map((template, index) => ({
        id: `q_${Date.now()}_${index}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }))
    };
  }

  private getQuestionTemplates(topic: string, level: number) {
    const templates: Record<string, any[]> = {
      'JavaScript': [
        {
          question: `What is the output of the following JavaScript code?\n\nconsole.log(typeof null);`,
          options: ['null', 'undefined', 'object', 'boolean'],
          correct: 2,
          explanation: 'In JavaScript, typeof null returns "object" due to a historical bug that has been kept for backward compatibility.'
        },
        {
          question: 'Which method is used to add an element to the end of an array in JavaScript?',
          options: ['append()', 'push()', 'add()', 'insert()'],
          correct: 1,
          explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.'
        },
        {
          question: 'What is the difference between == and === in JavaScript?',
          options: [
            'No difference, they are identical',
            '== checks type and value, === checks only value',
            '=== checks type and value, == checks only value',
            '=== checks type and value, == performs type coercion'
          ],
          correct: 3,
          explanation: '=== is strict equality that checks both type and value, while == performs type coercion before comparison.'
        },
        {
          question: 'Which of the following is NOT a JavaScript data type?',
          options: ['string', 'boolean', 'integer', 'symbol'],
          correct: 2,
          explanation: 'JavaScript has number type but not specifically integer. All numbers in JavaScript are floating-point.'
        },
        {
          question: 'What does the "this" keyword refer to in JavaScript?',
          options: [
            'Always the global object',
            'The current function',
            'The object that owns the method being executed',
            'The parent object'
          ],
          correct: 2,
          explanation: 'The "this" keyword refers to the object that owns the method being executed, though its value can change depending on how a function is called.'
        }
      ],
      'Python': [
        {
          question: 'What is the output of print(type([]))?',
          options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
          correct: 1,
          explanation: 'Empty square brackets [] create a list in Python, so type([]) returns <class \'list\'>.'
        },
        {
          question: 'Which of the following is used to create a virtual environment in Python?',
          options: ['pip install venv', 'python -m venv', 'create-env', 'virtualenv only'],
          correct: 1,
          explanation: 'python -m venv is the standard way to create virtual environments in Python 3.3+.'
        },
        {
          question: 'What is the difference between a list and a tuple in Python?',
          options: [
            'Lists are ordered, tuples are not',
            'Lists are mutable, tuples are immutable',
            'Lists use [], tuples use {}',
            'No difference'
          ],
          correct: 1,
          explanation: 'The main difference is that lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation).'
        },
        {
          question: 'Which method is used to add an item to a Python list?',
          options: ['add()', 'append()', 'insert()', 'Both append() and insert()'],
          correct: 3,
          explanation: 'Both append() (adds to end) and insert() (adds at specific index) can be used to add items to a list.'
        },
        {
          question: 'What is a Python decorator?',
          options: [
            'A way to modify or extend functions',
            'A type of loop',
            'A data structure',
            'An error handling mechanism'
          ],
          correct: 0,
          explanation: 'A decorator is a design pattern that allows you to modify or extend the behavior of functions or classes.'
        }
      ],
      'React': [
        {
          question: 'What is JSX in React?',
          options: [
            'A new programming language',
            'JavaScript XML - a syntax extension',
            'A CSS framework',
            'A database query language'
          ],
          correct: 1,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.'
        },
        {
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1,
          explanation: 'useState is the primary hook for managing state in functional React components.'
        },
        {
          question: 'What is the purpose of useEffect hook?',
          options: [
            'To manage component state',
            'To handle side effects',
            'To create context',
            'To optimize performance'
          ],
          correct: 1,
          explanation: 'useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM.'
        },
        {
          question: 'What is the virtual DOM in React?',
          options: [
            'A copy of the real DOM kept in memory',
            'A new type of HTML',
            'A CSS framework',
            'A database'
          ],
          correct: 0,
          explanation: 'The virtual DOM is a JavaScript representation of the real DOM kept in memory and synced with the real DOM.'
        },
        {
          question: 'How do you pass data from parent to child component in React?',
          options: ['Through state', 'Through props', 'Through context', 'Through refs'],
          correct: 1,
          explanation: 'Props (properties) are the primary way to pass data from parent components to child components in React.'
        }
      ]
    };

    // Get questions for the topic, fallback to JavaScript if topic not found
    const topicQuestions = templates[topic] || templates['JavaScript'];
    
    // Adjust difficulty based on level
    let selectedQuestions = [...topicQuestions];
    
    if (level === 0) {
      // Beginner level - use first 3 questions
      selectedQuestions = topicQuestions.slice(0, 3);
    } else if (level <= 2) {
      // Intermediate level - use middle questions
      selectedQuestions = topicQuestions.slice(1, 4);
    } else {
      // Advanced level - use last questions
      selectedQuestions = topicQuestions.slice(2);
    }

    // Ensure we have at least 5 questions by repeating if necessary
    while (selectedQuestions.length < 5) {
      selectedQuestions = [...selectedQuestions, ...topicQuestions];
    }

    return selectedQuestions.slice(0, 10); // Return max 10 questions
  }

  async generateQuestions(request: QuestionGenerationRequest): Promise<Question[]> {
    const prompt = `Generate ${request.questionCount} multiple choice questions about ${request.topic} at level ${request.level} (${request.difficulty} difficulty). 
    
    Each question should:
    - Be relevant to ${request.topic}
    - Have 4 multiple choice options
    - Have exactly one correct answer
    - Include an explanation for the correct answer
    - Be appropriate for ${request.difficulty} level learners
    
    Topic: ${request.topic}
    Level: ${request.level}
    Difficulty: ${request.difficulty}
    Question Count: ${request.questionCount}`;

    try {
      const response = await this.callOpenAI(prompt);
      return response.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to template questions
      return this.getQuestionTemplates(request.topic, request.level).map((template, index) => ({
        id: `fallback_${Date.now()}_${index}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }));
    }
  }

  async generateQuestionsForTopic(topicName: string, level: number = 0): Promise<Question[]> {
    const difficulty = level <= 1 ? 'beginner' : level <= 3 ? 'intermediate' : 'advanced';
    
    return this.generateQuestions({
      topic: topicName,
      level,
      questionCount: 10,
      difficulty
    });
  }
}

export const aiService = new AIService();
export type { Question, QuestionGenerationRequest };