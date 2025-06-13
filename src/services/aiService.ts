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
  private questionCache: Map<string, Question[]> = new Map();

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
        id: `${topic.toLowerCase()}_lv${level}_q${index}_${Date.now()}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }))
    };
  }

  private getQuestionTemplates(topic: string, level: number) {
    const templates: Record<string, Record<number, any[]>> = {
      'JavaScript': {
        0: [ // Beginner Level 0
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['variable myVar = 5;', 'var myVar = 5;', 'declare myVar = 5;', 'int myVar = 5;'],
            correct: 1,
            explanation: 'In JavaScript, you use "var", "let", or "const" to declare variables. "var" is the traditional way.'
          },
          {
            question: 'Which of the following is a JavaScript data type?',
            options: ['string', 'integer', 'float', 'character'],
            correct: 0,
            explanation: 'JavaScript has primitive data types including string, number, boolean, undefined, null, and symbol.'
          },
          {
            question: 'How do you write a comment in JavaScript?',
            options: ['<!-- This is a comment -->', '/* This is a comment */', '# This is a comment', 'comment: This is a comment'],
            correct: 1,
            explanation: 'JavaScript uses /* */ for multi-line comments and // for single-line comments.'
          },
          {
            question: 'What does console.log() do?',
            options: ['Creates a new variable', 'Prints output to the console', 'Deletes a variable', 'Creates a function'],
            correct: 1,
            explanation: 'console.log() is used to output information to the browser console for debugging purposes.'
          },
          {
            question: 'Which operator is used for equality comparison in JavaScript?',
            options: ['=', '==', '===', 'equals'],
            correct: 2,
            explanation: '=== is the strict equality operator that compares both value and type without type coercion.'
          }
        ],
        1: [ // Beginner Level 1
          {
            question: 'What is the output of the following code?\n\nconsole.log(typeof null);',
            options: ['null', 'undefined', 'object', 'boolean'],
            correct: 2,
            explanation: 'In JavaScript, typeof null returns "object" due to a historical bug that has been kept for backward compatibility.'
          },
          {
            question: 'Which method is used to add an element to the end of an array?',
            options: ['append()', 'push()', 'add()', 'insert()'],
            correct: 1,
            explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
          },
          {
            question: 'What is the difference between let and var?',
            options: [
              'No difference',
              'let has block scope, var has function scope',
              'var has block scope, let has function scope',
              'let is older than var'
            ],
            correct: 1,
            explanation: 'let has block scope and cannot be redeclared, while var has function scope and can be redeclared.'
          },
          {
            question: 'How do you create a function in JavaScript?',
            options: [
              'function myFunction() {}',
              'create function myFunction() {}',
              'def myFunction() {}',
              'function = myFunction() {}'
            ],
            correct: 0,
            explanation: 'Functions in JavaScript are declared using the "function" keyword followed by the function name.'
          },
          {
            question: 'What does the return statement do in a function?',
            options: [
              'Stops the function and returns a value',
              'Continues the function execution',
              'Declares a variable',
              'Creates a loop'
            ],
            correct: 0,
            explanation: 'The return statement stops function execution and returns a value to the function caller.'
          }
        ],
        2: [ // Intermediate Level 2
          {
            question: 'What is closure in JavaScript?',
            options: [
              'A way to close the browser',
              'A function that has access to outer scope variables',
              'A method to end a loop',
              'A type of variable declaration'
            ],
            correct: 1,
            explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.'
          },
          {
            question: 'What does the "this" keyword refer to?',
            options: [
              'Always the global object',
              'The current function',
              'The object that owns the method being executed',
              'The parent object'
            ],
            correct: 2,
            explanation: 'The "this" keyword refers to the object that owns the method being executed, though its value can change depending on how a function is called.'
          },
          {
            question: 'What is the purpose of the async/await syntax?',
            options: [
              'To create synchronous code',
              'To handle asynchronous operations more readably',
              'To create loops',
              'To declare variables'
            ],
            correct: 1,
            explanation: 'async/await provides a cleaner way to work with Promises and asynchronous code, making it look more like synchronous code.'
          },
          {
            question: 'What is event bubbling?',
            options: [
              'Creating new events',
              'Events propagating from child to parent elements',
              'Deleting events',
              'Events happening simultaneously'
            ],
            correct: 1,
            explanation: 'Event bubbling is when an event starts from the target element and bubbles up through its parent elements.'
          },
          {
            question: 'What is the difference between == and ===?',
            options: [
              'No difference',
              '== checks type and value, === checks only value',
              '=== checks type and value, == checks only value',
              '=== checks type and value, == performs type coercion'
            ],
            correct: 3,
            explanation: '=== is strict equality that checks both type and value, while == performs type coercion before comparison.'
          }
        ],
        3: [ // Intermediate Level 3
          {
            question: 'What is a Promise in JavaScript?',
            options: [
              'A guarantee that code will work',
              'An object representing eventual completion of an async operation',
              'A type of variable',
              'A method to create functions'
            ],
            correct: 1,
            explanation: 'A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.'
          },
          {
            question: 'What does Array.prototype.map() return?',
            options: [
              'The original array modified',
              'A new array with transformed elements',
              'A single value',
              'Nothing'
            ],
            correct: 1,
            explanation: 'The map() method creates a new array with the results of calling a function for every array element.'
          },
          {
            question: 'What is destructuring in JavaScript?',
            options: [
              'Breaking code',
              'Extracting values from arrays or objects into variables',
              'Deleting variables',
              'Creating new objects'
            ],
            correct: 1,
            explanation: 'Destructuring allows you to extract values from arrays or properties from objects into distinct variables.'
          },
          {
            question: 'What is the spread operator (...) used for?',
            options: [
              'Creating comments',
              'Expanding arrays or objects',
              'Creating functions',
              'Declaring variables'
            ],
            correct: 1,
            explanation: 'The spread operator (...) allows an iterable to be expanded in places where zero or more arguments or elements are expected.'
          },
          {
            question: 'What is hoisting in JavaScript?',
            options: [
              'Moving code to the top of the file',
              'Variable and function declarations being moved to the top of their scope',
              'Creating new variables',
              'Deleting old code'
            ],
            correct: 1,
            explanation: 'Hoisting is JavaScript\'s behavior of moving variable and function declarations to the top of their containing scope during compilation.'
          }
        ],
        4: [ // Advanced Level 4
          {
            question: 'What is the purpose of WeakMap in JavaScript?',
            options: [
              'A map with weak references to keys',
              'A smaller version of Map',
              'A map that can be easily deleted',
              'A map with limited functionality'
            ],
            correct: 0,
            explanation: 'WeakMap holds weak references to its keys, allowing garbage collection of keys when there are no other references to them.'
          },
          {
            question: 'What is a generator function?',
            options: [
              'A function that creates other functions',
              'A function that can pause and resume execution',
              'A function that generates random numbers',
              'A function that creates objects'
            ],
            correct: 1,
            explanation: 'Generator functions can pause and resume their execution, yielding multiple values over time using the yield keyword.'
          },
          {
            question: 'What is the purpose of Proxy in JavaScript?',
            options: [
              'To create network proxies',
              'To intercept and customize operations on objects',
              'To create copies of objects',
              'To delete objects'
            ],
            correct: 1,
            explanation: 'Proxy allows you to intercept and customize operations performed on objects (property lookup, assignment, enumeration, etc.).'
          },
          {
            question: 'What is the difference between call() and apply()?',
            options: [
              'No difference',
              'call() takes arguments individually, apply() takes an array',
              'apply() takes arguments individually, call() takes an array',
              'They work on different types of functions'
            ],
            correct: 1,
            explanation: 'call() takes arguments individually, while apply() takes arguments as an array. Both set the "this" context.'
          },
          {
            question: 'What is a Symbol in JavaScript?',
            options: [
              'A mathematical symbol',
              'A primitive data type for unique identifiers',
              'A type of string',
              'A type of number'
            ],
            correct: 1,
            explanation: 'Symbol is a primitive data type that creates unique identifiers for object properties.'
          }
        ],
        5: [ // Advanced Level 5
          {
            question: 'What is the purpose of the Reflect API?',
            options: [
              'To create mirrors of objects',
              'To provide methods for interceptable JavaScript operations',
              'To reflect light in the browser',
              'To create reflective properties'
            ],
            correct: 1,
            explanation: 'Reflect provides methods for interceptable JavaScript operations, often used with Proxy for meta-programming.'
          },
          {
            question: 'What is a SharedArrayBuffer?',
            options: [
              'A buffer shared between functions',
              'A buffer that can be shared between workers',
              'A buffer that shares memory with other arrays',
              'A buffer that can be copied'
            ],
            correct: 1,
            explanation: 'SharedArrayBuffer represents a generic, fixed-length raw binary data buffer that can be shared between workers.'
          },
          {
            question: 'What is the purpose of BigInt?',
            options: [
              'To create very large objects',
              'To represent integers larger than Number.MAX_SAFE_INTEGER',
              'To create big arrays',
              'To handle big strings'
            ],
            correct: 1,
            explanation: 'BigInt is a primitive that can represent integers larger than 2^53 - 1, which is the largest number JavaScript can reliably represent.'
          },
          {
            question: 'What is the difference between microtasks and macrotasks?',
            options: [
              'Microtasks are smaller than macrotasks',
              'Microtasks have higher priority in the event loop',
              'Macrotasks have higher priority in the event loop',
              'There is no difference'
            ],
            correct: 1,
            explanation: 'Microtasks (like Promise callbacks) have higher priority and are executed before macrotasks (like setTimeout) in the event loop.'
          },
          {
            question: 'What is the purpose of the optional chaining operator (?.)?',
            options: [
              'To create optional parameters',
              'To safely access nested object properties',
              'To create conditional statements',
              'To chain function calls'
            ],
            correct: 1,
            explanation: 'Optional chaining (?.) allows you to safely access nested object properties without throwing an error if a reference is null or undefined.'
          }
        ]
      },
      'Python': {
        0: [
          {
            question: 'How do you print "Hello World" in Python?',
            options: ['echo "Hello World"', 'print("Hello World")', 'console.log("Hello World")', 'printf("Hello World")'],
            correct: 1,
            explanation: 'In Python, the print() function is used to output text to the console.'
          },
          {
            question: 'Which of the following is the correct way to create a variable in Python?',
            options: ['var x = 5', 'int x = 5', 'x = 5', 'declare x = 5'],
            correct: 2,
            explanation: 'Python uses dynamic typing, so you simply assign a value to a variable name without declaring its type.'
          },
          {
            question: 'What is the correct file extension for Python files?',
            options: ['.py', '.python', '.pt', '.pyt'],
            correct: 0,
            explanation: 'Python files use the .py extension.'
          },
          {
            question: 'How do you create a comment in Python?',
            options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
            correct: 2,
            explanation: 'Python uses the # symbol for single-line comments.'
          },
          {
            question: 'Which of the following is a Python data type?',
            options: ['list', 'array', 'vector', 'collection'],
            correct: 0,
            explanation: 'List is a built-in data type in Python used to store multiple items in a single variable.'
          }
        ],
        1: [
          {
            question: 'What is the output of print(type([]))?',
            options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
            correct: 1,
            explanation: 'Empty square brackets [] create a list in Python, so type([]) returns <class \'list\'>.'
          },
          {
            question: 'Which method is used to add an item to a Python list?',
            options: ['add()', 'append()', 'insert()', 'Both append() and insert()'],
            correct: 3,
            explanation: 'Both append() (adds to end) and insert() (adds at specific index) can be used to add items to a list.'
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
            question: 'How do you create a function in Python?',
            options: ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'],
            correct: 1,
            explanation: 'Python functions are defined using the "def" keyword followed by the function name and parentheses.'
          },
          {
            question: 'What is indentation used for in Python?',
            options: [
              'Just for readability',
              'To define code blocks and scope',
              'To create comments',
              'To separate statements'
            ],
            correct: 1,
            explanation: 'Python uses indentation to define code blocks and scope, unlike other languages that use braces.'
          }
        ]
      },
      'React': {
        0: [
          {
            question: 'What is React?',
            options: [
              'A JavaScript library for building user interfaces',
              'A database management system',
              'A web server',
              'A CSS framework'
            ],
            correct: 0,
            explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, particularly web applications.'
          },
          {
            question: 'What is JSX?',
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
            question: 'How do you create a React component?',
            options: [
              'function MyComponent() { return <div>Hello</div>; }',
              'component MyComponent() { return <div>Hello</div>; }',
              'create MyComponent() { return <div>Hello</div>; }',
              'class MyComponent() { return <div>Hello</div>; }'
            ],
            correct: 0,
            explanation: 'React functional components are created using regular JavaScript functions that return JSX.'
          },
          {
            question: 'What is the virtual DOM?',
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
            question: 'How do you pass data to a React component?',
            options: ['Through state', 'Through props', 'Through context', 'Through refs'],
            correct: 1,
            explanation: 'Props (properties) are the primary way to pass data from parent components to child components in React.'
          }
        ],
        1: [
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
            question: 'How do you handle events in React?',
            options: [
              'onClick="handleClick()"',
              'onClick={handleClick}',
              'onclick={handleClick}',
              'onPress={handleClick}'
            ],
            correct: 1,
            explanation: 'React uses camelCase event handlers and passes functions as references, not strings.'
          },
          {
            question: 'What is the key prop used for in React lists?',
            options: [
              'To style list items',
              'To help React identify which items have changed',
              'To sort the list',
              'To filter the list'
            ],
            correct: 1,
            explanation: 'The key prop helps React identify which items have changed, are added, or are removed for efficient re-rendering.'
          },
          {
            question: 'What is conditional rendering in React?',
            options: [
              'Rendering components based on conditions',
              'Rendering components in a specific order',
              'Rendering components with CSS conditions',
              'Rendering components asynchronously'
            ],
            correct: 0,
            explanation: 'Conditional rendering allows you to render different components or elements based on certain conditions.'
          }
        ]
      }
    };

    // Get questions for the topic and level
    const topicQuestions = templates[topic];
    if (!topicQuestions) {
      // Fallback to JavaScript if topic not found
      return templates['JavaScript'][0] || [];
    }

    const levelQuestions = topicQuestions[level];
    if (!levelQuestions) {
      // Fallback to level 0 if level not found
      return topicQuestions[0] || templates['JavaScript'][0] || [];
    }

    return levelQuestions;
  }

  getAvailableTopics(): string[] {
    return ['JavaScript', 'Python', 'React', 'Machine Learning', 'Data Science', 'Web Development'];
  }

  async generateQuestions(request: QuestionGenerationRequest): Promise<Question[]> {
    // Create a cache key based on topic and level
    const cacheKey = `${request.topic.toLowerCase()}_level_${request.level}`;
    
    // Check if we have cached questions for this topic and level
    if (this.questionCache.has(cacheKey)) {
      console.log(`Using cached questions for ${request.topic} Level ${request.level}`);
      return this.questionCache.get(cacheKey)!;
    }

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
      const questions = response.questions;
      
      // Cache the generated questions
      this.questionCache.set(cacheKey, questions);
      console.log(`Generated and cached ${questions.length} questions for ${request.topic} Level ${request.level}`);
      
      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to template questions
      const fallbackQuestions = this.getQuestionTemplates(request.topic, request.level).map((template, index) => ({
        id: `${request.topic.toLowerCase()}_lv${request.level}_q${index}_${Date.now()}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }));
      
      // Cache the fallback questions too
      this.questionCache.set(cacheKey, fallbackQuestions);
      
      return fallbackQuestions;
    }
  }

  async generateQuestionsForTopic(topicName: string, level: number = 0): Promise<Question[]> {
    const difficulty = level <= 1 ? 'beginner' : level <= 3 ? 'intermediate' : 'advanced';
    
    console.log(`Generating questions for ${topicName} Level ${level} (${difficulty})`);
    
    return this.generateQuestions({
      topic: topicName,
      level,
      questionCount: 5, // Generate exactly 5 questions per level
      difficulty
    });
  }

  // Method to clear cache if needed
  clearCache(): void {
    this.questionCache.clear();
  }

  // Method to get cache status
  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.questionCache.size,
      keys: Array.from(this.questionCache.keys())
    };
  }
}

export const aiService = new AIService();
export type { Question, QuestionGenerationRequest };