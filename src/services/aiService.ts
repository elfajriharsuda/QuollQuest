export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  level: number;
}

class AIService {
  private supportedTopics = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'TypeScript',
    'HTML',
    'CSS',
    'SQL',
    'Git',
    'Web Development',
    'Machine Learning',
    'Data Science',
    'Algorithms',
    'Data Structures',
    'Computer Science',
    'Programming Fundamentals'
  ];

  getAvailableTopics(): string[] {
    return this.supportedTopics;
  }

  async generateQuestionsForTopic(topic: string, level: number): Promise<Question[]> {
    // Simulate AI question generation with realistic programming questions
    const questions = this.getQuestionsForTopicAndLevel(topic, level);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return questions;
  }

  private getQuestionsForTopicAndLevel(topic: string, level: number): Question[] {
    const topicLower = topic.toLowerCase();
    const difficulty = this.getDifficultyForLevel(level);
    
    if (topicLower.includes('javascript')) {
      return this.getJavaScriptQuestions(level, difficulty);
    } else if (topicLower.includes('python')) {
      return this.getPythonQuestions(level, difficulty);
    } else if (topicLower.includes('react')) {
      return this.getReactQuestions(level, difficulty);
    } else if (topicLower.includes('html')) {
      return this.getHTMLQuestions(level, difficulty);
    } else if (topicLower.includes('css')) {
      return this.getCSSQuestions(level, difficulty);
    } else if (topicLower.includes('sql')) {
      return this.getSQLQuestions(level, difficulty);
    } else if (topicLower.includes('git')) {
      return this.getGitQuestions(level, difficulty);
    } else if (topicLower.includes('machine learning')) {
      return this.getMachineLearningQuestions(level, difficulty);
    } else if (topicLower.includes('data science')) {
      return this.getDataScienceQuestions(level, difficulty);
    } else {
      return this.getGeneralProgrammingQuestions(level, difficulty, topic);
    }
  }

  private getDifficultyForLevel(level: number): 'beginner' | 'intermediate' | 'advanced' {
    if (level <= 1) return 'beginner';
    if (level <= 3) return 'intermediate';
    return 'advanced';
  }

  private getJavaScriptQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'js-1',
          question_text: 'What is the correct way to declare a variable in JavaScript?',
          options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
          correct_answer: 0,
          explanation: 'In JavaScript, variables are declared using var, let, or const keywords.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-2',
          question_text: 'Which of the following is NOT a JavaScript data type?',
          options: ['String', 'Boolean', 'Integer', 'Number'],
          correct_answer: 2,
          explanation: 'JavaScript has Number type for all numeric values, not separate Integer type.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-3',
          question_text: 'How do you write a comment in JavaScript?',
          options: ['<!-- This is a comment -->', '// This is a comment', '# This is a comment', '/* This is a comment'],
          correct_answer: 1,
          explanation: 'Single-line comments in JavaScript start with //. Multi-line comments use /* */',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-4',
          question_text: 'What does the === operator do in JavaScript?',
          options: ['Assignment', 'Equality without type conversion', 'Equality with type conversion', 'Not equal'],
          correct_answer: 1,
          explanation: 'The === operator checks for strict equality without type conversion.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-5',
          question_text: 'Which method is used to add an element to the end of an array?',
          options: ['push()', 'add()', 'append()', 'insert()'],
          correct_answer: 0,
          explanation: 'The push() method adds one or more elements to the end of an array.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-6',
          question_text: 'What is the result of typeof null in JavaScript?',
          options: ['null', 'undefined', 'object', 'boolean'],
          correct_answer: 2,
          explanation: 'This is a known quirk in JavaScript - typeof null returns "object".',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-7',
          question_text: 'How do you create a function in JavaScript?',
          options: ['function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}', 'func myFunction() {}'],
          correct_answer: 0,
          explanation: 'Functions in JavaScript are declared using the function keyword.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-8',
          question_text: 'What does the length property return for an array?',
          options: ['The last index', 'The number of elements', 'The memory size', 'The first element'],
          correct_answer: 1,
          explanation: 'The length property returns the number of elements in an array.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-9',
          question_text: 'Which of these is the correct way to write a JavaScript array?',
          options: ['var colors = "red", "green", "blue"', 'var colors = ["red", "green", "blue"]', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'],
          correct_answer: 1,
          explanation: 'Arrays in JavaScript are created using square brackets [].',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-10',
          question_text: 'What is the correct way to write a JavaScript object?',
          options: ['var person = {firstName:"John", lastName:"Doe"}', 'var person = (firstName:"John", lastName:"Doe")', 'var person = firstName = "John", lastName = "Doe"', 'var person = [firstName:"John", lastName:"Doe"]'],
          correct_answer: 0,
          explanation: 'Objects in JavaScript are created using curly braces {} with key-value pairs.',
          difficulty: 'beginner' as const,
          topic: 'JavaScript',
          level
        }
      ],
      intermediate: [
        {
          id: 'js-int-1',
          question_text: 'What is closure in JavaScript?',
          options: ['A way to close the browser', 'A function that has access to outer scope variables', 'A method to end a loop', 'A type of error'],
          correct_answer: 1,
          explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-2',
          question_text: 'What does the "this" keyword refer to in JavaScript?',
          options: ['The current function', 'The global object', 'The object that owns the method', 'It depends on the context'],
          correct_answer: 3,
          explanation: 'The value of "this" depends on how the function is called - it can refer to different objects in different contexts.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-3',
          question_text: 'What is the difference between let and var?',
          options: ['No difference', 'let has block scope, var has function scope', 'var has block scope, let has function scope', 'let is faster than var'],
          correct_answer: 1,
          explanation: 'let has block scope while var has function scope. let also prevents hoisting issues.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-4',
          question_text: 'What is event bubbling in JavaScript?',
          options: ['Creating new events', 'Events propagating from child to parent elements', 'Events being deleted', 'Events happening in sequence'],
          correct_answer: 1,
          explanation: 'Event bubbling is when an event propagates from the target element up through its parent elements.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-5',
          question_text: 'What does Promise.all() do?',
          options: ['Runs promises sequentially', 'Waits for all promises to resolve', 'Cancels all promises', 'Creates a new promise'],
          correct_answer: 1,
          explanation: 'Promise.all() waits for all input promises to resolve and returns an array of all resolved values.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-6',
          question_text: 'What is the purpose of async/await?',
          options: ['To make code run faster', 'To handle asynchronous operations more readably', 'To create new threads', 'To handle errors'],
          correct_answer: 1,
          explanation: 'async/await provides a more readable way to handle asynchronous operations compared to callbacks and .then().',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-7',
          question_text: 'What is destructuring in JavaScript?',
          options: ['Deleting objects', 'Extracting values from arrays or objects', 'Breaking code', 'Creating new variables'],
          correct_answer: 1,
          explanation: 'Destructuring allows you to extract values from arrays or properties from objects into distinct variables.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-8',
          question_text: 'What is the spread operator (...) used for?',
          options: ['Creating comments', 'Expanding arrays or objects', 'Mathematical operations', 'String concatenation'],
          correct_answer: 1,
          explanation: 'The spread operator (...) expands arrays or objects, allowing you to spread their elements/properties.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-9',
          question_text: 'What is the difference between map() and forEach()?',
          options: ['No difference', 'map() returns a new array, forEach() doesn\'t', 'forEach() is faster', 'map() modifies the original array'],
          correct_answer: 1,
          explanation: 'map() returns a new array with transformed elements, while forEach() just iterates without returning anything.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-int-10',
          question_text: 'What is hoisting in JavaScript?',
          options: ['Moving code to the top', 'Variable and function declarations being moved to the top of their scope', 'Lifting heavy objects', 'Optimizing performance'],
          correct_answer: 1,
          explanation: 'Hoisting is JavaScript\'s behavior of moving variable and function declarations to the top of their containing scope.',
          difficulty: 'intermediate' as const,
          topic: 'JavaScript',
          level
        }
      ],
      advanced: [
        {
          id: 'js-adv-1',
          question_text: 'What is the Event Loop in JavaScript?',
          options: ['A loop that creates events', 'The mechanism that handles asynchronous operations', 'A way to iterate over events', 'A debugging tool'],
          correct_answer: 1,
          explanation: 'The Event Loop is the mechanism that allows JavaScript to perform non-blocking operations by handling the execution of multiple chunks of your program over time.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-2',
          question_text: 'What is the difference between call(), apply(), and bind()?',
          options: ['They are the same', 'call() and apply() invoke immediately, bind() returns a new function', 'bind() is faster', 'apply() only works with arrays'],
          correct_answer: 1,
          explanation: 'call() and apply() invoke the function immediately with a specified this value, while bind() returns a new function with the this value bound.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-3',
          question_text: 'What is a WeakMap in JavaScript?',
          options: ['A map with weak references to keys', 'A map that can be garbage collected', 'A map with limited functionality', 'A map for weak data types'],
          correct_answer: 0,
          explanation: 'WeakMap holds weak references to its keys, meaning if there are no other references to the key, it can be garbage collected.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-4',
          question_text: 'What is the purpose of Proxy in JavaScript?',
          options: ['Network proxy', 'Intercepting and customizing operations on objects', 'Creating copies of objects', 'Hiding object properties'],
          correct_answer: 1,
          explanation: 'Proxy allows you to intercept and customize operations performed on objects (property lookup, assignment, enumeration, function invocation, etc).',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-5',
          question_text: 'What is the difference between microtasks and macrotasks?',
          options: ['Size difference', 'Microtasks have higher priority in the event loop', 'Macrotasks run first', 'No difference'],
          correct_answer: 1,
          explanation: 'Microtasks (like Promise callbacks) have higher priority and are executed before macrotasks (like setTimeout) in the event loop.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-6',
          question_text: 'What is a generator function in JavaScript?',
          options: ['A function that generates random numbers', 'A function that can be paused and resumed', 'A function that creates other functions', 'A function that generates HTML'],
          correct_answer: 1,
          explanation: 'Generator functions can be paused and resumed, yielding multiple values over time using the yield keyword.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-7',
          question_text: 'What is the purpose of Symbol in JavaScript?',
          options: ['Mathematical symbols', 'Creating unique identifiers', 'String manipulation', 'Number formatting'],
          correct_answer: 1,
          explanation: 'Symbols are primitive data types that create unique identifiers, often used as object property keys.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-8',
          question_text: 'What is tail call optimization?',
          options: ['Optimizing the end of functions', 'Reusing stack frames for recursive calls', 'Optimizing function calls', 'Removing unused code'],
          correct_answer: 1,
          explanation: 'Tail call optimization reuses the current stack frame for recursive calls when the recursive call is the last operation.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-9',
          question_text: 'What is the difference between Object.freeze() and Object.seal()?',
          options: ['No difference', 'freeze() prevents all changes, seal() allows property value changes', 'seal() is stronger than freeze()', 'freeze() only works on arrays'],
          correct_answer: 1,
          explanation: 'Object.freeze() prevents all changes to an object, while Object.seal() prevents adding/removing properties but allows changing existing property values.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        },
        {
          id: 'js-adv-10',
          question_text: 'What is the Temporal Dead Zone?',
          options: ['A debugging zone', 'The time between let/const declaration and initialization', 'A memory management concept', 'A performance optimization'],
          correct_answer: 1,
          explanation: 'The Temporal Dead Zone is the time between when a let/const variable is hoisted and when it\'s initialized, during which accessing it throws an error.',
          difficulty: 'advanced' as const,
          topic: 'JavaScript',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getPythonQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'py-1',
          question_text: 'How do you print "Hello World" in Python?',
          options: ['echo "Hello World"', 'print("Hello World")', 'console.log("Hello World")', 'printf("Hello World")'],
          correct_answer: 1,
          explanation: 'In Python, the print() function is used to output text to the console.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-2',
          question_text: 'Which of the following is the correct way to create a list in Python?',
          options: ['list = {1, 2, 3}', 'list = [1, 2, 3]', 'list = (1, 2, 3)', 'list = <1, 2, 3>'],
          correct_answer: 1,
          explanation: 'Lists in Python are created using square brackets [].',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-3',
          question_text: 'What is the correct way to create a comment in Python?',
          options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
          correct_answer: 2,
          explanation: 'Comments in Python start with the # symbol.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-4',
          question_text: 'Which data type is used to store text in Python?',
          options: ['text', 'string', 'str', 'char'],
          correct_answer: 2,
          explanation: 'In Python, text is stored using the str (string) data type.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-5',
          question_text: 'How do you get user input in Python?',
          options: ['input()', 'get_input()', 'read()', 'scan()'],
          correct_answer: 0,
          explanation: 'The input() function is used to get user input in Python.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-6',
          question_text: 'What is the correct way to check if a condition is true in Python?',
          options: ['if condition then:', 'if (condition):', 'if condition:', 'if condition == true:'],
          correct_answer: 2,
          explanation: 'In Python, if statements use the syntax "if condition:" followed by an indented block.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-7',
          question_text: 'How do you define a function in Python?',
          options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
          correct_answer: 1,
          explanation: 'Functions in Python are defined using the def keyword.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-8',
          question_text: 'What does the len() function do?',
          options: ['Returns the length of an object', 'Creates a new list', 'Converts to lowercase', 'Removes spaces'],
          correct_answer: 0,
          explanation: 'The len() function returns the number of items in an object (string, list, tuple, etc.).',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-9',
          question_text: 'Which operator is used for exponentiation in Python?',
          options: ['^', '**', 'exp', 'pow'],
          correct_answer: 1,
          explanation: 'The ** operator is used for exponentiation in Python (e.g., 2**3 = 8).',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-10',
          question_text: 'What is the correct way to create a dictionary in Python?',
          options: ['dict = [key: value]', 'dict = {key: value}', 'dict = (key: value)', 'dict = <key: value>'],
          correct_answer: 1,
          explanation: 'Dictionaries in Python are created using curly braces {} with key-value pairs.',
          difficulty: 'beginner' as const,
          topic: 'Python',
          level
        }
      ],
      intermediate: [
        {
          id: 'py-int-1',
          question_text: 'What is a list comprehension in Python?',
          options: ['A way to understand lists', 'A concise way to create lists', 'A list documentation', 'A list method'],
          correct_answer: 1,
          explanation: 'List comprehensions provide a concise way to create lists based on existing lists or other iterables.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-2',
          question_text: 'What is the difference between a list and a tuple in Python?',
          options: ['No difference', 'Lists are mutable, tuples are immutable', 'Tuples are faster', 'Lists use more memory'],
          correct_answer: 1,
          explanation: 'Lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation).',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-3',
          question_text: 'What is the purpose of the __init__ method in Python classes?',
          options: ['To initialize objects', 'To delete objects', 'To copy objects', 'To compare objects'],
          correct_answer: 0,
          explanation: 'The __init__ method is the constructor that initializes new instances of a class.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-4',
          question_text: 'What does the *args parameter do in a function?',
          options: ['Creates arguments', 'Allows variable number of positional arguments', 'Multiplies arguments', 'Validates arguments'],
          correct_answer: 1,
          explanation: '*args allows a function to accept any number of positional arguments as a tuple.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-5',
          question_text: 'What is a decorator in Python?',
          options: ['A design pattern', 'A function that modifies another function', 'A class method', 'A variable type'],
          correct_answer: 1,
          explanation: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-6',
          question_text: 'What is the difference between == and is in Python?',
          options: ['No difference', '== compares values, is compares identity', 'is compares values, == compares identity', '== is faster'],
          correct_answer: 1,
          explanation: '== compares if two objects have the same value, while is compares if they are the same object in memory.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-7',
          question_text: 'What is a lambda function in Python?',
          options: ['A named function', 'An anonymous function', 'A class method', 'A built-in function'],
          correct_answer: 1,
          explanation: 'Lambda functions are anonymous functions that can have any number of arguments but can only have one expression.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-8',
          question_text: 'What does the map() function do?',
          options: ['Creates a map', 'Applies a function to all items in an iterable', 'Finds locations', 'Creates dictionaries'],
          correct_answer: 1,
          explanation: 'map() applies a given function to all items in an iterable and returns an iterator.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-9',
          question_text: 'What is the purpose of try/except blocks?',
          options: ['To try new code', 'To handle exceptions/errors', 'To test performance', 'To create loops'],
          correct_answer: 1,
          explanation: 'try/except blocks are used to handle exceptions and prevent the program from crashing when errors occur.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-int-10',
          question_text: 'What is the difference between append() and extend() for lists?',
          options: ['No difference', 'append() adds one element, extend() adds multiple elements', 'extend() is faster', 'append() creates a new list'],
          correct_answer: 1,
          explanation: 'append() adds a single element to the end of a list, while extend() adds all elements from an iterable.',
          difficulty: 'intermediate' as const,
          topic: 'Python',
          level
        }
      ],
      advanced: [
        {
          id: 'py-adv-1',
          question_text: 'What is the Global Interpreter Lock (GIL) in Python?',
          options: ['A security feature', 'A mutex that prevents multiple threads from executing Python code simultaneously', 'A performance optimizer', 'A debugging tool'],
          correct_answer: 1,
          explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-2',
          question_text: 'What is a metaclass in Python?',
          options: ['A class for metadata', 'A class whose instances are classes', 'A parent class', 'A class method'],
          correct_answer: 1,
          explanation: 'A metaclass is a class whose instances are classes. It defines how classes are constructed.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-3',
          question_text: 'What is the difference between __str__ and __repr__?',
          options: ['No difference', '__str__ is for end users, __repr__ is for developers', '__repr__ is faster', '__str__ is more detailed'],
          correct_answer: 1,
          explanation: '__str__ should return a readable string for end users, while __repr__ should return an unambiguous string for developers.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-4',
          question_text: 'What is a generator in Python?',
          options: ['A function that generates random numbers', 'A function that yields values one at a time', 'A class that creates objects', 'A module that generates code'],
          correct_answer: 1,
          explanation: 'A generator is a function that yields values one at a time, allowing for memory-efficient iteration over large datasets.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-5',
          question_text: 'What is the purpose of the @property decorator?',
          options: ['To create properties', 'To make methods accessible like attributes', 'To protect attributes', 'To create static methods'],
          correct_answer: 1,
          explanation: 'The @property decorator allows methods to be accessed like attributes, providing getter/setter functionality.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-6',
          question_text: 'What is monkey patching in Python?',
          options: ['Fixing bugs', 'Dynamically modifying classes or modules at runtime', 'Testing code', 'Optimizing performance'],
          correct_answer: 1,
          explanation: 'Monkey patching is the practice of dynamically modifying classes or modules at runtime.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-7',
          question_text: 'What is the difference between deepcopy and shallow copy?',
          options: ['No difference', 'deepcopy copies nested objects, shallow copy doesn\'t', 'shallow copy is faster', 'deepcopy uses more memory'],
          correct_answer: 1,
          explanation: 'Shallow copy creates a new object but references to nested objects are shared. Deep copy creates new objects for everything.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-8',
          question_text: 'What is the purpose of the __slots__ attribute?',
          options: ['To create slots', 'To restrict attribute creation and save memory', 'To create methods', 'To inherit from multiple classes'],
          correct_answer: 1,
          explanation: '__slots__ restricts the attributes that can be created on instances and can save memory by avoiding __dict__.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-9',
          question_text: 'What is a context manager in Python?',
          options: ['A memory manager', 'An object that defines runtime context for executing a block of code', 'A process manager', 'A file manager'],
          correct_answer: 1,
          explanation: 'A context manager defines the runtime context for executing a block of code, typically used with the "with" statement.',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        },
        {
          id: 'py-adv-10',
          question_text: 'What is the difference between staticmethod and classmethod?',
          options: ['No difference', 'staticmethod doesn\'t receive any automatic arguments, classmethod receives the class', 'classmethod is faster', 'staticmethod can access instance variables'],
          correct_answer: 1,
          explanation: 'staticmethod doesn\'t receive any automatic first argument, while classmethod receives the class as the first argument (cls).',
          difficulty: 'advanced' as const,
          topic: 'Python',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getReactQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'react-1',
          question_text: 'What is React?',
          options: ['A database', 'A JavaScript library for building user interfaces', 'A web server', 'A CSS framework'],
          correct_answer: 1,
          explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, especially web applications.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-2',
          question_text: 'What is JSX?',
          options: ['A new programming language', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A database query language'],
          correct_answer: 1,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-3',
          question_text: 'How do you create a React component?',
          options: ['function MyComponent() { return <div>Hello</div>; }', 'component MyComponent() { return <div>Hello</div>; }', 'create MyComponent() { return <div>Hello</div>; }', 'new MyComponent() { return <div>Hello</div>; }'],
          correct_answer: 0,
          explanation: 'React components can be created as functions that return JSX elements.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-4',
          question_text: 'What are props in React?',
          options: ['Properties passed to components', 'Component methods', 'CSS styles', 'Event handlers'],
          correct_answer: 0,
          explanation: 'Props (properties) are arguments passed into React components, similar to function arguments.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-5',
          question_text: 'What is state in React?',
          options: ['The current condition of the application', 'Data that can change over time in a component', 'CSS styling information', 'Component hierarchy'],
          correct_answer: 1,
          explanation: 'State is data that can change over time and affects what the component renders.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-6',
          question_text: 'How do you handle events in React?',
          options: ['addEventListener', 'onClick={handleClick}', 'onclick="handleClick()"', 'on-click={handleClick}'],
          correct_answer: 1,
          explanation: 'React uses camelCase event handlers like onClick, onSubmit, etc., passed as props.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-7',
          question_text: 'What is the useState hook used for?',
          options: ['To use external libraries', 'To manage state in functional components', 'To create user interfaces', 'To handle user input'],
          correct_answer: 1,
          explanation: 'useState is a React hook that allows you to add state to functional components.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-8',
          question_text: 'What is the key prop used for in React lists?',
          options: ['To unlock components', 'To help React identify which items have changed', 'To sort the list', 'To style list items'],
          correct_answer: 1,
          explanation: 'The key prop helps React identify which items have changed, are added, or are removed in lists.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-9',
          question_text: 'How do you conditionally render elements in React?',
          options: ['if/else statements', 'Ternary operators or logical AND', 'switch statements', 'for loops'],
          correct_answer: 1,
          explanation: 'Conditional rendering in React is commonly done using ternary operators (condition ? true : false) or logical AND (condition && element).',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-10',
          question_text: 'What is the virtual DOM?',
          options: ['A real DOM element', 'A JavaScript representation of the real DOM', 'A CSS framework', 'A database'],
          correct_answer: 1,
          explanation: 'The virtual DOM is a JavaScript representation of the real DOM that React uses to optimize updates.',
          difficulty: 'beginner' as const,
          topic: 'React',
          level
        }
      ],
      intermediate: [
        {
          id: 'react-int-1',
          question_text: 'What is the useEffect hook used for?',
          options: ['Creating effects', 'Performing side effects in functional components', 'Styling components', 'Managing state'],
          correct_answer: 1,
          explanation: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or DOM manipulation.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-2',
          question_text: 'What is prop drilling?',
          options: ['Creating holes in props', 'Passing props through multiple component layers', 'Validating props', 'Optimizing props'],
          correct_answer: 1,
          explanation: 'Prop drilling is the process of passing props through multiple component layers to reach a deeply nested component.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-3',
          question_text: 'What is the Context API used for?',
          options: ['Creating contexts', 'Sharing state across components without prop drilling', 'Managing component lifecycle', 'Handling events'],
          correct_answer: 1,
          explanation: 'The Context API allows you to share state across components without having to pass props down manually at every level.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-4',
          question_text: 'What is the difference between controlled and uncontrolled components?',
          options: ['No difference', 'Controlled components have their state managed by React, uncontrolled by DOM', 'Uncontrolled components are faster', 'Controlled components use more memory'],
          correct_answer: 1,
          explanation: 'Controlled components have their form data handled by React state, while uncontrolled components store their data in the DOM.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-5',
          question_text: 'What is React.memo() used for?',
          options: ['Memorizing components', 'Optimizing component re-renders', 'Creating memos', 'Storing data'],
          correct_answer: 1,
          explanation: 'React.memo() is a higher-order component that memoizes the result and skips re-rendering if props haven\'t changed.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-6',
          question_text: 'What is the useCallback hook used for?',
          options: ['Calling back functions', 'Memoizing callback functions', 'Creating callbacks', 'Handling user callbacks'],
          correct_answer: 1,
          explanation: 'useCallback returns a memoized version of the callback function that only changes if one of the dependencies has changed.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-7',
          question_text: 'What is the useMemo hook used for?',
          options: ['Creating memos', 'Memoizing expensive calculations', 'Managing memory', 'Storing user data'],
          correct_answer: 1,
          explanation: 'useMemo returns a memoized value and only recalculates when one of the dependencies has changed.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-8',
          question_text: 'What is a custom hook?',
          options: ['A hook provided by React', 'A JavaScript function that uses React hooks', 'A CSS styling technique', 'A component method'],
          correct_answer: 1,
          explanation: 'A custom hook is a JavaScript function whose name starts with "use" and that may call other hooks.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-9',
          question_text: 'What is the useReducer hook used for?',
          options: ['Reducing component size', 'Managing complex state logic', 'Reducing bundle size', 'Optimizing performance'],
          correct_answer: 1,
          explanation: 'useReducer is used for managing complex state logic and is an alternative to useState for more complex state updates.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-int-10',
          question_text: 'What is React Router used for?',
          options: ['Routing network requests', 'Handling client-side routing in React applications', 'Managing component routes', 'Optimizing routes'],
          correct_answer: 1,
          explanation: 'React Router is a library for handling client-side routing in React applications, allowing navigation between different views.',
          difficulty: 'intermediate' as const,
          topic: 'React',
          level
        }
      ],
      advanced: [
        {
          id: 'react-adv-1',
          question_text: 'What is React Fiber?',
          options: ['A new React component', 'React\'s reconciliation algorithm', 'A styling library', 'A state management tool'],
          correct_answer: 1,
          explanation: 'React Fiber is the new reconciliation algorithm in React 16+ that enables incremental rendering and better performance.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-2',
          question_text: 'What are React Portals?',
          options: ['Entry points to React', 'A way to render children into a DOM node outside the parent hierarchy', 'Navigation components', 'State containers'],
          correct_answer: 1,
          explanation: 'Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-3',
          question_text: 'What is the purpose of React.Suspense?',
          options: ['Creating suspenseful UIs', 'Handling loading states for lazy-loaded components', 'Suspending component updates', 'Managing async operations'],
          correct_answer: 1,
          explanation: 'React.Suspense lets you specify loading states for lazy-loaded components and handle async operations declaratively.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-4',
          question_text: 'What is the difference between useLayoutEffect and useEffect?',
          options: ['No difference', 'useLayoutEffect runs synchronously after DOM mutations, useEffect runs asynchronously', 'useEffect is faster', 'useLayoutEffect is deprecated'],
          correct_answer: 1,
          explanation: 'useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, while useEffect runs asynchronously.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-5',
          question_text: 'What is React Concurrent Mode?',
          options: ['Running multiple React apps', 'A set of features for better user experience with interruptible rendering', 'Concurrent programming', 'Multi-threading in React'],
          correct_answer: 1,
          explanation: 'Concurrent Mode is a set of features that help React apps stay responsive by making rendering interruptible.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-6',
          question_text: 'What is the useImperativeHandle hook used for?',
          options: ['Handling imperative code', 'Customizing the instance value exposed by ref', 'Managing component handles', 'Creating imperative APIs'],
          correct_answer: 1,
          explanation: 'useImperativeHandle customizes the instance value that is exposed to parent components when using ref.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-7',
          question_text: 'What is React Server Components?',
          options: ['Components that run on servers', 'Components that render on the server and send HTML to client', 'Server-side React', 'Backend React components'],
          correct_answer: 1,
          explanation: 'React Server Components allow components to render on the server and send the resulting HTML to the client.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-8',
          question_text: 'What is the purpose of React.StrictMode?',
          options: ['Enforcing strict coding rules', 'Highlighting potential problems in development', 'Improving performance', 'Adding type checking'],
          correct_answer: 1,
          explanation: 'React.StrictMode is a tool for highlighting potential problems in an application during development.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-9',
          question_text: 'What is the difference between React.createElement and JSX?',
          options: ['No difference', 'JSX is syntactic sugar for React.createElement', 'createElement is faster', 'JSX is a different library'],
          correct_answer: 1,
          explanation: 'JSX is syntactic sugar that gets compiled to React.createElement calls by tools like Babel.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        },
        {
          id: 'react-adv-10',
          question_text: 'What is React\'s reconciliation process?',
          options: ['Resolving conflicts', 'The algorithm React uses to diff and update the DOM', 'Merging components', 'Synchronizing state'],
          correct_answer: 1,
          explanation: 'Reconciliation is the algorithm React uses to diff one tree with another to determine which parts need to be changed.',
          difficulty: 'advanced' as const,
          topic: 'React',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getHTMLQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'html-1',
          question_text: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
          correct_answer: 0,
          explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-2',
          question_text: 'Which HTML tag is used for the largest heading?',
          options: ['<h6>', '<h1>', '<heading>', '<header>'],
          correct_answer: 1,
          explanation: '<h1> is used for the largest heading, with <h6> being the smallest.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-3',
          question_text: 'What is the correct HTML tag for inserting a line break?',
          options: ['<break>', '<br>', '<lb>', '<newline>'],
          correct_answer: 1,
          explanation: 'The <br> tag is used to insert a line break in HTML.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-4',
          question_text: 'Which HTML tag is used to create a hyperlink?',
          options: ['<link>', '<a>', '<href>', '<url>'],
          correct_answer: 1,
          explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-5',
          question_text: 'What is the correct HTML tag for inserting an image?',
          options: ['<image>', '<img>', '<picture>', '<photo>'],
          correct_answer: 1,
          explanation: 'The <img> tag is used to embed images in HTML documents.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-6',
          question_text: 'Which HTML tag is used to create an unordered list?',
          options: ['<ol>', '<ul>', '<list>', '<ulist>'],
          correct_answer: 1,
          explanation: 'The <ul> tag creates an unordered (bulleted) list, while <ol> creates an ordered (numbered) list.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-7',
          question_text: 'What is the correct HTML tag for the largest heading?',
          options: ['<head>', '<h6>', '<heading>', '<h1>'],
          correct_answer: 3,
          explanation: '<h1> represents the largest heading, with headings going from <h1> to <h6>.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-8',
          question_text: 'Which HTML attribute specifies an alternate text for an image?',
          options: ['title', 'alt', 'src', 'longdesc'],
          correct_answer: 1,
          explanation: 'The alt attribute provides alternative text for an image if it cannot be displayed.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-9',
          question_text: 'What is the correct HTML tag for creating a table?',
          options: ['<table>', '<tab>', '<tbl>', '<grid>'],
          correct_answer: 0,
          explanation: 'The <table> tag is used to create tables in HTML.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-10',
          question_text: 'Which HTML tag is used to define the document type?',
          options: ['<doctype>', '<!DOCTYPE>', '<html>', '<document>'],
          correct_answer: 1,
          explanation: '<!DOCTYPE> declaration defines the document type and version of HTML.',
          difficulty: 'beginner' as const,
          topic: 'HTML',
          level
        }
      ],
      intermediate: [
        {
          id: 'html-int-1',
          question_text: 'What is the purpose of the <meta> tag?',
          options: ['To create metadata', 'To provide metadata about the HTML document', 'To create meta-content', 'To define meta-styles'],
          correct_answer: 1,
          explanation: 'The <meta> tag provides metadata about the HTML document, such as description, keywords, author, etc.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-2',
          question_text: 'What is the difference between <div> and <span>?',
          options: ['No difference', '<div> is block-level, <span> is inline', '<span> is block-level, <div> is inline', '<div> is for text, <span> is for images'],
          correct_answer: 1,
          explanation: '<div> is a block-level element that takes up the full width, while <span> is an inline element.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-3',
          question_text: 'What is the purpose of the <form> tag?',
          options: ['To format text', 'To create interactive forms for user input', 'To form layouts', 'To create formal documents'],
          correct_answer: 1,
          explanation: 'The <form> tag is used to create HTML forms for user input and data submission.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-4',
          question_text: 'What is the purpose of the <iframe> tag?',
          options: ['To create frames', 'To embed another HTML document within the current document', 'To create image frames', 'To define internal frames'],
          correct_answer: 1,
          explanation: 'The <iframe> tag is used to embed another HTML document within the current document.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-5',
          question_text: 'What is semantic HTML?',
          options: ['HTML with meaning', 'HTML that clearly describes its meaning to both browser and developer', 'HTML for search engines', 'HTML with semantics'],
          correct_answer: 1,
          explanation: 'Semantic HTML uses HTML tags that clearly describe their meaning to both the browser and the developer.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-6',
          question_text: 'Which HTML5 tag is used for navigation links?',
          options: ['<navigation>', '<nav>', '<menu>', '<links>'],
          correct_answer: 1,
          explanation: 'The <nav> tag is used to define a set of navigation links in HTML5.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-7',
          question_text: 'What is the purpose of the <article> tag?',
          options: ['To write articles', 'To define independent, self-contained content', 'To create article layouts', 'To format articles'],
          correct_answer: 1,
          explanation: 'The <article> tag specifies independent, self-contained content like blog posts or news articles.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-8',
          question_text: 'What is the difference between <section> and <div>?',
          options: ['No difference', '<section> has semantic meaning, <div> is generic', '<div> has semantic meaning, <section> is generic', '<section> is for styling, <div> is for content'],
          correct_answer: 1,
          explanation: '<section> represents a thematic grouping of content with semantic meaning, while <div> is a generic container.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-9',
          question_text: 'What is the purpose of the data-* attributes?',
          options: ['To store data', 'To store custom data private to the page or application', 'To create databases', 'To define data types'],
          correct_answer: 1,
          explanation: 'Data-* attributes allow you to store custom data private to the page or application.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-int-10',
          question_text: 'What is the purpose of the <canvas> tag?',
          options: ['To create canvases', 'To draw graphics via JavaScript', 'To create art', 'To define drawing areas'],
          correct_answer: 1,
          explanation: 'The <canvas> tag is used to draw graphics, on the fly, via JavaScript.',
          difficulty: 'intermediate' as const,
          topic: 'HTML',
          level
        }
      ],
      advanced: [
        {
          id: 'html-adv-1',
          question_text: 'What is the Shadow DOM?',
          options: ['A dark theme for DOM', 'A way to encapsulate DOM and CSS in web components', 'A hidden DOM structure', 'A DOM debugging tool'],
          correct_answer: 1,
          explanation: 'Shadow DOM provides encapsulation for DOM and CSS in web components, creating isolated DOM trees.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-2',
          question_text: 'What are Web Components?',
          options: ['Website building blocks', 'A set of web platform APIs for creating reusable custom elements', 'Component libraries', 'Web development tools'],
          correct_answer: 1,
          explanation: 'Web Components are a set of web platform APIs that allow you to create new custom, reusable, encapsulated HTML tags.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-3',
          question_text: 'What is the purpose of the <template> tag?',
          options: ['To create templates', 'To hold client-side content that is not rendered when page loads', 'To define page templates', 'To create template layouts'],
          correct_answer: 1,
          explanation: 'The <template> tag holds client-side content that is not rendered when the page loads but can be instantiated later using JavaScript.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-4',
          question_text: 'What is the Intersection Observer API?',
          options: ['An API for intersections', 'An API for observing changes in intersection of elements with viewport', 'An API for observing intersections', 'An API for geometric calculations'],
          correct_answer: 1,
          explanation: 'The Intersection Observer API provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or viewport.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-5',
          question_text: 'What is the purpose of the <slot> tag in Web Components?',
          options: ['To create slots', 'To define placeholders for content in web components', 'To create time slots', 'To define component slots'],
          correct_answer: 1,
          explanation: 'The <slot> tag defines placeholders inside web components that users can fill with their own markup.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-6',
          question_text: 'What is the purpose of the loading attribute on images?',
          options: ['To show loading state', 'To control when images are loaded (lazy loading)', 'To define loading animations', 'To set loading priority'],
          correct_answer: 1,
          explanation: 'The loading attribute controls when the browser should start loading the image, enabling lazy loading with loading="lazy".',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-7',
          question_text: 'What is the purpose of the <picture> tag?',
          options: ['To display pictures', 'To provide responsive images with multiple sources', 'To create picture galleries', 'To format pictures'],
          correct_answer: 1,
          explanation: 'The <picture> tag provides responsive images by allowing multiple image sources for different screen sizes and resolutions.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-8',
          question_text: 'What is the purpose of the srcset attribute?',
          options: ['To set source code', 'To provide multiple image sources for responsive images', 'To set source sets', 'To define source collections'],
          correct_answer: 1,
          explanation: 'The srcset attribute provides multiple image sources for different screen densities and sizes in responsive design.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-9',
          question_text: 'What is the purpose of the <details> and <summary> tags?',
          options: ['To show details', 'To create collapsible content sections', 'To provide summaries', 'To create detailed layouts'],
          correct_answer: 1,
          explanation: 'The <details> and <summary> tags create collapsible content sections where <summary> is the visible heading.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        },
        {
          id: 'html-adv-10',
          question_text: 'What is the purpose of the <dialog> tag?',
          options: ['To create dialogs', 'To define modal dialog boxes or subwindows', 'To create conversations', 'To define dialog layouts'],
          correct_answer: 1,
          explanation: 'The <dialog> tag defines a dialog box or subwindow that can be used for modal dialogs, confirmations, etc.',
          difficulty: 'advanced' as const,
          topic: 'HTML',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getCSSQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'css-1',
          question_text: 'What does CSS stand for?',
          options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
          correct_answer: 1,
          explanation: 'CSS stands for Cascading Style Sheets, used to style HTML documents.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-2',
          question_text: 'How do you select an element with id "header" in CSS?',
          options: ['.header', '#header', 'header', '*header'],
          correct_answer: 1,
          explanation: 'The # symbol is used to select elements by their ID in CSS.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-3',
          question_text: 'How do you select elements with class "container" in CSS?',
          options: ['#container', '.container', 'container', '*container'],
          correct_answer: 1,
          explanation: 'The . (dot) symbol is used to select elements by their class in CSS.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-4',
          question_text: 'Which CSS property is used to change the text color?',
          options: ['text-color', 'font-color', 'color', 'text-style'],
          correct_answer: 2,
          explanation: 'The color property is used to set the color of text in CSS.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-5',
          question_text: 'Which CSS property is used to change the background color?',
          options: ['bg-color', 'background-color', 'bgcolor', 'background'],
          correct_answer: 1,
          explanation: 'The background-color property sets the background color of an element.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-6',
          question_text: 'How do you make text bold in CSS?',
          options: ['font-weight: bold;', 'text-style: bold;', 'font-style: bold;', 'text-weight: bold;'],
          correct_answer: 0,
          explanation: 'The font-weight property with value "bold" makes text bold in CSS.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-7',
          question_text: 'Which CSS property controls the text size?',
          options: ['text-size', 'font-size', 'text-style', 'font-style'],
          correct_answer: 1,
          explanation: 'The font-size property controls the size of text in CSS.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-8',
          question_text: 'How do you center text horizontally in CSS?',
          options: ['text-align: center;', 'align: center;', 'text-center: true;', 'horizontal-align: center;'],
          correct_answer: 0,
          explanation: 'The text-align: center property centers text horizontally within its container.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-9',
          question_text: 'Which CSS property is used to add space inside an element?',
          options: ['margin', 'padding', 'spacing', 'border'],
          correct_answer: 1,
          explanation: 'Padding adds space inside an element, between the content and the border.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-10',
          question_text: 'Which CSS property is used to add space outside an element?',
          options: ['padding', 'margin', 'spacing', 'border'],
          correct_answer: 1,
          explanation: 'Margin adds space outside an element, between the element and other elements.',
          difficulty: 'beginner' as const,
          topic: 'CSS',
          level
        }
      ],
      intermediate: [
        {
          id: 'css-int-1',
          question_text: 'What is the CSS Box Model?',
          options: ['A model for boxes', 'The rectangular boxes generated for elements, including content, padding, border, and margin', 'A CSS framework', 'A layout technique'],
          correct_answer: 1,
          explanation: 'The CSS Box Model describes the rectangular boxes generated for elements, consisting of content, padding, border, and margin.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-2',
          question_text: 'What is the difference between display: block and display: inline?',
          options: ['No difference', 'Block elements take full width, inline elements only take necessary width', 'Inline elements take full width, block elements only take necessary width', 'Block elements are faster'],
          correct_answer: 1,
          explanation: 'Block elements take up the full width available and start on a new line, while inline elements only take up necessary width and don\'t start on a new line.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-3',
          question_text: 'What is CSS Flexbox?',
          options: ['Flexible boxes', 'A layout method for arranging items in rows or columns', 'A CSS framework', 'A responsive design technique'],
          correct_answer: 1,
          explanation: 'Flexbox is a layout method that allows you to arrange items in rows or columns with flexible sizing and alignment.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-4',
          question_text: 'What does the z-index property control?',
          options: ['Element size', 'Element stacking order', 'Element position', 'Element visibility'],
          correct_answer: 1,
          explanation: 'The z-index property controls the stacking order of positioned elements (which element appears in front).',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-5',
          question_text: 'What is the difference between relative and absolute positioning?',
          options: ['No difference', 'Relative is positioned relative to its normal position, absolute is positioned relative to its nearest positioned ancestor', 'Absolute is faster', 'Relative is more flexible'],
          correct_answer: 1,
          explanation: 'Relative positioning moves an element relative to its normal position, while absolute positioning positions it relative to its nearest positioned ancestor.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-6',
          question_text: 'What is a CSS pseudo-class?',
          options: ['A fake class', 'A keyword that specifies a special state of an element', 'A class that doesn\'t exist', 'A temporary class'],
          correct_answer: 1,
          explanation: 'A pseudo-class is a keyword added to a selector that specifies a special state of the selected element (like :hover, :focus).',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-7',
          question_text: 'What is the purpose of CSS media queries?',
          options: ['To query media files', 'To apply styles based on device characteristics like screen size', 'To load media content', 'To optimize media'],
          correct_answer: 1,
          explanation: 'Media queries allow you to apply CSS styles based on device characteristics like screen size, making responsive design possible.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-8',
          question_text: 'What is the difference between em and rem units?',
          options: ['No difference', 'em is relative to parent element font size, rem is relative to root element font size', 'rem is relative to parent, em is relative to root', 'em is faster'],
          correct_answer: 1,
          explanation: 'em units are relative to the font size of the parent element, while rem units are relative to the font size of the root element.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-9',
          question_text: 'What is CSS Grid?',
          options: ['A grid system', 'A two-dimensional layout system for CSS', 'A CSS framework', 'A responsive design tool'],
          correct_answer: 1,
          explanation: 'CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-int-10',
          question_text: 'What is the purpose of the CSS transform property?',
          options: ['To transform code', 'To apply 2D or 3D transformations to elements', 'To change element types', 'To transform colors'],
          correct_answer: 1,
          explanation: 'The transform property allows you to apply 2D or 3D transformations to elements like rotate, scale, translate, and skew.',
          difficulty: 'intermediate' as const,
          topic: 'CSS',
          level
        }
      ],
      advanced: [
        {
          id: 'css-adv-1',
          question_text: 'What is CSS-in-JS?',
          options: ['CSS written in JavaScript', 'A technique for styling components using JavaScript', 'JavaScript for CSS', 'CSS compiled to JavaScript'],
          correct_answer: 1,
          explanation: 'CSS-in-JS is a technique where CSS is composed using JavaScript instead of defined in external files.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-2',
          question_text: 'What is the CSS containment property used for?',
          options: ['To contain elements', 'To optimize rendering by isolating subtrees', 'To create containers', 'To contain styles'],
          correct_answer: 1,
          explanation: 'The contain property allows you to indicate that an element\'s subtree is independent of the rest of the page for optimization.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-3',
          question_text: 'What are CSS custom properties (CSS variables)?',
          options: ['Custom CSS rules', 'Entities defined by CSS authors that contain specific values to be reused', 'Variable CSS files', 'Dynamic CSS properties'],
          correct_answer: 1,
          explanation: 'CSS custom properties (variables) are entities defined by CSS authors that contain specific values to be reused throughout a document.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-4',
          question_text: 'What is the CSS will-change property used for?',
          options: ['To change CSS', 'To hint to browsers about what properties will change for optimization', 'To predict changes', 'To force changes'],
          correct_answer: 1,
          explanation: 'The will-change property hints to browsers about what properties of an element are expected to change, allowing for optimization.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-5',
          question_text: 'What is the CSS clip-path property used for?',
          options: ['To clip paths', 'To create clipping regions that define what part of an element should be shown', 'To create paths', 'To clip images'],
          correct_answer: 1,
          explanation: 'The clip-path property creates a clipping region that sets what part of an element should be shown.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-6',
          question_text: 'What is the CSS scroll-behavior property?',
          options: ['To control scroll bars', 'To set the behavior for a scrolling box when scrolling is triggered', 'To create scroll effects', 'To optimize scrolling'],
          correct_answer: 1,
          explanation: 'The scroll-behavior property sets the behavior for a scrolling box when scrolling is triggered by navigation or CSSOM scrolling APIs.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-7',
          question_text: 'What is the CSS aspect-ratio property?',
          options: ['To set ratios', 'To set a preferred aspect ratio for the box', 'To calculate ratios', 'To maintain proportions'],
          correct_answer: 1,
          explanation: 'The aspect-ratio property sets a preferred aspect ratio for the box, which will be used in the calculation of auto sizes.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-8',
          question_text: 'What is the CSS gap property in Grid and Flexbox?',
          options: ['To create gaps', 'To set the gaps between rows and columns', 'To find gaps', 'To fill gaps'],
          correct_answer: 1,
          explanation: 'The gap property sets the gaps (gutters) between rows and columns in CSS Grid and Flexbox layouts.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-9',
          question_text: 'What is the CSS logical properties concept?',
          options: ['Logical CSS rules', 'Properties that are relative to writing mode and direction', 'CSS logic', 'Logical layouts'],
          correct_answer: 1,
          explanation: 'CSS logical properties provide the ability to control layout through logical, rather than physical, direction and dimension mappings.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        },
        {
          id: 'css-adv-10',
          question_text: 'What is the CSS subgrid value?',
          options: ['A smaller grid', 'A way for grid items to participate in the sizing of their parent grid', 'A sub-layout', 'A nested grid'],
          correct_answer: 1,
          explanation: 'Subgrid allows grid items to participate in the sizing of their parent grid, creating more flexible layouts.',
          difficulty: 'advanced' as const,
          topic: 'CSS',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getSQLQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'sql-1',
          question_text: 'What does SQL stand for?',
          options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
          correct_answer: 0,
          explanation: 'SQL stands for Structured Query Language, used for managing and querying relational databases.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-2',
          question_text: 'Which SQL statement is used to retrieve data from a database?',
          options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
          correct_answer: 1,
          explanation: 'The SELECT statement is used to query and retrieve data from database tables.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-3',
          question_text: 'Which SQL statement is used to add new data to a database?',
          options: ['ADD', 'INSERT', 'CREATE', 'PUT'],
          correct_answer: 1,
          explanation: 'The INSERT statement is used to add new rows of data to database tables.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-4',
          question_text: 'Which SQL statement is used to modify existing data?',
          options: ['MODIFY', 'CHANGE', 'UPDATE', 'ALTER'],
          correct_answer: 2,
          explanation: 'The UPDATE statement is used to modify existing data in database tables.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-5',
          question_text: 'Which SQL statement is used to remove data from a database?',
          options: ['REMOVE', 'DELETE', 'DROP', 'CLEAR'],
          correct_answer: 1,
          explanation: 'The DELETE statement is used to remove rows from database tables.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-6',
          question_text: 'Which SQL clause is used to filter results?',
          options: ['FILTER', 'WHERE', 'HAVING', 'IF'],
          correct_answer: 1,
          explanation: 'The WHERE clause is used to filter records based on specified conditions.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-7',
          question_text: 'Which SQL clause is used to sort results?',
          options: ['SORT', 'ORDER BY', 'ARRANGE', 'ORGANIZE'],
          correct_answer: 1,
          explanation: 'The ORDER BY clause is used to sort the result set in ascending or descending order.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-8',
          question_text: 'What does the COUNT() function do?',
          options: ['Counts characters', 'Counts the number of rows', 'Counts tables', 'Counts columns'],
          correct_answer: 1,
          explanation: 'The COUNT() function returns the number of rows that match a specified condition.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-9',
          question_text: 'Which SQL operator is used to search for a pattern?',
          options: ['SEARCH', 'LIKE', 'MATCH', 'FIND'],
          correct_answer: 1,
          explanation: 'The LIKE operator is used to search for a specified pattern in a column.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-10',
          question_text: 'What does the DISTINCT keyword do?',
          options: ['Makes data distinct', 'Returns only unique values', 'Distinguishes data types', 'Creates distinctions'],
          correct_answer: 1,
          explanation: 'The DISTINCT keyword returns only unique (different) values, removing duplicates.',
          difficulty: 'beginner' as const,
          topic: 'SQL',
          level
        }
      ],
      intermediate: [
        {
          id: 'sql-int-1',
          question_text: 'What is a JOIN in SQL?',
          options: ['Joining tables', 'A clause used to combine rows from two or more tables', 'Connecting databases', 'Merging data'],
          correct_answer: 1,
          explanation: 'A JOIN clause is used to combine rows from two or more tables based on a related column between them.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-2',
          question_text: 'What is the difference between INNER JOIN and LEFT JOIN?',
          options: ['No difference', 'INNER JOIN returns only matching rows, LEFT JOIN returns all rows from left table', 'LEFT JOIN is faster', 'INNER JOIN returns more data'],
          correct_answer: 1,
          explanation: 'INNER JOIN returns only rows that have matching values in both tables, while LEFT JOIN returns all rows from the left table.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-3',
          question_text: 'What is a primary key?',
          options: ['The main key', 'A unique identifier for each row in a table', 'The first key', 'A password'],
          correct_answer: 1,
          explanation: 'A primary key is a unique identifier for each row in a table, ensuring no duplicate values.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-4',
          question_text: 'What is a foreign key?',
          options: ['A key from another country', 'A field that links to the primary key of another table', 'An external key', 'A backup key'],
          correct_answer: 1,
          explanation: 'A foreign key is a field in one table that refers to the primary key in another table, creating a link between tables.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-5',
          question_text: 'What is the GROUP BY clause used for?',
          options: ['Grouping people', 'Grouping rows that have the same values into summary rows', 'Creating groups', 'Organizing data'],
          correct_answer: 1,
          explanation: 'GROUP BY groups rows that have the same values into summary rows, often used with aggregate functions.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-6',
          question_text: 'What is the HAVING clause used for?',
          options: ['Having data', 'Filtering groups created by GROUP BY', 'Possessing records', 'Containing information'],
          correct_answer: 1,
          explanation: 'HAVING is used to filter groups created by GROUP BY, similar to WHERE but for grouped data.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-7',
          question_text: 'What is a subquery?',
          options: ['A small query', 'A query nested inside another query', 'A secondary query', 'A subset query'],
          correct_answer: 1,
          explanation: 'A subquery is a query nested inside another SQL query, used to provide data for the main query.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-8',
          question_text: 'What is an index in SQL?',
          options: ['A table index', 'A database object that improves query performance', 'A list of contents', 'A reference guide'],
          correct_answer: 1,
          explanation: 'An index is a database object that improves the speed of data retrieval operations on a table.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-9',
          question_text: 'What is normalization in databases?',
          options: ['Making data normal', 'Organizing data to reduce redundancy and improve integrity', 'Standardizing data', 'Normalizing values'],
          correct_answer: 1,
          explanation: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-int-10',
          question_text: 'What is a view in SQL?',
          options: ['A way to view data', 'A virtual table based on the result of an SQL statement', 'A database perspective', 'A data visualization'],
          correct_answer: 1,
          explanation: 'A view is a virtual table based on the result of an SQL statement, containing rows and columns just like a real table.',
          difficulty: 'intermediate' as const,
          topic: 'SQL',
          level
        }
      ],
      advanced: [
        {
          id: 'sql-adv-1',
          question_text: 'What is a stored procedure?',
          options: ['A stored process', 'A prepared SQL code that can be saved and reused', 'A procedure for storing data', 'A storage method'],
          correct_answer: 1,
          explanation: 'A stored procedure is a prepared SQL code that you can save and reuse, improving performance and security.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-2',
          question_text: 'What is a trigger in SQL?',
          options: ['A database trigger', 'A special stored procedure that automatically executes in response to events', 'A firing mechanism', 'A database event'],
          correct_answer: 1,
          explanation: 'A trigger is a special stored procedure that automatically executes (fires) in response to specific events in a database.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-3',
          question_text: 'What is a Common Table Expression (CTE)?',
          options: ['A common table', 'A temporary result set that exists within the scope of a single statement', 'A table expression', 'A shared table'],
          correct_answer: 1,
          explanation: 'A CTE is a temporary result set that you can reference within a SELECT, INSERT, UPDATE, or DELETE statement.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-4',
          question_text: 'What is a window function in SQL?',
          options: ['A function for windows', 'A function that performs calculations across a set of rows related to the current row', 'A windowing mechanism', 'A display function'],
          correct_answer: 1,
          explanation: 'Window functions perform calculations across a set of table rows that are somehow related to the current row.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-5',
          question_text: 'What is the ACID principle in databases?',
          options: ['A chemical principle', 'Atomicity, Consistency, Isolation, Durability', 'An acidic database', 'A data principle'],
          correct_answer: 1,
          explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability - properties that guarantee database transactions are processed reliably.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-6',
          question_text: 'What is database partitioning?',
          options: ['Dividing databases', 'Dividing a large table into smaller, more manageable pieces', 'Creating partitions', 'Separating data'],
          correct_answer: 1,
          explanation: 'Database partitioning divides a large table into smaller, more manageable pieces while maintaining logical unity.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-7',
          question_text: 'What is a deadlock in databases?',
          options: ['A locked database', 'A situation where two or more transactions wait for each other indefinitely', 'A security lock', 'A permanent lock'],
          correct_answer: 1,
          explanation: 'A deadlock occurs when two or more transactions wait for each other to release locks, creating a circular dependency.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-8',
          question_text: 'What is database replication?',
          options: ['Copying databases', 'The process of copying and maintaining database objects in multiple databases', 'Replicating data', 'Database duplication'],
          correct_answer: 1,
          explanation: 'Database replication is the process of copying and maintaining database objects in multiple databases that make up a distributed database system.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-9',
          question_text: 'What is query optimization?',
          options: ['Optimizing queries', 'The process of improving query performance by choosing the most efficient execution plan', 'Making queries better', 'Query enhancement'],
          correct_answer: 1,
          explanation: 'Query optimization is the process of improving query performance by choosing the most efficient execution plan.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        },
        {
          id: 'sql-adv-10',
          question_text: 'What is a materialized view?',
          options: ['A physical view', 'A database object that contains the results of a query and is physically stored', 'A solid view', 'A concrete view'],
          correct_answer: 1,
          explanation: 'A materialized view is a database object that contains the results of a query and is physically stored, unlike regular views.',
          difficulty: 'advanced' as const,
          topic: 'SQL',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getGitQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'git-1',
          question_text: 'What is Git?',
          options: ['A programming language', 'A distributed version control system', 'A web framework', 'A database'],
          correct_answer: 1,
          explanation: 'Git is a distributed version control system used to track changes in source code during software development.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-2',
          question_text: 'Which command is used to initialize a new Git repository?',
          options: ['git start', 'git init', 'git create', 'git new'],
          correct_answer: 1,
          explanation: 'The git init command initializes a new Git repository in the current directory.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-3',
          question_text: 'Which command is used to add files to the staging area?',
          options: ['git add', 'git stage', 'git include', 'git prepare'],
          correct_answer: 0,
          explanation: 'The git add command adds files to the staging area, preparing them for commit.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-4',
          question_text: 'Which command is used to commit changes?',
          options: ['git save', 'git commit', 'git record', 'git store'],
          correct_answer: 1,
          explanation: 'The git commit command records changes to the repository with a descriptive message.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-5',
          question_text: 'Which command shows the current status of the repository?',
          options: ['git info', 'git status', 'git state', 'git check'],
          correct_answer: 1,
          explanation: 'The git status command shows the current state of the working directory and staging area.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-6',
          question_text: 'Which command is used to view commit history?',
          options: ['git history', 'git log', 'git commits', 'git past'],
          correct_answer: 1,
          explanation: 'The git log command displays the commit history of the repository.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-7',
          question_text: 'Which command is used to clone a repository?',
          options: ['git copy', 'git clone', 'git download', 'git get'],
          correct_answer: 1,
          explanation: 'The git clone command creates a local copy of a remote repository.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-8',
          question_text: 'Which command is used to push changes to a remote repository?',
          options: ['git upload', 'git push', 'git send', 'git sync'],
          correct_answer: 1,
          explanation: 'The git push command uploads local repository changes to a remote repository.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-9',
          question_text: 'Which command is used to pull changes from a remote repository?',
          options: ['git download', 'git pull', 'git fetch', 'git get'],
          correct_answer: 1,
          explanation: 'The git pull command downloads and merges changes from a remote repository to the local repository.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-10',
          question_text: 'What is a branch in Git?',
          options: ['A tree branch', 'A parallel version of the repository', 'A folder', 'A file type'],
          correct_answer: 1,
          explanation: 'A branch in Git is a parallel version of the repository that allows you to work on different features independently.',
          difficulty: 'beginner' as const,
          topic: 'Git',
          level
        }
      ],
      intermediate: [
        {
          id: 'git-int-1',
          question_text: 'What is the difference between git pull and git fetch?',
          options: ['No difference', 'git pull downloads and merges, git fetch only downloads', 'git fetch is faster', 'git pull is safer'],
          correct_answer: 1,
          explanation: 'git fetch downloads changes from remote but doesn\'t merge them, while git pull downloads and automatically merges.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-2',
          question_text: 'What is a merge conflict?',
          options: ['A conflict between merges', 'When Git cannot automatically merge changes from different branches', 'A merging error', 'A conflict resolution'],
          correct_answer: 1,
          explanation: 'A merge conflict occurs when Git cannot automatically merge changes from different branches due to conflicting modifications.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-3',
          question_text: 'What is git rebase?',
          options: ['Rebasing code', 'Moving or combining commits to a new base commit', 'Creating a new base', 'Resetting the base'],
          correct_answer: 1,
          explanation: 'Git rebase moves or combines a sequence of commits to a new base commit, creating a linear history.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-4',
          question_text: 'What is the staging area in Git?',
          options: ['A performance stage', 'An intermediate area where commits are prepared', 'A staging environment', 'A temporary storage'],
          correct_answer: 1,
          explanation: 'The staging area (index) is an intermediate area where commits are prepared before being committed to the repository.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-5',
          question_text: 'What does git stash do?',
          options: ['Stashes files', 'Temporarily saves changes without committing', 'Hides changes', 'Stores changes permanently'],
          correct_answer: 1,
          explanation: 'Git stash temporarily saves your changes without committing them, allowing you to work on something else.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-6',
          question_text: 'What is a remote in Git?',
          options: ['A remote control', 'A version of the repository hosted elsewhere', 'A distant repository', 'A backup repository'],
          correct_answer: 1,
          explanation: 'A remote is a version of your repository that is hosted elsewhere, like on GitHub or GitLab.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-7',
          question_text: 'What is the difference between git reset and git revert?',
          options: ['No difference', 'git reset changes history, git revert creates new commits to undo changes', 'git revert is faster', 'git reset is safer'],
          correct_answer: 1,
          explanation: 'git reset changes commit history, while git revert creates new commits that undo previous changes without changing history.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-8',
          question_text: 'What is a Git tag?',
          options: ['A label tag', 'A reference to a specific commit, often used for releases', 'A tag for organizing', 'A metadata tag'],
          correct_answer: 1,
          explanation: 'A Git tag is a reference to a specific commit, commonly used to mark release points or important milestones.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-9',
          question_text: 'What is the .gitignore file used for?',
          options: ['To ignore Git', 'To specify files that Git should ignore', 'To ignore errors', 'To ignore users'],
          correct_answer: 1,
          explanation: 'The .gitignore file specifies intentionally untracked files that Git should ignore.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-int-10',
          question_text: 'What is a fork in Git?',
          options: ['A eating utensil', 'A copy of a repository under your account', 'A branch split', 'A repository division'],
          correct_answer: 1,
          explanation: 'A fork is a copy of a repository that allows you to freely experiment with changes without affecting the original project.',
          difficulty: 'intermediate' as const,
          topic: 'Git',
          level
        }
      ],
      advanced: [
        {
          id: 'git-adv-1',
          question_text: 'What is git bisect used for?',
          options: ['Bisecting code', 'Finding the commit that introduced a bug using binary search', 'Splitting commits', 'Dividing repositories'],
          correct_answer: 1,
          explanation: 'git bisect uses binary search to find the commit that introduced a bug by testing commits between known good and bad states.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-2',
          question_text: 'What is git cherry-pick?',
          options: ['Picking cherries', 'Applying specific commits from one branch to another', 'Selecting commits', 'Choosing changes'],
          correct_answer: 1,
          explanation: 'git cherry-pick applies the changes from specific commits from one branch to another branch.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-3',
          question_text: 'What is git reflog?',
          options: ['A reference log', 'A log of all ref updates in the local repository', 'A reflection log', 'A reference guide'],
          correct_answer: 1,
          explanation: 'git reflog shows a log of all ref updates (branch checkouts, commits, etc.) in the local repository.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-4',
          question_text: 'What is git worktree?',
          options: ['A work tree', 'A feature that allows multiple working directories for a single repository', 'A tree structure', 'A working environment'],
          correct_answer: 1,
          explanation: 'git worktree allows you to have multiple working directories attached to the same repository.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-5',
          question_text: 'What is git submodule?',
          options: ['A sub-module', 'A way to include one Git repository as a subdirectory of another', 'A module subset', 'A secondary module'],
          correct_answer: 1,
          explanation: 'git submodule allows you to include one Git repository as a subdirectory of another Git repository.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-6',
          question_text: 'What is git hooks?',
          options: ['Git fishing hooks', 'Scripts that run automatically at certain points in the Git workflow', 'Code hooks', 'Git attachments'],
          correct_answer: 1,
          explanation: 'Git hooks are scripts that run automatically at certain points in the Git workflow, like before commits or after pushes.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-7',
          question_text: 'What is the difference between git merge --squash and regular merge?',
          options: ['No difference', '--squash combines all commits into one commit, regular merge preserves commit history', '--squash is faster', 'Regular merge is better'],
          correct_answer: 1,
          explanation: 'git merge --squash combines all commits from the feature branch into a single commit, while regular merge preserves the commit history.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-8',
          question_text: 'What is git filter-branch used for?',
          options: ['Filtering branches', 'Rewriting Git history by applying filters to commits', 'Branch filtering', 'Cleaning branches'],
          correct_answer: 1,
          explanation: 'git filter-branch is used to rewrite Git history by applying filters to commits, useful for removing sensitive data.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-9',
          question_text: 'What is git blame used for?',
          options: ['Blaming developers', 'Showing who last modified each line of a file', 'Finding faults', 'Assigning responsibility'],
          correct_answer: 1,
          explanation: 'git blame shows who last modified each line of a file and when, useful for tracking down when changes were made.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        },
        {
          id: 'git-adv-10',
          question_text: 'What is the difference between git rebase -i and regular rebase?',
          options: ['No difference', 'Interactive rebase allows you to edit, reorder, or squash commits', 'Interactive is faster', 'Regular rebase is safer'],
          correct_answer: 1,
          explanation: 'Interactive rebase (git rebase -i) allows you to edit, reorder, squash, or drop commits during the rebase process.',
          difficulty: 'advanced' as const,
          topic: 'Git',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getMachineLearningQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'ml-1',
          question_text: 'What is Machine Learning?',
          options: ['A type of computer', 'A method of data analysis that automates analytical model building', 'A programming language', 'A database system'],
          correct_answer: 1,
          explanation: 'Machine Learning is a method of data analysis that automates analytical model building, allowing computers to learn without being explicitly programmed.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-2',
          question_text: 'What are the three main types of machine learning?',
          options: ['Fast, Medium, Slow', 'Supervised, Unsupervised, Reinforcement', 'Easy, Medium, Hard', 'Linear, Non-linear, Complex'],
          correct_answer: 1,
          explanation: 'The three main types of machine learning are Supervised Learning, Unsupervised Learning, and Reinforcement Learning.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-3',
          question_text: 'What is supervised learning?',
          options: ['Learning with a supervisor', 'Learning from labeled training data', 'Learning under supervision', 'Guided learning'],
          correct_answer: 1,
          explanation: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-4',
          question_text: 'What is unsupervised learning?',
          options: ['Learning without supervision', 'Finding patterns in data without labeled examples', 'Independent learning', 'Self-directed learning'],
          correct_answer: 1,
          explanation: 'Unsupervised learning finds patterns in data without labeled examples or target outputs.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-5',
          question_text: 'What is a feature in machine learning?',
          options: ['A special characteristic', 'An individual measurable property of an object being observed', 'A software feature', 'A data point'],
          correct_answer: 1,
          explanation: 'A feature is an individual measurable property or characteristic of an object being observed.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-6',
          question_text: 'What is training data?',
          options: ['Data for training', 'The dataset used to teach a machine learning algorithm', 'Exercise data', 'Practice data'],
          correct_answer: 1,
          explanation: 'Training data is the dataset used to teach a machine learning algorithm to make predictions or decisions.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-7',
          question_text: 'What is overfitting?',
          options: ['Fitting too much', 'When a model learns the training data too well and performs poorly on new data', 'Over-exercising', 'Excessive fitting'],
          correct_answer: 1,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new, unseen data.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-8',
          question_text: 'What is a neural network?',
          options: ['A network of neurons', 'A computing system inspired by biological neural networks', 'A brain network', 'A nerve system'],
          correct_answer: 1,
          explanation: 'A neural network is a computing system inspired by biological neural networks, consisting of interconnected nodes (neurons).',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-9',
          question_text: 'What is the purpose of a test set?',
          options: ['To test the system', 'To evaluate the final performance of a trained model', 'To test features', 'To run tests'],
          correct_answer: 1,
          explanation: 'A test set is used to evaluate the final performance of a trained model on unseen data.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-10',
          question_text: 'What is classification in machine learning?',
          options: ['Organizing data', 'Predicting discrete categories or classes', 'Classifying algorithms', 'Data classification'],
          correct_answer: 1,
          explanation: 'Classification is a type of supervised learning that predicts discrete categories or classes for input data.',
          difficulty: 'beginner' as const,
          topic: 'Machine Learning',
          level
        }
      ],
      intermediate: [
        {
          id: 'ml-int-1',
          question_text: 'What is cross-validation?',
          options: ['Validating crosses', 'A technique to assess model performance by splitting data into multiple folds', 'Cross-checking validation', 'Validation across datasets'],
          correct_answer: 1,
          explanation: 'Cross-validation is a technique to assess how well a model will generalize by splitting data into multiple folds for training and testing.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-2',
          question_text: 'What is the bias-variance tradeoff?',
          options: ['A trading concept', 'The balance between model simplicity and complexity', 'A statistical bias', 'A variance calculation'],
          correct_answer: 1,
          explanation: 'The bias-variance tradeoff is the balance between a model\'s ability to minimize bias (underfitting) and variance (overfitting).',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-3',
          question_text: 'What is regularization?',
          options: ['Making things regular', 'Techniques to prevent overfitting by adding penalty terms', 'Regulation of models', 'Standardizing data'],
          correct_answer: 1,
          explanation: 'Regularization techniques prevent overfitting by adding penalty terms to the loss function, encouraging simpler models.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-4',
          question_text: 'What is gradient descent?',
          options: ['Descending gradients', 'An optimization algorithm to minimize the cost function', 'A descent method', 'Gradient calculation'],
          correct_answer: 1,
          explanation: 'Gradient descent is an optimization algorithm used to minimize the cost function by iteratively moving toward the steepest descent.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-5',
          question_text: 'What is feature engineering?',
          options: ['Engineering features', 'The process of selecting and transforming variables for machine learning models', 'Building features', 'Feature construction'],
          correct_answer: 1,
          explanation: 'Feature engineering is the process of selecting, modifying, or creating features from raw data to improve model performance.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-6',
          question_text: 'What is ensemble learning?',
          options: ['Learning in groups', 'Combining multiple models to improve performance', 'Ensemble music learning', 'Group learning'],
          correct_answer: 1,
          explanation: 'Ensemble learning combines multiple models to create a stronger predictor than any individual model alone.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-7',
          question_text: 'What is the difference between bagging and boosting?',
          options: ['No difference', 'Bagging trains models in parallel, boosting trains sequentially', 'Boosting is faster', 'Bagging is more accurate'],
          correct_answer: 1,
          explanation: 'Bagging trains multiple models in parallel on different subsets, while boosting trains models sequentially, each correcting previous errors.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-8',
          question_text: 'What is dimensionality reduction?',
          options: ['Reducing dimensions', 'Reducing the number of features while preserving important information', 'Making data smaller', 'Dimension cutting'],
          correct_answer: 1,
          explanation: 'Dimensionality reduction reduces the number of features in a dataset while preserving the most important information.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-9',
          question_text: 'What is clustering?',
          options: ['Grouping clusters', 'Grouping similar data points together', 'Creating clusters', 'Data grouping'],
          correct_answer: 1,
          explanation: 'Clustering is an unsupervised learning technique that groups similar data points together based on their characteristics.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-int-10',
          question_text: 'What is the purpose of activation functions in neural networks?',
          options: ['To activate networks', 'To introduce non-linearity and enable learning complex patterns', 'To activate neurons', 'To start functions'],
          correct_answer: 1,
          explanation: 'Activation functions introduce non-linearity into neural networks, enabling them to learn complex patterns and relationships.',
          difficulty: 'intermediate' as const,
          topic: 'Machine Learning',
          level
        }
      ],
      advanced: [
        {
          id: 'ml-adv-1',
          question_text: 'What is transfer learning?',
          options: ['Transferring learning', 'Using pre-trained models as starting points for new tasks', 'Learning transfers', 'Knowledge transfer'],
          correct_answer: 1,
          explanation: 'Transfer learning uses pre-trained models as starting points for new, related tasks, leveraging previously learned features.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-2',
          question_text: 'What is a Generative Adversarial Network (GAN)?',
          options: ['A generative network', 'Two neural networks competing against each other', 'An adversarial system', 'A generation method'],
          correct_answer: 1,
          explanation: 'A GAN consists of two neural networks (generator and discriminator) competing against each other to generate realistic data.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-3',
          question_text: 'What is attention mechanism in deep learning?',
          options: ['Paying attention', 'A technique that allows models to focus on relevant parts of input', 'Attention to detail', 'Focusing mechanism'],
          correct_answer: 1,
          explanation: 'Attention mechanisms allow models to focus on relevant parts of the input when making predictions, improving performance on sequential data.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-4',
          question_text: 'What is the vanishing gradient problem?',
          options: ['Gradients disappearing', 'When gradients become too small during backpropagation in deep networks', 'Missing gradients', 'Gradient loss'],
          correct_answer: 1,
          explanation: 'The vanishing gradient problem occurs when gradients become exponentially small during backpropagation in deep networks, making training difficult.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-5',
          question_text: 'What is batch normalization?',
          options: ['Normalizing batches', 'A technique to normalize inputs to each layer during training', 'Batch processing', 'Data normalization'],
          correct_answer: 1,
          explanation: 'Batch normalization normalizes the inputs to each layer during training, improving training speed and stability.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-6',
          question_text: 'What is the difference between LSTM and GRU?',
          options: ['No difference', 'LSTM has three gates, GRU has two gates', 'GRU is older', 'LSTM is simpler'],
          correct_answer: 1,
          explanation: 'LSTM has three gates (forget, input, output) while GRU has two gates (reset, update), making GRU simpler but often equally effective.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-7',
          question_text: 'What is meta-learning?',
          options: ['Learning about learning', 'Learning to learn new tasks quickly with minimal data', 'Meta-data learning', 'Advanced learning'],
          correct_answer: 1,
          explanation: 'Meta-learning is the process of learning to learn, enabling models to quickly adapt to new tasks with minimal training data.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-8',
          question_text: 'What is federated learning?',
          options: ['Federal learning', 'Training models across decentralized data without sharing raw data', 'Federated systems', 'Distributed learning'],
          correct_answer: 1,
          explanation: 'Federated learning trains machine learning models across decentralized data sources without sharing the raw data.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-9',
          question_text: 'What is adversarial training?',
          options: ['Training adversaries', 'Training models to be robust against adversarial examples', 'Competitive training', 'Hostile training'],
          correct_answer: 1,
          explanation: 'Adversarial training involves training models with adversarial examples to improve their robustness against attacks.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        },
        {
          id: 'ml-adv-10',
          question_text: 'What is neural architecture search (NAS)?',
          options: ['Searching for architectures', 'Automatically designing neural network architectures', 'Architecture searching', 'Network search'],
          correct_answer: 1,
          explanation: 'Neural Architecture Search automatically designs neural network architectures, often outperforming manually designed networks.',
          difficulty: 'advanced' as const,
          topic: 'Machine Learning',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getDataScienceQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced'): Question[] {
    const questionSets = {
      beginner: [
        {
          id: 'ds-1',
          question_text: 'What is Data Science?',
          options: ['A science about data', 'An interdisciplinary field that uses scientific methods to extract knowledge from data', 'Data analysis', 'Computer science'],
          correct_answer: 1,
          explanation: 'Data Science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from data.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-2',
          question_text: 'What are the main steps in the data science process?',
          options: ['Collect, Clean, Analyze, Visualize', 'Define, Measure, Analyze, Improve', 'Plan, Do, Check, Act', 'Input, Process, Output'],
          correct_answer: 0,
          explanation: 'The main steps typically include: Collect data, Clean data, Analyze data, and Visualize/Communicate results.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-3',
          question_text: 'What is data cleaning?',
          options: ['Cleaning data files', 'The process of detecting and correcting corrupt or inaccurate records', 'Organizing data', 'Deleting data'],
          correct_answer: 1,
          explanation: 'Data cleaning involves detecting and correcting (or removing) corrupt or inaccurate records from a dataset.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-4',
          question_text: 'What is exploratory data analysis (EDA)?',
          options: ['Exploring data', 'An approach to analyzing datasets to summarize their main characteristics', 'Data exploration', 'Analysis exploration'],
          correct_answer: 1,
          explanation: 'EDA is an approach to analyzing datasets to summarize their main characteristics, often using statistical graphics and other data visualization methods.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-5',
          question_text: 'What is a histogram?',
          options: ['A historical chart', 'A graphical representation of the distribution of numerical data', 'A history graph', 'A time chart'],
          correct_answer: 1,
          explanation: 'A histogram is a graphical representation of the distribution of numerical data, showing the frequency of data points in different ranges.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-6',
          question_text: 'What is the mean?',
          options: ['The middle value', 'The average of all values', 'The most frequent value', 'The range of values'],
          correct_answer: 1,
          explanation: 'The mean is the average of all values in a dataset, calculated by summing all values and dividing by the number of values.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-7',
          question_text: 'What is the median?',
          options: ['The average value', 'The middle value when data is sorted', 'The most frequent value', 'The typical value'],
          correct_answer: 1,
          explanation: 'The median is the middle value in a dataset when the values are arranged in ascending or descending order.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-8',
          question_text: 'What is correlation?',
          options: ['A relationship', 'A statistical measure of the relationship between two variables', 'A connection', 'A comparison'],
          correct_answer: 1,
          explanation: 'Correlation is a statistical measure that expresses the extent to which two variables are linearly related.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-9',
          question_text: 'What is a scatter plot?',
          options: ['A scattered chart', 'A plot that shows the relationship between two numerical variables', 'A random plot', 'A distribution plot'],
          correct_answer: 1,
          explanation: 'A scatter plot displays values for typically two variables for a set of data, showing the relationship between them.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-10',
          question_text: 'What is missing data?',
          options: ['Lost data', 'Data points that are not available for some observations', 'Hidden data', 'Deleted data'],
          correct_answer: 1,
          explanation: 'Missing data refers to data points that are not available for some observations in a dataset, which can affect analysis results.',
          difficulty: 'beginner' as const,
          topic: 'Data Science',
          level
        }
      ],
      intermediate: [
        {
          id: 'ds-int-1',
          question_text: 'What is feature selection?',
          options: ['Selecting features', 'The process of selecting relevant features for model building', 'Choosing characteristics', 'Feature picking'],
          correct_answer: 1,
          explanation: 'Feature selection is the process of selecting a subset of relevant features for use in model construction, improving performance and reducing complexity.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-2',
          question_text: 'What is the difference between population and sample?',
          options: ['No difference', 'Population is the entire group, sample is a subset', 'Sample is larger', 'Population is smaller'],
          correct_answer: 1,
          explanation: 'A population includes all members of a defined group, while a sample is a subset of the population used for analysis.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-3',
          question_text: 'What is statistical significance?',
          options: ['Important statistics', 'The likelihood that a result is not due to chance', 'Significant numbers', 'Statistical importance'],
          correct_answer: 1,
          explanation: 'Statistical significance indicates that the likelihood of the observed result occurring by chance is very low.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-4',
          question_text: 'What is a p-value?',
          options: ['A probability value', 'The probability of obtaining results at least as extreme as observed, assuming null hypothesis is true', 'A performance value', 'A prediction value'],
          correct_answer: 1,
          explanation: 'A p-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-5',
          question_text: 'What is A/B testing?',
          options: ['Testing A and B', 'A method of comparing two versions to determine which performs better', 'Alphabet testing', 'Binary testing'],
          correct_answer: 1,
          explanation: 'A/B testing is a method of comparing two versions of something to determine which one performs better based on statistical analysis.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-6',
          question_text: 'What is data normalization?',
          options: ['Making data normal', 'Scaling data to a standard range or distribution', 'Normalizing databases', 'Standard data'],
          correct_answer: 1,
          explanation: 'Data normalization is the process of scaling individual samples to have unit norm or scaling features to a standard range.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-7',
          question_text: 'What is the central limit theorem?',
          options: ['A central theory', 'The distribution of sample means approaches normal distribution as sample size increases', 'A limit theory', 'A central concept'],
          correct_answer: 1,
          explanation: 'The central limit theorem states that the distribution of sample means approaches a normal distribution as the sample size increases, regardless of the population distribution.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-8',
          question_text: 'What is time series analysis?',
          options: ['Analyzing time', 'Methods for analyzing time-ordered data to extract meaningful statistics', 'Series analysis', 'Time studies'],
          correct_answer: 1,
          explanation: 'Time series analysis comprises methods for analyzing time-ordered data to extract meaningful statistics and identify trends.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-9',
          question_text: 'What is data visualization?',
          options: ['Visualizing data', 'The graphical representation of information and data', 'Data graphics', 'Visual data'],
          correct_answer: 1,
          explanation: 'Data visualization is the graphical representation of information and data using visual elements like charts, graphs, and maps.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-int-10',
          question_text: 'What is outlier detection?',
          options: ['Detecting outliers', 'Identifying data points that differ significantly from other observations', 'Finding exceptions', 'Anomaly detection'],
          correct_answer: 1,
          explanation: 'Outlier detection is the identification of data points that differ significantly from other observations in a dataset.',
          difficulty: 'intermediate' as const,
          topic: 'Data Science',
          level
        }
      ],
      advanced: [
        {
          id: 'ds-adv-1',
          question_text: 'What is causal inference?',
          options: ['Inferring causes', 'The process of determining cause-and-effect relationships from data', 'Causal reasoning', 'Effect inference'],
          correct_answer: 1,
          explanation: 'Causal inference is the process of determining the independent, actual effect of a particular phenomenon that is a component of a larger system.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-2',
          question_text: 'What is Bayesian statistics?',
          options: ['Statistics by Bayes', 'A statistical approach that uses prior knowledge and updates beliefs with new evidence', 'Bayesian methods', 'Probability statistics'],
          correct_answer: 1,
          explanation: 'Bayesian statistics is an approach that uses prior knowledge combined with new evidence to update the probability of a hypothesis.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-3',
          question_text: 'What is principal component analysis (PCA)?',
          options: ['Principal analysis', 'A dimensionality reduction technique that finds principal components', 'Component analysis', 'Primary analysis'],
          correct_answer: 1,
          explanation: 'PCA is a dimensionality reduction technique that transforms data to lower dimensions while preserving as much variance as possible.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-4',
          question_text: 'What is survival analysis?',
          options: ['Analyzing survival', 'Statistical methods for analyzing time-to-event data', 'Survival studies', 'Event analysis'],
          correct_answer: 1,
          explanation: 'Survival analysis is a branch of statistics for analyzing the expected duration of time until one or more events happen.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-5',
          question_text: 'What is Monte Carlo simulation?',
          options: ['A casino simulation', 'A computational algorithm using random sampling to obtain numerical results', 'A gambling method', 'A random simulation'],
          correct_answer: 1,
          explanation: 'Monte Carlo simulation is a computational algorithm that relies on repeated random sampling to obtain numerical results.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-6',
          question_text: 'What is bootstrapping in statistics?',
          options: ['Starting up statistics', 'A resampling method for estimating the sampling distribution', 'Bootstrap methods', 'Self-starting analysis'],
          correct_answer: 1,
          explanation: 'Bootstrapping is a resampling method that involves repeatedly sampling from the original dataset with replacement to estimate the sampling distribution.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-7',
          question_text: 'What is the curse of dimensionality?',
          options: ['A dimensional curse', 'Problems that arise when analyzing high-dimensional data', 'A data curse', 'Dimensional problems'],
          correct_answer: 1,
          explanation: 'The curse of dimensionality refers to various phenomena that arise when analyzing and organizing data in high-dimensional spaces.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-8',
          question_text: 'What is feature engineering in the context of time series?',
          options: ['Engineering time features', 'Creating features that capture temporal patterns and relationships', 'Time engineering', 'Series engineering'],
          correct_answer: 1,
          explanation: 'Feature engineering for time series involves creating features that capture temporal patterns, seasonality, trends, and lag relationships.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-9',
          question_text: 'What is confounding in statistical analysis?',
          options: ['Confusing analysis', 'When the effect of an exposure on an outcome is mixed with another variable', 'Confounding variables', 'Mixed effects'],
          correct_answer: 1,
          explanation: 'Confounding occurs when the effect of an exposure on an outcome is mixed with the effect of another variable, leading to biased results.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        },
        {
          id: 'ds-adv-10',
          question_text: 'What is propensity score matching?',
          options: ['Matching propensities', 'A technique to reduce bias by matching treated and control units with similar characteristics', 'Score matching', 'Propensity analysis'],
          correct_answer: 1,
          explanation: 'Propensity score matching is a technique used to reduce bias in observational studies by matching treated and control units with similar propensity scores.',
          difficulty: 'advanced' as const,
          topic: 'Data Science',
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }

  private getGeneralProgrammingQuestions(level: number, difficulty: 'beginner' | 'intermediate' | 'advanced', topic: string): Question[] {
    // Fallback questions for unsupported topics
    const questionSets = {
      beginner: [
        {
          id: 'gen-1',
          question_text: `What is a variable in ${topic}?`,
          options: ['A changing value', 'A storage location with an associated name', 'A function', 'A constant'],
          correct_answer: 1,
          explanation: 'A variable is a storage location with an associated name that contains data.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-2',
          question_text: `What is a function in ${topic}?`,
          options: ['A mathematical operation', 'A reusable block of code that performs a specific task', 'A variable', 'A data type'],
          correct_answer: 1,
          explanation: 'A function is a reusable block of code that performs a specific task and can be called multiple times.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-3',
          question_text: `What is a loop in ${topic}?`,
          options: ['A circular structure', 'A control structure that repeats a block of code', 'A data structure', 'A function'],
          correct_answer: 1,
          explanation: 'A loop is a control structure that allows you to repeat a block of code multiple times.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-4',
          question_text: `What is an array in ${topic}?`,
          options: ['A single value', 'A collection of elements stored in contiguous memory', 'A function', 'A loop'],
          correct_answer: 1,
          explanation: 'An array is a data structure that stores a collection of elements, typically of the same type.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-5',
          question_text: `What is debugging in ${topic}?`,
          options: ['Removing bugs', 'The process of finding and fixing errors in code', 'Testing code', 'Writing code'],
          correct_answer: 1,
          explanation: 'Debugging is the process of finding and fixing errors or bugs in computer programs.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-6',
          question_text: `What is a conditional statement in ${topic}?`,
          options: ['A statement with conditions', 'A control structure that executes code based on conditions', 'A loop', 'A function'],
          correct_answer: 1,
          explanation: 'A conditional statement allows you to execute different blocks of code based on whether certain conditions are true or false.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-7',
          question_text: `What is syntax in ${topic}?`,
          options: ['The meaning of code', 'The set of rules that defines valid constructs in the language', 'The logic of code', 'The purpose of code'],
          correct_answer: 1,
          explanation: 'Syntax refers to the set of rules that defines the combinations of symbols that are considered valid in a programming language.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-8',
          question_text: `What is a data type in ${topic}?`,
          options: ['A type of data', 'A classification that specifies what type of value a variable can hold', 'A variable type', 'A function type'],
          correct_answer: 1,
          explanation: 'A data type is a classification that specifies which type of value a variable can hold and what operations can be performed on it.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-9',
          question_text: `What is an algorithm in ${topic}?`,
          options: ['A mathematical formula', 'A step-by-step procedure for solving a problem', 'A data structure', 'A programming language'],
          correct_answer: 1,
          explanation: 'An algorithm is a finite sequence of well-defined instructions for solving a problem or performing a computation.',
          difficulty: 'beginner' as const,
          topic,
          level
        },
        {
          id: 'gen-10',
          question_text: `What is compilation in ${topic}?`,
          options: ['Collecting code', 'The process of translating source code into machine code', 'Running code', 'Writing code'],
          correct_answer: 1,
          explanation: 'Compilation is the process of translating source code written in a high-level programming language into machine code.',
          difficulty: 'beginner' as const,
          topic,
          level
        }
      ],
      intermediate: [
        {
          id: 'gen-int-1',
          question_text: `What is object-oriented programming in ${topic}?`,
          options: ['Programming with objects', 'A programming paradigm based on objects and classes', 'Object programming', 'Oriented programming'],
          correct_answer: 1,
          explanation: 'Object-oriented programming is a programming paradigm based on the concept of objects, which contain data and code.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-2',
          question_text: `What is recursion in ${topic}?`,
          options: ['Recurring code', 'A function calling itself', 'Repeated execution', 'Circular logic'],
          correct_answer: 1,
          explanation: 'Recursion is a programming technique where a function calls itself to solve a problem by breaking it into smaller subproblems.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-3',
          question_text: `What is a data structure in ${topic}?`,
          options: ['A structure for data', 'A way of organizing and storing data for efficient access', 'Data organization', 'Information structure'],
          correct_answer: 1,
          explanation: 'A data structure is a way of organizing and storing data so that it can be accessed and modified efficiently.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-4',
          question_text: `What is exception handling in ${topic}?`,
          options: ['Handling exceptions', 'A mechanism to handle runtime errors gracefully', 'Error handling', 'Exception management'],
          correct_answer: 1,
          explanation: 'Exception handling is a programming construct that allows you to handle runtime errors gracefully without crashing the program.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-5',
          question_text: `What is polymorphism in ${topic}?`,
          options: ['Multiple forms', 'The ability of objects to take multiple forms', 'Shape changing', 'Form variation'],
          correct_answer: 1,
          explanation: 'Polymorphism allows objects of different types to be treated as objects of a common base type, enabling one interface for different data types.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-6',
          question_text: `What is inheritance in ${topic}?`,
          options: ['Inheriting code', 'A mechanism where a class acquires properties of another class', 'Code inheritance', 'Property inheritance'],
          correct_answer: 1,
          explanation: 'Inheritance is a mechanism in object-oriented programming where a new class acquires the properties and methods of an existing class.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-7',
          question_text: `What is encapsulation in ${topic}?`,
          options: ['Wrapping code', 'Bundling data and methods that operate on that data within a single unit', 'Code protection', 'Data hiding'],
          correct_answer: 1,
          explanation: 'Encapsulation is the bundling of data and the methods that operate on that data within a single unit, typically a class.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-8',
          question_text: `What is abstraction in ${topic}?`,
          options: ['Abstract concepts', 'Hiding complex implementation details while showing only essential features', 'Simplified code', 'Conceptual programming'],
          correct_answer: 1,
          explanation: 'Abstraction is the process of hiding complex implementation details while showing only the essential features of an object.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-9',
          question_text: `What is a design pattern in ${topic}?`,
          options: ['A design template', 'A reusable solution to commonly occurring problems in software design', 'Code patterns', 'Design solutions'],
          correct_answer: 1,
          explanation: 'A design pattern is a reusable solution to a commonly occurring problem in software design and development.',
          difficulty: 'intermediate' as const,
          topic,
          level
        },
        {
          id: 'gen-int-10',
          question_text: `What is concurrency in ${topic}?`,
          options: ['Concurrent execution', 'The ability to execute multiple tasks simultaneously', 'Parallel processing', 'Simultaneous operations'],
          correct_answer: 1,
          explanation: 'Concurrency is the ability of a program to execute multiple tasks simultaneously, improving performance and responsiveness.',
          difficulty: 'intermediate' as const,
          topic,
          level
        }
      ],
      advanced: [
        {
          id: 'gen-adv-1',
          question_text: `What is memory management in ${topic}?`,
          options: ['Managing memory', 'The process of controlling and coordinating computer memory', 'Memory control', 'Memory allocation'],
          correct_answer: 1,
          explanation: 'Memory management is the process of controlling and coordinating computer memory, assigning portions called blocks to various running programs.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-2',
          question_text: `What is garbage collection in ${topic}?`,
          options: ['Collecting garbage', 'Automatic memory management that reclaims memory used by objects no longer referenced', 'Memory cleanup', 'Waste collection'],
          correct_answer: 1,
          explanation: 'Garbage collection is a form of automatic memory management that reclaims memory used by objects that are no longer referenced by the program.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-3',
          question_text: `What is multithreading in ${topic}?`,
          options: ['Multiple threads', 'The ability to execute multiple threads concurrently within a single process', 'Thread management', 'Parallel threading'],
          correct_answer: 1,
          explanation: 'Multithreading is the ability of a CPU or a single core to execute multiple threads concurrently within a single process.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-4',
          question_text: `What is a race condition in ${topic}?`,
          options: ['A racing condition', 'When multiple threads access shared data simultaneously leading to unpredictable results', 'Competitive programming', 'Speed conditions'],
          correct_answer: 1,
          explanation: 'A race condition occurs when multiple threads access shared data simultaneously, and the final result depends on the timing of their execution.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-5',
          question_text: `What is deadlock in ${topic}?`,
          options: ['A locked state', 'A situation where two or more threads are blocked forever, waiting for each other', 'Permanent lock', 'System lock'],
          correct_answer: 1,
          explanation: 'Deadlock is a situation where two or more threads are blocked forever, each waiting for the other to release a resource.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-6',
          question_text: `What is code optimization in ${topic}?`,
          options: ['Optimizing code', 'The process of modifying code to improve efficiency without changing functionality', 'Code improvement', 'Performance enhancement'],
          correct_answer: 1,
          explanation: 'Code optimization is the process of modifying code to make it run more efficiently while maintaining the same functionality.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-7',
          question_text: `What is metaprogramming in ${topic}?`,
          options: ['Meta-level programming', 'Writing programs that manipulate programs', 'Advanced programming', 'Program generation'],
          correct_answer: 1,
          explanation: 'Metaprogramming is a programming technique where programs have the ability to treat other programs as their data.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-8',
          question_text: `What is reflection in ${topic}?`,
          options: ['Code reflection', 'The ability of a program to examine and modify its own structure at runtime', 'Self-examination', 'Runtime inspection'],
          correct_answer: 1,
          explanation: 'Reflection is the ability of a program to examine, introspect, and modify its own structure and behavior at runtime.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-9',
          question_text: `What is dependency injection in ${topic}?`,
          options: ['Injecting dependencies', 'A design pattern that provides dependencies to an object rather than having it create them', 'Dependency management', 'Object injection'],
          correct_answer: 1,
          explanation: 'Dependency injection is a design pattern where dependencies are provided to an object rather than having the object create them itself.',
          difficulty: 'advanced' as const,
          topic,
          level
        },
        {
          id: 'gen-adv-10',
          question_text: `What is functional programming in ${topic}?`,
          options: ['Programming with functions', 'A programming paradigm that treats computation as evaluation of mathematical functions', 'Function-based programming', 'Mathematical programming'],
          correct_answer: 1,
          explanation: 'Functional programming is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state.',
          difficulty: 'advanced' as const,
          topic,
          level
        }
      ]
    };

    return questionSets[difficulty] || questionSets.beginner;
  }
}

export const aiService = new AIService();