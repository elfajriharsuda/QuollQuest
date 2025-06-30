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
  private availableTopics = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'HTML',
    'CSS',
    'TypeScript',
    'Vue.js',
    'Angular',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Git',
    'Docker',
    'AWS',
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'API Development',
    'Database Design',
    'Software Architecture',
    'Testing',
    'Agile',
    'Scrum',
    'Project Management'
  ];

  getAvailableTopics(): string[] {
    return this.availableTopics;
  }

  async generateQuestionsForTopic(topic: string, level: number): Promise<Question[]> {
    // Simulate AI question generation with realistic questions
    const questions: Question[] = [];
    
    const difficultyMap = {
      0: 'beginner',
      1: 'beginner',
      2: 'intermediate',
      3: 'intermediate',
      4: 'advanced',
      5: 'advanced'
    } as const;

    const difficulty = difficultyMap[level as keyof typeof difficultyMap] || 'beginner';

    // Generate 10 questions for the topic and level
    for (let i = 0; i < 10; i++) {
      const question = this.generateQuestionForTopic(topic, level, difficulty, i);
      questions.push(question);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return questions;
  }

  private generateQuestionForTopic(topic: string, level: number, difficulty: string, index: number): Question {
    const questionTemplates = this.getQuestionTemplates(topic, difficulty);
    const template = questionTemplates[index % questionTemplates.length];
    
    return {
      id: `${topic.toLowerCase()}-${level}-${index}`,
      question_text: template.question,
      options: template.options,
      correct_answer: template.correct,
      explanation: template.explanation,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      topic,
      level
    };
  }

  private getQuestionTemplates(topic: string, difficulty: string) {
    const templates = {
      JavaScript: {
        beginner: [
          {
            question: "What is the correct way to declare a variable in JavaScript?",
            options: ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
            correct: 0,
            explanation: "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords."
          },
          {
            question: "Which of the following is NOT a JavaScript data type?",
            options: ["String", "Boolean", "Integer", "Undefined"],
            correct: 2,
            explanation: "JavaScript has Number type, not specifically Integer. It uses floating-point numbers."
          },
          {
            question: "How do you write a comment in JavaScript?",
            options: ["<!-- This is a comment -->", "// This is a comment", "# This is a comment", "/* This is a comment"],
            correct: 1,
            explanation: "Single-line comments in JavaScript start with //. Multi-line comments use /* */."
          },
          {
            question: "What does the '===' operator do in JavaScript?",
            options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
            correct: 2,
            explanation: "The === operator checks for strict equality, comparing both value and type."
          },
          {
            question: "Which method is used to add an element to the end of an array?",
            options: ["push()", "add()", "append()", "insert()"],
            correct: 0,
            explanation: "The push() method adds one or more elements to the end of an array."
          },
          {
            question: "What is the result of 'typeof null' in JavaScript?",
            options: ["'null'", "'undefined'", "'object'", "'boolean'"],
            correct: 2,
            explanation: "This is a known quirk in JavaScript. typeof null returns 'object', which is considered a bug."
          },
          {
            question: "How do you create a function in JavaScript?",
            options: ["function myFunc() {}", "create function myFunc() {}", "def myFunc() {}", "func myFunc() {}"],
            correct: 0,
            explanation: "Functions in JavaScript are declared using the 'function' keyword."
          },
          {
            question: "What does 'NaN' stand for in JavaScript?",
            options: ["Not a Name", "Not a Number", "Null and Null", "New and Nice"],
            correct: 1,
            explanation: "NaN stands for 'Not a Number' and represents an invalid number value."
          },
          {
            question: "Which operator is used for string concatenation in JavaScript?",
            options: ["&", "+", ".", "concat"],
            correct: 1,
            explanation: "The + operator is used for both addition and string concatenation in JavaScript."
          },
          {
            question: "What is the correct way to write an if statement in JavaScript?",
            options: ["if i = 5 then", "if (i == 5)", "if i == 5", "if (i = 5)"],
            correct: 1,
            explanation: "If statements in JavaScript require parentheses around the condition."
          }
        ],
        intermediate: [
          {
            question: "What is a closure in JavaScript?",
            options: ["A way to close a program", "A function with access to outer scope", "A type of loop", "A method to hide variables"],
            correct: 1,
            explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned."
          },
          {
            question: "What does the 'this' keyword refer to in JavaScript?",
            options: ["The current function", "The global object", "The calling object", "The parent object"],
            correct: 2,
            explanation: "The 'this' keyword refers to the object that is calling the function, though its value can change depending on how the function is called."
          },
          {
            question: "What is the difference between 'let' and 'var'?",
            options: ["No difference", "let has block scope, var has function scope", "var is newer", "let is faster"],
            correct: 1,
            explanation: "let has block scope while var has function scope. let also prevents redeclaration in the same scope."
          },
          {
            question: "What is event bubbling in JavaScript?",
            options: ["Creating new events", "Events moving up the DOM tree", "Events moving down the DOM tree", "Deleting events"],
            correct: 1,
            explanation: "Event bubbling is when an event starts from the target element and bubbles up through its parent elements."
          },
          {
            question: "What does the spread operator (...) do?",
            options: ["Spreads elements of an iterable", "Creates a new array", "Deletes elements", "Sorts an array"],
            correct: 0,
            explanation: "The spread operator (...) expands elements of an iterable (like an array) into individual elements."
          },
          {
            question: "What is the purpose of async/await in JavaScript?",
            options: ["To make code run faster", "To handle asynchronous operations", "To create loops", "To define variables"],
            correct: 1,
            explanation: "async/await provides a cleaner way to handle asynchronous operations and Promises."
          },
          {
            question: "What is destructuring in JavaScript?",
            options: ["Breaking code", "Extracting values from arrays/objects", "Creating new objects", "Deleting properties"],
            correct: 1,
            explanation: "Destructuring allows you to extract values from arrays or properties from objects into distinct variables."
          },
          {
            question: "What is the difference between map() and forEach()?",
            options: ["No difference", "map() returns a new array, forEach() doesn't", "forEach() is faster", "map() modifies original array"],
            correct: 1,
            explanation: "map() creates and returns a new array with transformed elements, while forEach() just iterates without returning anything."
          },
          {
            question: "What is a Promise in JavaScript?",
            options: ["A guarantee", "An object representing eventual completion of an async operation", "A type of function", "A variable type"],
            correct: 1,
            explanation: "A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation."
          },
          {
            question: "What does Object.freeze() do?",
            options: ["Stops code execution", "Makes an object immutable", "Deletes an object", "Copies an object"],
            correct: 1,
            explanation: "Object.freeze() makes an object immutable - you cannot add, delete, or modify its properties."
          }
        ],
        advanced: [
          {
            question: "What is the event loop in JavaScript?",
            options: ["A type of for loop", "The mechanism that handles async operations", "A way to create events", "A debugging tool"],
            correct: 1,
            explanation: "The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded."
          },
          {
            question: "What is the difference between call(), apply(), and bind()?",
            options: ["No difference", "They change the 'this' context differently", "They are deprecated", "They work with different data types"],
            correct: 1,
            explanation: "call() and apply() invoke functions immediately with different argument passing, while bind() returns a new function with bound context."
          },
          {
            question: "What is a WeakMap in JavaScript?",
            options: ["A small Map", "A Map with weak references to keys", "A broken Map", "A Map for weak data"],
            correct: 1,
            explanation: "WeakMap is a collection where keys are weakly referenced, allowing for garbage collection when keys are no longer referenced elsewhere."
          },
          {
            question: "What is the purpose of Symbols in JavaScript?",
            options: ["Mathematical operations", "Creating unique identifiers", "String manipulation", "Number formatting"],
            correct: 1,
            explanation: "Symbols are primitive data types that create unique identifiers, often used for object property keys."
          },
          {
            question: "What is a Proxy in JavaScript?",
            options: ["A network proxy", "An object that intercepts operations on other objects", "A type of function", "A debugging tool"],
            correct: 1,
            explanation: "A Proxy allows you to intercept and customize operations performed on objects (like property lookup, assignment, etc.)."
          },
          {
            question: "What is the difference between microtasks and macrotasks?",
            options: ["Size difference", "Priority in the event loop", "They're the same", "One is deprecated"],
            correct: 1,
            explanation: "Microtasks (like Promise callbacks) have higher priority than macrotasks (like setTimeout) in the event loop."
          },
          {
            question: "What is tail call optimization?",
            options: ["Optimizing function calls at the end", "A debugging technique", "A type of loop", "Memory management"],
            correct: 0,
            explanation: "Tail call optimization allows recursive functions to reuse stack frames when the recursive call is the last operation."
          },
          {
            question: "What is the difference between shallow and deep copying?",
            options: ["Depth of water", "Level of object copying", "Speed difference", "Memory usage"],
            correct: 1,
            explanation: "Shallow copy copies only the first level, while deep copy recursively copies all nested objects and arrays."
          },
          {
            question: "What is a generator function in JavaScript?",
            options: ["Creates random numbers", "A function that can pause and resume execution", "Generates HTML", "Creates new objects"],
            correct: 1,
            explanation: "Generator functions can pause execution with 'yield' and resume later, useful for creating iterators and handling async flows."
          },
          {
            question: "What is the purpose of the Reflect API?",
            options: ["Mirror objects", "Provides methods for interceptable operations", "Reflects light", "Creates reflections"],
            correct: 1,
            explanation: "The Reflect API provides methods for interceptable JavaScript operations, often used with Proxies."
          }
        ]
      },
      Python: {
        beginner: [
          {
            question: "How do you print 'Hello World' in Python?",
            options: ["echo 'Hello World'", "print('Hello World')", "console.log('Hello World')", "printf('Hello World')"],
            correct: 1,
            explanation: "In Python, the print() function is used to output text to the console."
          },
          {
            question: "Which of the following is the correct way to create a list in Python?",
            options: ["list = [1, 2, 3]", "list = (1, 2, 3)", "list = {1, 2, 3}", "list = <1, 2, 3>"],
            correct: 0,
            explanation: "Lists in Python are created using square brackets []."
          },
          {
            question: "What is the correct way to create a comment in Python?",
            options: ["// This is a comment", "# This is a comment", "<!-- This is a comment -->", "/* This is a comment */"],
            correct: 1,
            explanation: "Comments in Python start with the # symbol."
          },
          {
            question: "Which keyword is used to define a function in Python?",
            options: ["function", "def", "func", "define"],
            correct: 1,
            explanation: "The 'def' keyword is used to define functions in Python."
          },
          {
            question: "What is the result of 3 + 2 * 4 in Python?",
            options: ["20", "11", "14", "9"],
            correct: 1,
            explanation: "Following order of operations, multiplication happens first: 3 + (2 * 4) = 3 + 8 = 11."
          },
          {
            question: "How do you get user input in Python?",
            options: ["input()", "get()", "read()", "scan()"],
            correct: 0,
            explanation: "The input() function is used to get user input in Python."
          },
          {
            question: "Which of these is NOT a valid Python data type?",
            options: ["int", "float", "string", "bool"],
            correct: 2,
            explanation: "The correct data type is 'str', not 'string' in Python."
          },
          {
            question: "What does the len() function do?",
            options: ["Lengthens a string", "Returns the length of an object", "Creates a new list", "Deletes characters"],
            correct: 1,
            explanation: "The len() function returns the number of items in an object."
          },
          {
            question: "How do you create a string in Python?",
            options: ["'Hello' or \"Hello\"", "string('Hello')", "new String('Hello')", "str = Hello"],
            correct: 0,
            explanation: "Strings in Python can be created using single quotes or double quotes."
          },
          {
            question: "What is the correct syntax for an if statement in Python?",
            options: ["if (x == 5):", "if x == 5:", "if x = 5:", "if x equals 5:"],
            correct: 1,
            explanation: "Python if statements don't require parentheses and end with a colon."
          }
        ],
        intermediate: [
          {
            question: "What is a list comprehension in Python?",
            options: ["A way to understand lists", "A concise way to create lists", "A type of loop", "A debugging tool"],
            correct: 1,
            explanation: "List comprehensions provide a concise way to create lists based on existing lists or other iterables."
          },
          {
            question: "What is the difference between a list and a tuple in Python?",
            options: ["No difference", "Lists are mutable, tuples are immutable", "Tuples are faster", "Lists use more memory"],
            correct: 1,
            explanation: "Lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation)."
          },
          {
            question: "What does the 'self' parameter represent in Python classes?",
            options: ["The class itself", "The instance of the class", "A global variable", "The parent class"],
            correct: 1,
            explanation: "'self' refers to the instance of the class and is used to access instance variables and methods."
          },
          {
            question: "What is a decorator in Python?",
            options: ["A design pattern", "A function that modifies another function", "A type of variable", "A loop structure"],
            correct: 1,
            explanation: "A decorator is a function that takes another function and extends its behavior without explicitly modifying it."
          },
          {
            question: "What is the purpose of the __init__ method?",
            options: ["To initialize objects", "To delete objects", "To copy objects", "To compare objects"],
            correct: 0,
            explanation: "The __init__ method is the constructor that initializes newly created objects."
          },
          {
            question: "What does the 'with' statement do in Python?",
            options: ["Creates loops", "Handles context management", "Defines functions", "Imports modules"],
            correct: 1,
            explanation: "The 'with' statement is used for context management, ensuring proper resource cleanup."
          },
          {
            question: "What is the difference between '==' and 'is' in Python?",
            options: ["No difference", "'==' compares values, 'is' compares identity", "'is' is deprecated", "'==' is faster"],
            correct: 1,
            explanation: "'==' compares values for equality, while 'is' compares object identity (same object in memory)."
          },
          {
            question: "What is a lambda function in Python?",
            options: ["A Greek letter", "An anonymous function", "A type of loop", "A class method"],
            correct: 1,
            explanation: "Lambda functions are small anonymous functions that can have any number of arguments but can only have one expression."
          },
          {
            question: "What does the map() function do?",
            options: ["Creates maps", "Applies a function to all items in an iterable", "Finds locations", "Sorts data"],
            correct: 1,
            explanation: "map() applies a given function to each item of an iterable and returns an iterator."
          },
          {
            question: "What is the purpose of *args and **kwargs?",
            options: ["Variable arguments", "Fixed arguments", "Keyword arguments", "Both variable and keyword arguments"],
            correct: 3,
            explanation: "*args allows functions to accept variable number of positional arguments, **kwargs for keyword arguments."
          }
        ],
        advanced: [
          {
            question: "What is the Global Interpreter Lock (GIL) in Python?",
            options: ["A security feature", "A mutex that protects Python objects", "A type of loop", "A debugging tool"],
            correct: 1,
            explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously."
          },
          {
            question: "What is metaclass in Python?",
            options: ["A class above others", "A class whose instances are classes", "A deprecated feature", "A type of inheritance"],
            correct: 1,
            explanation: "A metaclass is a class whose instances are classes. It defines how classes are constructed."
          },
          {
            question: "What is the difference between deep copy and shallow copy?",
            options: ["Depth of water", "Level of object copying", "Speed difference", "Memory usage"],
            correct: 1,
            explanation: "Shallow copy creates a new object but references to nested objects, deep copy creates new objects recursively."
          },
          {
            question: "What is a generator in Python?",
            options: ["Creates electricity", "A function that returns an iterator", "A type of class", "A loop structure"],
            correct: 1,
            explanation: "Generators are functions that return an iterator and yield values one at a time, saving memory."
          },
          {
            question: "What is the purpose of the __slots__ attribute?",
            options: ["Creates time slots", "Restricts instance attributes and saves memory", "Defines methods", "Handles inheritance"],
            correct: 1,
            explanation: "__slots__ restricts the attributes that instances can have and can save memory by avoiding __dict__."
          },
          {
            question: "What is monkey patching in Python?",
            options: ["Fixing bugs", "Dynamically modifying classes or modules at runtime", "A debugging technique", "A testing method"],
            correct: 1,
            explanation: "Monkey patching is dynamically modifying a class or module at runtime to change or extend behavior."
          },
          {
            question: "What is the difference between @staticmethod and @classmethod?",
            options: ["No difference", "staticmethod doesn't receive implicit first argument, classmethod receives cls", "classmethod is deprecated", "staticmethod is faster"],
            correct: 1,
            explanation: "@staticmethod doesn't receive any implicit first argument, @classmethod receives the class as first argument (cls)."
          },
          {
            question: "What is a context manager in Python?",
            options: ["Manages contexts", "An object that defines runtime context for executing a block of code", "A type of function", "A debugging tool"],
            correct: 1,
            explanation: "Context managers define the runtime context for executing a block of code, typically used with 'with' statements."
          },
          {
            question: "What is the purpose of the __new__ method?",
            options: ["Creates new files", "Controls object creation", "Initializes objects", "Deletes objects"],
            correct: 1,
            explanation: "__new__ is responsible for creating and returning a new instance of a class, called before __init__."
          },
          {
            question: "What is asyncio in Python?",
            options: ["Asynchronous I/O", "A library for writing concurrent code", "A type of loop", "Both A and B"],
            correct: 3,
            explanation: "asyncio is a library for writing concurrent code using async/await syntax and handling asynchronous I/O operations."
          }
        ]
      },
      React: {
        beginner: [
          {
            question: "What is React?",
            options: ["A database", "A JavaScript library for building user interfaces", "A web server", "A CSS framework"],
            correct: 1,
            explanation: "React is a JavaScript library developed by Facebook for building user interfaces, especially web applications."
          },
          {
            question: "What is JSX?",
            options: ["A new programming language", "JavaScript XML - syntax extension for JavaScript", "A CSS preprocessor", "A database query language"],
            correct: 1,
            explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
          },
          {
            question: "How do you create a React component?",
            options: ["function MyComponent() { return <div>Hello</div>; }", "class MyComponent() { return <div>Hello</div>; }", "component MyComponent() { return <div>Hello</div>; }", "react MyComponent() { return <div>Hello</div>; }"],
            correct: 0,
            explanation: "React components can be created as functions that return JSX elements."
          },
          {
            question: "What is the virtual DOM?",
            options: ["A real DOM", "A JavaScript representation of the real DOM", "A CSS framework", "A database"],
            correct: 1,
            explanation: "The virtual DOM is a JavaScript representation of the real DOM that React uses to optimize updates."
          },
          {
            question: "How do you pass data to a React component?",
            options: ["Through props", "Through state", "Through context", "Through refs"],
            correct: 0,
            explanation: "Props (properties) are used to pass data from parent components to child components."
          },
          {
            question: "What is state in React?",
            options: ["A country", "Data that can change over time in a component", "A CSS property", "A HTML attribute"],
            correct: 1,
            explanation: "State is data that can change over time and when it changes, it triggers a re-render of the component."
          },
          {
            question: "Which hook is used to manage state in functional components?",
            options: ["useEffect", "useState", "useContext", "useReducer"],
            correct: 1,
            explanation: "useState is the hook used to add state to functional components."
          },
          {
            question: "What does the useEffect hook do?",
            options: ["Manages state", "Handles side effects", "Creates components", "Styles components"],
            correct: 1,
            explanation: "useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM."
          },
          {
            question: "How do you handle events in React?",
            options: ["onClick={handleClick}", "onclick=\"handleClick()\"", "on-click={handleClick}", "@click={handleClick}"],
            correct: 0,
            explanation: "React uses camelCase event handlers like onClick, and you pass the function reference."
          },
          {
            question: "What is the key prop used for in React lists?",
            options: ["Styling", "Unique identification for efficient re-rendering", "Event handling", "Data binding"],
            correct: 1,
            explanation: "The key prop helps React identify which items have changed, been added, or removed for efficient updates."
          }
        ],
        intermediate: [
          {
            question: "What is the difference between controlled and uncontrolled components?",
            options: ["No difference", "Controlled components have their state managed by React", "Uncontrolled components are better", "Controlled components are deprecated"],
            correct: 1,
            explanation: "Controlled components have their form data handled by React state, while uncontrolled components store their own state internally."
          },
          {
            question: "What is React Context?",
            options: ["A way to pass data through component tree without props drilling", "A type of component", "A styling method", "A routing library"],
            correct: 0,
            explanation: "React Context provides a way to pass data through the component tree without having to pass props down manually at every level."
          },
          {
            question: "What is the purpose of useCallback hook?",
            options: ["To call functions", "To memoize functions to prevent unnecessary re-renders", "To create callbacks", "To handle events"],
            correct: 1,
            explanation: "useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed."
          },
          {
            question: "What is the difference between useMemo and useCallback?",
            options: ["No difference", "useMemo memoizes values, useCallback memoizes functions", "useCallback is newer", "useMemo is deprecated"],
            correct: 1,
            explanation: "useMemo memoizes the result of a computation, while useCallback memoizes the function itself."
          },
          {
            question: "What is prop drilling?",
            options: ["Drilling holes", "Passing props through multiple component levels", "A debugging technique", "A performance optimization"],
            correct: 1,
            explanation: "Prop drilling is the process of passing data from a parent component down to deeply nested child components through props."
          },
          {
            question: "What is the purpose of React.memo?",
            options: ["To memorize components", "To prevent unnecessary re-renders of functional components", "To create memos", "To handle memory"],
            correct: 1,
            explanation: "React.memo is a higher-order component that memoizes the result and skips re-rendering if props haven't changed."
          },
          {
            question: "What is the useReducer hook used for?",
            options: ["To reduce file size", "To manage complex state logic", "To reduce components", "To handle arrays"],
            correct: 1,
            explanation: "useReducer is used for managing complex state logic and is an alternative to useState for more complex state updates."
          },
          {
            question: "What is a higher-order component (HOC)?",
            options: ["A tall component", "A function that takes a component and returns a new component", "A complex component", "A parent component"],
            correct: 1,
            explanation: "A HOC is a function that takes a component and returns a new component with additional props or behavior."
          },
          {
            question: "What is the purpose of useRef hook?",
            options: ["To reference files", "To access DOM elements directly", "To create references", "To handle routing"],
            correct: 1,
            explanation: "useRef returns a mutable ref object that can be used to access DOM elements directly or store mutable values."
          },
          {
            question: "What is React.Fragment used for?",
            options: ["To break components", "To group multiple elements without adding extra DOM nodes", "To create fragments", "To handle errors"],
            correct: 1,
            explanation: "React.Fragment allows you to group multiple elements without adding an extra wrapper element to the DOM."
          }
        ],
        advanced: [
          {
            question: "What is React Fiber?",
            options: ["A type of cable", "React's reconciliation algorithm", "A component library", "A styling framework"],
            correct: 1,
            explanation: "React Fiber is the new reconciliation algorithm that allows React to break work into chunks and prioritize updates."
          },
          {
            question: "What is the difference between server-side rendering and client-side rendering?",
            options: ["No difference", "SSR renders on server, CSR renders in browser", "CSR is faster", "SSR is deprecated"],
            correct: 1,
            explanation: "SSR renders the initial HTML on the server, while CSR renders everything in the browser using JavaScript."
          },
          {
            question: "What is React Suspense?",
            options: ["A thriller movie", "A feature for handling loading states", "A type of component", "A debugging tool"],
            correct: 1,
            explanation: "React Suspense allows components to 'wait' for something before rendering, typically used for code splitting and data fetching."
          },
          {
            question: "What is the purpose of Error Boundaries?",
            options: ["To create borders", "To catch JavaScript errors in component tree", "To handle network errors", "To validate props"],
            correct: 1,
            explanation: "Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree."
          },
          {
            question: "What is React's reconciliation process?",
            options: ["Making peace", "The process of updating the DOM efficiently", "A debugging process", "A testing process"],
            correct: 1,
            explanation: "Reconciliation is React's algorithm for efficiently updating the DOM by comparing the new virtual DOM with the previous one."
          },
          {
            question: "What is the purpose of React.lazy?",
            options: ["To make components lazy", "To enable code splitting for components", "To delay rendering", "To optimize performance"],
            correct: 1,
            explanation: "React.lazy enables code splitting by allowing you to load components dynamically when they're needed."
          },
          {
            question: "What is the difference between useLayoutEffect and useEffect?",
            options: ["No difference", "useLayoutEffect runs synchronously after DOM mutations", "useLayoutEffect is deprecated", "useEffect is faster"],
            correct: 1,
            explanation: "useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, while useEffect runs asynchronously."
          },
          {
            question: "What is React's Concurrent Mode?",
            options: ["Running multiple apps", "A set of features for better user experience", "A development mode", "A testing framework"],
            correct: 1,
            explanation: "Concurrent Mode is a set of features that help React apps stay responsive by rendering component trees without blocking the main thread."
          },
          {
            question: "What is the purpose of React DevTools Profiler?",
            options: ["To create profiles", "To measure performance of React components", "To debug code", "To test components"],
            correct: 1,
            explanation: "The Profiler helps identify performance bottlenecks by measuring how often components render and the cost of rendering."
          },
          {
            question: "What is React's time slicing?",
            options: ["Cutting time", "Breaking work into small chunks to avoid blocking", "A scheduling feature", "A performance optimization"],
            correct: 1,
            explanation: "Time slicing allows React to break work into small chunks and spread it across multiple frames to keep the app responsive."
          }
        ]
      }
    };

    const topicTemplates = templates[topic as keyof typeof templates];
    if (!topicTemplates) {
      // Fallback for unsupported topics
      return [
        {
          question: `What is a fundamental concept in ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: `This is a basic question about ${topic} fundamentals.`
        }
      ];
    }

    const difficultyTemplates = topicTemplates[difficulty as keyof typeof topicTemplates];
    return difficultyTemplates || topicTemplates.beginner;
  }
}

export const aiService = new AIService();