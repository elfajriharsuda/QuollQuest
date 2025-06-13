interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

interface QuestionGenerationRequest {
  topic: string;
  level: number;
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

class AIService {
  private questionDatabase: Record<string, Record<string, any[]>> = {
    'JavaScript': {
      beginner: [
        {
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: ['variable myVar = 5;', 'var myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
          correct: 1,
          explanation: 'In JavaScript, variables are declared using var, let, or const keywords. "var" is the traditional way to declare variables.'
        },
        {
          question: 'Which of the following is NOT a JavaScript data type?',
          options: ['string', 'boolean', 'integer', 'undefined'],
          correct: 2,
          explanation: 'JavaScript has number type but not specifically integer. All numbers in JavaScript are floating-point.'
        },
        {
          question: 'How do you write "Hello World" in an alert box?',
          options: ['alertBox("Hello World");', 'msg("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");'],
          correct: 2,
          explanation: 'The alert() function is used to display an alert dialog with a specified message.'
        },
        {
          question: 'What is the correct way to write a JavaScript array?',
          options: ['var colors = "red", "green", "blue"', 'var colors = (1:"red", 2:"green", 3:"blue")', 'var colors = ["red", "green", "blue"]', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")'],
          correct: 2,
          explanation: 'JavaScript arrays are written with square brackets and comma-separated values.'
        },
        {
          question: 'How do you create a function in JavaScript?',
          options: ['function = myFunction() {}', 'function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}'],
          correct: 1,
          explanation: 'Functions in JavaScript are declared using the function keyword followed by the function name and parentheses.'
        },
        {
          question: 'What is the correct way to write a JavaScript comment?',
          options: ['<!-- This is a comment -->', '// This is a comment', '/* This is a comment', "' This is a comment"],
          correct: 1,
          explanation: 'Single-line comments in JavaScript start with //. Multi-line comments use /* */'
        },
        {
          question: 'Which operator is used to assign a value to a variable?',
          options: ['*', '=', 'x', '-'],
          correct: 1,
          explanation: 'The = operator is used for assignment in JavaScript.'
        },
        {
          question: 'What will the following code return: Boolean(10 > 9)',
          options: ['true', 'false', 'NaN', 'undefined'],
          correct: 0,
          explanation: '10 > 9 evaluates to true, and Boolean(true) returns true.'
        },
        {
          question: 'How do you round the number 7.25 to the nearest integer?',
          options: ['Math.round(7.25)', 'Math.rnd(7.25)', 'round(7.25)', 'rnd(7.25)'],
          correct: 0,
          explanation: 'Math.round() rounds a number to the nearest integer.'
        },
        {
          question: 'Which method can be used to find the length of a string?',
          options: ['length()', 'size()', 'len()', 'length'],
          correct: 3,
          explanation: 'The length property returns the length of a string in JavaScript.'
        }
      ],
      intermediate: [
        {
          question: 'What is the output of: console.log(typeof null);',
          options: ['null', 'undefined', 'object', 'boolean'],
          correct: 2,
          explanation: 'In JavaScript, typeof null returns "object" due to a historical bug that has been kept for backward compatibility.'
        },
        {
          question: 'What is closure in JavaScript?',
          options: [
            'A way to close the browser',
            'A function that has access to variables in its outer scope',
            'A method to end a loop',
            'A way to close a file'
          ],
          correct: 1,
          explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.'
        },
        {
          question: 'What is the difference between == and === in JavaScript?',
          options: [
            'No difference',
            '== checks type and value, === checks only value',
            '=== checks type and value, == checks only value',
            '=== checks type and value, == performs type coercion'
          ],
          correct: 3,
          explanation: '=== is strict equality that checks both type and value, while == performs type coercion before comparison.'
        },
        {
          question: 'What is hoisting in JavaScript?',
          options: [
            'Moving variables to the top of their scope during compilation',
            'Lifting heavy objects',
            'A way to optimize code',
            'A method to sort arrays'
          ],
          correct: 0,
          explanation: 'Hoisting is JavaScript\'s behavior of moving variable and function declarations to the top of their scope during compilation.'
        },
        {
          question: 'What will this code output: console.log(1 + "2" + "2");',
          options: ['5', '122', '14', 'NaN'],
          correct: 1,
          explanation: 'JavaScript performs string concatenation from left to right. 1 + "2" becomes "12", then "12" + "2" becomes "122".'
        },
        {
          question: 'What is the purpose of the "use strict" directive?',
          options: [
            'To make JavaScript run faster',
            'To enable strict mode for better error checking',
            'To import libraries',
            'To define constants'
          ],
          correct: 1,
          explanation: '"use strict" enables strict mode, which catches common coding mistakes and prevents certain actions.'
        },
        {
          question: 'What is the difference between let, const, and var?',
          options: [
            'No difference',
            'let and const have block scope, var has function scope',
            'var and const have block scope, let has function scope',
            'All have the same scope'
          ],
          correct: 1,
          explanation: 'let and const have block scope and are not hoisted, while var has function scope and is hoisted.'
        },
        {
          question: 'What is a Promise in JavaScript?',
          options: [
            'A guarantee that code will work',
            'An object representing eventual completion of an async operation',
            'A type of loop',
            'A way to declare variables'
          ],
          correct: 1,
          explanation: 'A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation.'
        },
        {
          question: 'What does the spread operator (...) do?',
          options: [
            'Spreads butter on bread',
            'Expands an iterable into individual elements',
            'Creates a new variable',
            'Deletes array elements'
          ],
          correct: 1,
          explanation: 'The spread operator (...) expands an iterable (like an array) into individual elements.'
        },
        {
          question: 'What is destructuring in JavaScript?',
          options: [
            'Breaking code',
            'A way to extract values from arrays or objects',
            'Deleting variables',
            'A type of loop'
          ],
          correct: 1,
          explanation: 'Destructuring is a syntax that allows you to extract values from arrays or properties from objects into distinct variables.'
        }
      ],
      advanced: [
        {
          question: 'What is the Event Loop in JavaScript?',
          options: [
            'A loop that handles events',
            'The mechanism that handles asynchronous callbacks',
            'A way to create loops',
            'A method to bind events'
          ],
          correct: 1,
          explanation: 'The Event Loop is the mechanism that handles the execution of asynchronous callbacks in JavaScript\'s single-threaded environment.'
        },
        {
          question: 'What is the difference between call(), apply(), and bind()?',
          options: [
            'No difference',
            'call() and apply() invoke immediately, bind() returns a new function',
            'bind() and apply() invoke immediately, call() returns a new function',
            'All return new functions'
          ],
          correct: 1,
          explanation: 'call() and apply() invoke the function immediately with a specified this context, while bind() returns a new function with the this context bound.'
        },
        {
          question: 'What is a WeakMap in JavaScript?',
          options: [
            'A map with weak references to keys',
            'A map that is not strong',
            'A broken map',
            'A map with limited functionality'
          ],
          correct: 0,
          explanation: 'WeakMap is a collection where keys are weakly referenced, allowing for garbage collection when there are no other references to the key.'
        },
        {
          question: 'What is the purpose of Symbol in JavaScript?',
          options: [
            'To create mathematical symbols',
            'To create unique identifiers',
            'To create icons',
            'To create variables'
          ],
          correct: 1,
          explanation: 'Symbol is a primitive data type that creates unique identifiers, often used as object property keys.'
        },
        {
          question: 'What is a Proxy in JavaScript?',
          options: [
            'A server proxy',
            'An object that intercepts operations on another object',
            'A network proxy',
            'A type of function'
          ],
          correct: 1,
          explanation: 'A Proxy allows you to intercept and customize operations performed on objects (property lookup, assignment, enumeration, etc.).'
        },
        {
          question: 'What is the difference between microtasks and macrotasks?',
          options: [
            'Size difference',
            'Microtasks have higher priority in the event loop',
            'No difference',
            'Macrotasks run first'
          ],
          correct: 1,
          explanation: 'Microtasks (like Promise callbacks) have higher priority and are executed before macrotasks (like setTimeout) in the event loop.'
        },
        {
          question: 'What is a Generator function in JavaScript?',
          options: [
            'A function that generates random numbers',
            'A function that can be paused and resumed',
            'A function that creates other functions',
            'A function that generates HTML'
          ],
          correct: 1,
          explanation: 'Generator functions can be paused and resumed, yielding multiple values over time using the yield keyword.'
        },
        {
          question: 'What is the purpose of Object.freeze()?',
          options: [
            'To cool down objects',
            'To make an object immutable',
            'To stop object execution',
            'To serialize objects'
          ],
          correct: 1,
          explanation: 'Object.freeze() makes an object immutable - you cannot add, delete, or modify its properties.'
        },
        {
          question: 'What is a Service Worker?',
          options: [
            'A worker in a service industry',
            'A script that runs in the background for PWAs',
            'A type of web worker',
            'A server-side script'
          ],
          correct: 1,
          explanation: 'Service Workers are scripts that run in the background, enabling features like offline functionality and push notifications in Progressive Web Apps.'
        },
        {
          question: 'What is the difference between shallow and deep copying?',
          options: [
            'Depth of water',
            'Shallow copies only the first level, deep copies all nested levels',
            'No difference',
            'Deep copies are slower'
          ],
          correct: 1,
          explanation: 'Shallow copying copies only the first level of an object, while deep copying recursively copies all nested objects and arrays.'
        }
      ]
    },
    'Python': {
      beginner: [
        {
          question: 'What is the correct way to create a variable in Python?',
          options: ['var x = 5', 'x = 5', 'int x = 5', 'variable x = 5'],
          correct: 1,
          explanation: 'In Python, variables are created by simply assigning a value using the = operator.'
        },
        {
          question: 'Which of the following is the correct way to create a list in Python?',
          options: ['list = {1, 2, 3}', 'list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = <1, 2, 3>'],
          correct: 2,
          explanation: 'Lists in Python are created using square brackets [].'
        },
        {
          question: 'What is the output of print(type(5.0))?',
          options: ['<class \'int\'>', '<class \'float\'>', '<class \'number\'>', '<class \'decimal\'>'],
          correct: 1,
          explanation: '5.0 is a floating-point number, so its type is float.'
        },
        {
          question: 'How do you create a comment in Python?',
          options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
          correct: 2,
          explanation: 'Comments in Python start with the # symbol.'
        },
        {
          question: 'What is the correct way to create a function in Python?',
          options: ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'],
          correct: 1,
          explanation: 'Functions in Python are defined using the def keyword.'
        },
        {
          question: 'Which method is used to add an item to the end of a list?',
          options: ['add()', 'append()', 'insert()', 'push()'],
          correct: 1,
          explanation: 'The append() method adds an item to the end of a list in Python.'
        },
        {
          question: 'What is the correct way to check if a key exists in a dictionary?',
          options: ['key in dict', 'dict.hasKey(key)', 'dict.contains(key)', 'key.exists(dict)'],
          correct: 0,
          explanation: 'The "in" operator is used to check if a key exists in a dictionary.'
        },
        {
          question: 'What is the output of len("Hello")?',
          options: ['4', '5', '6', 'Error'],
          correct: 1,
          explanation: 'The len() function returns the length of a string. "Hello" has 5 characters.'
        },
        {
          question: 'Which of the following is used to get user input in Python?',
          options: ['input()', 'get()', 'read()', 'scan()'],
          correct: 0,
          explanation: 'The input() function is used to get user input in Python.'
        },
        {
          question: 'What is the correct way to import a module in Python?',
          options: ['include math', 'import math', 'using math', 'require math'],
          correct: 1,
          explanation: 'The import keyword is used to import modules in Python.'
        }
      ],
      intermediate: [
        {
          question: 'What is a list comprehension in Python?',
          options: [
            'A way to understand lists',
            'A concise way to create lists',
            'A method to compress lists',
            'A way to read lists'
          ],
          correct: 1,
          explanation: 'List comprehensions provide a concise way to create lists based on existing lists or other iterables.'
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
          explanation: 'Lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation).'
        },
        {
          question: 'What is a decorator in Python?',
          options: [
            'A way to decorate code',
            'A function that modifies another function',
            'A design pattern',
            'A type of loop'
          ],
          correct: 1,
          explanation: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it.'
        },
        {
          question: 'What is the purpose of the __init__ method?',
          options: [
            'To initialize objects',
            'To start the program',
            'To import modules',
            'To create functions'
          ],
          correct: 0,
          explanation: 'The __init__ method is a constructor that initializes newly created objects.'
        },
        {
          question: 'What is the difference between == and is in Python?',
          options: [
            'No difference',
            '== compares values, is compares identity',
            'is compares values, == compares identity',
            'Both compare identity'
          ],
          correct: 1,
          explanation: '== compares values for equality, while is compares object identity (whether they are the same object in memory).'
        },
        {
          question: 'What is a lambda function in Python?',
          options: [
            'A Greek letter function',
            'An anonymous function',
            'A named function',
            'A class method'
          ],
          correct: 1,
          explanation: 'Lambda functions are anonymous functions that can have any number of arguments but can only have one expression.'
        },
        {
          question: 'What is the purpose of *args and **kwargs?',
          options: [
            'To create variables',
            'To handle variable number of arguments',
            'To import modules',
            'To create classes'
          ],
          correct: 1,
          explanation: '*args allows a function to accept any number of positional arguments, **kwargs allows any number of keyword arguments.'
        },
        {
          question: 'What is a generator in Python?',
          options: [
            'A function that generates random numbers',
            'A function that yields values one at a time',
            'A class that creates objects',
            'A module that generates code'
          ],
          correct: 1,
          explanation: 'Generators are functions that yield values one at a time, allowing for memory-efficient iteration over large datasets.'
        },
        {
          question: 'What is the purpose of the with statement?',
          options: [
            'To create loops',
            'To handle context management',
            'To define functions',
            'To import modules'
          ],
          correct: 1,
          explanation: 'The with statement is used for context management, ensuring proper resource cleanup (like closing files).'
        },
        {
          question: 'What is multiple inheritance in Python?',
          options: [
            'Inheriting multiple times',
            'A class inheriting from multiple parent classes',
            'Creating multiple classes',
            'Having multiple methods'
          ],
          correct: 1,
          explanation: 'Multiple inheritance allows a class to inherit attributes and methods from multiple parent classes.'
        }
      ],
      advanced: [
        {
          question: 'What is the Global Interpreter Lock (GIL) in Python?',
          options: [
            'A global variable lock',
            'A mechanism that prevents multiple threads from executing Python code simultaneously',
            'A way to lock files',
            'A security feature'
          ],
          correct: 1,
          explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously.'
        },
        {
          question: 'What is metaclass in Python?',
          options: [
            'A class above other classes',
            'A class whose instances are classes',
            'A meta description of a class',
            'A class with metadata'
          ],
          correct: 1,
          explanation: 'A metaclass is a class whose instances are classes. It defines how classes are constructed.'
        },
        {
          question: 'What is the difference between deepcopy and shallow copy?',
          options: [
            'Depth of copying',
            'Shallow copy copies references, deep copy copies objects recursively',
            'No difference',
            'Deep copy is faster'
          ],
          correct: 1,
          explanation: 'Shallow copy creates a new object but references to nested objects are shared. Deep copy creates new objects recursively.'
        },
        {
          question: 'What is a descriptor in Python?',
          options: [
            'A way to describe objects',
            'An object that defines how attribute access is handled',
            'A documentation string',
            'A type of decorator'
          ],
          correct: 1,
          explanation: 'Descriptors are objects that define how attribute access is handled through __get__, __set__, and __delete__ methods.'
        },
        {
          question: 'What is the purpose of __slots__ in Python?',
          options: [
            'To create time slots',
            'To restrict attributes and save memory',
            'To create slots in objects',
            'To define methods'
          ],
          correct: 1,
          explanation: '__slots__ restricts the attributes that can be added to an instance and can save memory by avoiding the __dict__.'
        },
        {
          question: 'What is monkey patching in Python?',
          options: [
            'Patching code with monkeys',
            'Dynamically modifying classes or modules at runtime',
            'A debugging technique',
            'A testing method'
          ],
          correct: 1,
          explanation: 'Monkey patching is the practice of dynamically modifying classes or modules at runtime.'
        },
        {
          question: 'What is the difference between @staticmethod and @classmethod?',
          options: [
            'No difference',
            '@staticmethod doesn\'t receive any automatic arguments, @classmethod receives the class',
            '@classmethod is static, @staticmethod is not',
            'Both receive the same arguments'
          ],
          correct: 1,
          explanation: '@staticmethod doesn\'t receive any automatic first argument, while @classmethod receives the class as the first argument.'
        },
        {
          question: 'What is asyncio in Python?',
          options: [
            'Asynchronous I/O library',
            'A way to sync files',
            'A type of loop',
            'A debugging tool'
          ],
          correct: 0,
          explanation: 'asyncio is a library for writing concurrent code using async/await syntax for asynchronous programming.'
        },
        {
          question: 'What is the purpose of the __new__ method?',
          options: [
            'To create new variables',
            'To control object creation before __init__',
            'To update objects',
            'To delete objects'
          ],
          correct: 1,
          explanation: '__new__ is responsible for creating and returning a new instance of a class, called before __init__.'
        },
        {
          question: 'What is a context manager in Python?',
          options: [
            'A manager of contexts',
            'An object that defines runtime context for executing a block of code',
            'A way to manage variables',
            'A type of decorator'
          ],
          correct: 1,
          explanation: 'Context managers define runtime context for executing a block of code, typically used with the "with" statement.'
        }
      ]
    },
    'React': {
      beginner: [
        {
          question: 'What is React?',
          options: [
            'A JavaScript library for building user interfaces',
            'A database',
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
            'JavaScript XML - a syntax extension for JavaScript',
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
            'def MyComponent() { return <div>Hello</div>; }'
          ],
          correct: 0,
          explanation: 'React components are created as JavaScript functions that return JSX elements.'
        },
        {
          question: 'What is the correct way to render a React component?',
          options: [
            'React.render(<MyComponent />)',
            'ReactDOM.render(<MyComponent />)',
            'render(<MyComponent />)',
            'display(<MyComponent />)'
          ],
          correct: 1,
          explanation: 'ReactDOM.render() is used to render React components to the DOM (in React 17 and earlier).'
        },
        {
          question: 'How do you pass data to a React component?',
          options: [
            'Through state',
            'Through props',
            'Through variables',
            'Through functions'
          ],
          correct: 1,
          explanation: 'Props (properties) are used to pass data from parent components to child components.'
        },
        {
          question: 'What is the correct way to handle events in React?',
          options: [
            'onclick="handleClick()"',
            'onClick={handleClick}',
            'onPress={handleClick}',
            'click={handleClick}'
          ],
          correct: 1,
          explanation: 'React uses camelCase event handlers like onClick, and functions are passed within curly braces.'
        },
        {
          question: 'What is state in React?',
          options: [
            'The current condition of the component',
            'Data that can change over time',
            'A way to style components',
            'A type of prop'
          ],
          correct: 1,
          explanation: 'State is data that can change over time and affects what the component renders.'
        },
        {
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1,
          explanation: 'useState is the primary hook for managing state in functional React components.'
        },
        {
          question: 'What is the virtual DOM?',
          options: [
            'A virtual reality DOM',
            'A JavaScript representation of the real DOM',
            'A new type of HTML',
            'A CSS framework'
          ],
          correct: 1,
          explanation: 'The virtual DOM is a JavaScript representation of the real DOM that React uses for efficient updates.'
        },
        {
          question: 'How do you conditionally render elements in React?',
          options: [
            'Using if-else statements in JSX',
            'Using ternary operators or logical AND',
            'Using switch statements',
            'Using for loops'
          ],
          correct: 1,
          explanation: 'Conditional rendering in React is typically done using ternary operators (condition ? true : false) or logical AND (condition && element).'
        }
      ],
      intermediate: [
        {
          question: 'What is the purpose of useEffect hook?',
          options: [
            'To manage component state',
            'To handle side effects and lifecycle events',
            'To create context',
            'To optimize performance'
          ],
          correct: 1,
          explanation: 'useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM.'
        },
        {
          question: 'What is the difference between controlled and uncontrolled components?',
          options: [
            'Controlled components are faster',
            'Controlled components have their state managed by React, uncontrolled by DOM',
            'No difference',
            'Uncontrolled components are better'
          ],
          correct: 1,
          explanation: 'Controlled components have their form data handled by React state, while uncontrolled components store form data in the DOM.'
        },
        {
          question: 'What is React Context?',
          options: [
            'A way to pass data through component tree without props drilling',
            'A type of component',
            'A styling method',
            'A routing library'
          ],
          correct: 0,
          explanation: 'React Context provides a way to pass data through the component tree without having to pass props down manually at every level.'
        },
        {
          question: 'What is the purpose of keys in React lists?',
          options: [
            'To unlock components',
            'To help React identify which items have changed',
            'To style list items',
            'To sort the list'
          ],
          correct: 1,
          explanation: 'Keys help React identify which items have changed, are added, or are removed, enabling efficient re-rendering.'
        },
        {
          question: 'What is prop drilling?',
          options: [
            'Drilling holes in props',
            'Passing props through multiple component levels',
            'A debugging technique',
            'A performance optimization'
          ],
          correct: 1,
          explanation: 'Prop drilling is the process of passing props through multiple levels of components to reach a deeply nested component.'
        },
        {
          question: 'What is the difference between useState and useReducer?',
          options: [
            'No difference',
            'useReducer is for complex state logic, useState for simple state',
            'useState is deprecated',
            'useReducer is faster'
          ],
          correct: 1,
          explanation: 'useReducer is preferable for complex state logic with multiple sub-values or when the next state depends on the previous one.'
        },
        {
          question: 'What is React.memo()?',
          options: [
            'A memory management tool',
            'A higher-order component for performance optimization',
            'A way to memorize components',
            'A debugging tool'
          ],
          correct: 1,
          explanation: 'React.memo() is a higher-order component that memoizes the result and skips re-rendering if props haven\'t changed.'
        },
        {
          question: 'What is the purpose of useCallback hook?',
          options: [
            'To call functions back',
            'To memoize functions to prevent unnecessary re-renders',
            'To create callbacks',
            'To handle events'
          ],
          correct: 1,
          explanation: 'useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed.'
        },
        {
          question: 'What is the difference between useEffect and useLayoutEffect?',
          options: [
            'No difference',
            'useLayoutEffect runs synchronously after DOM mutations',
            'useEffect is deprecated',
            'useLayoutEffect is for styling'
          ],
          correct: 1,
          explanation: 'useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, while useEffect runs asynchronously.'
        },
        {
          question: 'What is a custom hook in React?',
          options: [
            'A hook you buy',
            'A JavaScript function that uses other hooks',
            'A built-in React hook',
            'A styling technique'
          ],
          correct: 1,
          explanation: 'Custom hooks are JavaScript functions whose names start with "use" and that may call other hooks.'
        }
      ],
      advanced: [
        {
          question: 'What is React Fiber?',
          options: [
            'A type of internet connection',
            'React\'s reconciliation algorithm for better performance',
            'A CSS framework',
            'A testing library'
          ],
          correct: 1,
          explanation: 'React Fiber is the new reconciliation algorithm that enables incremental rendering and better performance.'
        },
        {
          question: 'What is the purpose of React.Suspense?',
          options: [
            'To create suspenseful UIs',
            'To handle loading states for lazy-loaded components',
            'To suspend animations',
            'To pause execution'
          ],
          correct: 1,
          explanation: 'React.Suspense allows you to handle loading states for components that are lazy-loaded or fetching data.'
        },
        {
          question: 'What is server-side rendering (SSR) in React?',
          options: [
            'Rendering on the server before sending to client',
            'Rendering only on the server',
            'A type of client rendering',
            'A debugging technique'
          ],
          correct: 0,
          explanation: 'SSR renders React components on the server and sends the HTML to the client, improving initial load time and SEO.'
        },
        {
          question: 'What is the difference between React.createElement and JSX?',
          options: [
            'No difference',
            'JSX is syntactic sugar for React.createElement',
            'createElement is deprecated',
            'JSX is faster'
          ],
          correct: 1,
          explanation: 'JSX is syntactic sugar that gets transpiled to React.createElement calls.'
        },
        {
          question: 'What is a render prop in React?',
          options: [
            'A prop that renders',
            'A technique for sharing code using a prop whose value is a function',
            'A styling prop',
            'A performance optimization'
          ],
          correct: 1,
          explanation: 'Render props is a technique for sharing code between components using a prop whose value is a function.'
        },
        {
          question: 'What is React.StrictMode?',
          options: [
            'A strict coding mode',
            'A tool for highlighting potential problems in an application',
            'A performance mode',
            'A debugging mode'
          ],
          correct: 1,
          explanation: 'StrictMode is a tool for highlighting potential problems in an application by running additional checks and warnings.'
        },
        {
          question: 'What is the purpose of React.forwardRef?',
          options: [
            'To forward emails',
            'To forward refs through components',
            'To forward props',
            'To forward state'
          ],
          correct: 1,
          explanation: 'forwardRef allows a component to expose a DOM node to its parent component through a ref.'
        },
        {
          question: 'What is concurrent rendering in React?',
          options: [
            'Rendering multiple components at once',
            'A feature that allows React to interrupt rendering work',
            'Rendering in parallel threads',
            'A performance optimization'
          ],
          correct: 1,
          explanation: 'Concurrent rendering allows React to interrupt rendering work to handle high-priority updates, improving user experience.'
        },
        {
          question: 'What is the difference between React.Component and React.PureComponent?',
          options: [
            'No difference',
            'PureComponent implements shouldComponentUpdate with shallow comparison',
            'Component is deprecated',
            'PureComponent is faster'
          ],
          correct: 1,
          explanation: 'PureComponent automatically implements shouldComponentUpdate with a shallow prop and state comparison.'
        },
        {
          question: 'What is React.Portal?',
          options: [
            'A portal to another dimension',
            'A way to render children into a DOM node outside the parent hierarchy',
            'A routing mechanism',
            'A state management tool'
          ],
          correct: 1,
          explanation: 'Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.'
        }
      ]
    },
    'UI/UX': {
      beginner: [
        {
          question: 'What does UI stand for?',
          options: ['User Interface', 'Universal Interface', 'Unique Interface', 'User Integration'],
          correct: 0,
          explanation: 'UI stands for User Interface, which refers to the visual elements that users interact with in a digital product.'
        },
        {
          question: 'What does UX stand for?',
          options: ['User Experience', 'User Extension', 'Universal Experience', 'User Execution'],
          correct: 0,
          explanation: 'UX stands for User Experience, which encompasses all aspects of the end-user\'s interaction with a product or service.'
        },
        {
          question: 'What is the primary goal of UX design?',
          options: [
            'To make things look beautiful',
            'To create meaningful and relevant experiences for users',
            'To use the latest technology',
            'To reduce development costs'
          ],
          correct: 1,
          explanation: 'The primary goal of UX design is to create meaningful and relevant experiences for users by improving usability and accessibility.'
        },
        {
          question: 'What is a wireframe?',
          options: [
            'A type of wire',
            'A low-fidelity structural blueprint of a webpage or app',
            'A high-fidelity design',
            'A coding framework'
          ],
          correct: 1,
          explanation: 'A wireframe is a low-fidelity structural blueprint that shows the basic layout and functionality of a webpage or app.'
        },
        {
          question: 'What is the difference between UI and UX?',
          options: [
            'UI is about looks, UX is about feel and functionality',
            'UI and UX are the same thing',
            'UI is for mobile, UX is for web',
            'UI is newer than UX'
          ],
          correct: 0,
          explanation: 'UI focuses on the visual interface and how things look, while UX focuses on the overall experience and how things work.'
        },
        {
          question: 'What is a prototype in UX design?',
          options: [
            'The final product',
            'An early model or sample of a product used to test concepts',
            'A type of user',
            'A design tool'
          ],
          correct: 1,
          explanation: 'A prototype is an early model or sample of a product built to test concepts, functionality, and user interactions.'
        },
        {
          question: 'What is user research?',
          options: [
            'Research done by users',
            'The process of understanding user behaviors, needs, and motivations',
            'A type of market research',
            'Research about user interfaces'
          ],
          correct: 1,
          explanation: 'User research is the systematic investigation of users and their requirements to add context and insight to the design process.'
        },
        {
          question: 'What is a persona in UX design?',
          options: [
            'A real user',
            'A fictional character representing a user segment',
            'A design pattern',
            'A type of interface'
          ],
          correct: 1,
          explanation: 'A persona is a fictional character created to represent a user type that might use a site, brand, or product in a similar way.'
        },
        {
          question: 'What is usability testing?',
          options: [
            'Testing if something is useful',
            'Evaluating a product by testing it with representative users',
            'Testing the code',
            'Testing the design aesthetics'
          ],
          correct: 1,
          explanation: 'Usability testing involves evaluating a product or service by testing it with representative users to identify usability problems.'
        },
        {
          question: 'What is the purpose of a style guide?',
          options: [
            'To guide users',
            'To ensure consistency in design elements across a product',
            'To style hair',
            'To guide developers'
          ],
          correct: 1,
          explanation: 'A style guide ensures consistency in design elements like colors, typography, and components across a product or brand.'
        }
      ],
      intermediate: [
        {
          question: 'What is information architecture in UX?',
          options: [
            'The structural design of shared information environments',
            'Building architecture for information',
            'A type of database design',
            'Computer architecture'
          ],
          correct: 0,
          explanation: 'Information architecture is the structural design of shared information environments, organizing and labeling content effectively.'
        },
        {
          question: 'What is the principle of affordances in design?',
          options: [
            'What users can afford to buy',
            'The perceived and actual properties that determine how things could be used',
            'Design budget constraints',
            'Accessibility features'
          ],
          correct: 1,
          explanation: 'Affordances are the perceived and actual properties of an object that determine how it could possibly be used.'
        },
        {
          question: 'What is A/B testing in UX?',
          options: [
            'Testing two different versions to see which performs better',
            'Testing alphabetically',
            'Testing with two users',
            'Testing twice'
          ],
          correct: 0,
          explanation: 'A/B testing compares two versions of a webpage or app to determine which one performs better for a given conversion goal.'
        },
        {
          question: 'What is the 5-second test in UX?',
          options: [
            'A test that takes 5 seconds',
            'A test to measure first impressions and immediate understanding',
            'Testing 5 users',
            'A speed test'
          ],
          correct: 1,
          explanation: 'The 5-second test measures users\' first impressions by showing them a design for 5 seconds and asking what they remember.'
        },
        {
          question: 'What is card sorting in UX research?',
          options: [
            'Sorting playing cards',
            'A method to understand how users categorize information',
            'Organizing design cards',
            'A type of user interview'
          ],
          correct: 1,
          explanation: 'Card sorting is a UX research method where users organize topics into categories to help create intuitive navigation structures.'
        },
        {
          question: 'What is the principle of progressive disclosure?',
          options: [
            'Gradually revealing information to avoid overwhelming users',
            'Disclosing progress',
            'A legal principle',
            'A design trend'
          ],
          correct: 0,
          explanation: 'Progressive disclosure is a technique that presents only essential information first, revealing additional details as needed.'
        },
        {
          question: 'What is a heuristic evaluation?',
          options: [
            'A mathematical evaluation',
            'A usability inspection method using established principles',
            'A type of user test',
            'An automated evaluation'
          ],
          correct: 1,
          explanation: 'Heuristic evaluation is a usability inspection method where evaluators examine the interface using established usability principles.'
        },
        {
          question: 'What is the difference between quantitative and qualitative research in UX?',
          options: [
            'Quantitative uses numbers, qualitative uses observations and opinions',
            'No difference',
            'Quantitative is better',
            'Qualitative uses numbers'
          ],
          correct: 0,
          explanation: 'Quantitative research focuses on numerical data and statistics, while qualitative research focuses on observations, opinions, and behaviors.'
        },
        {
          question: 'What is a user journey map?',
          options: [
            'A map of user locations',
            'A visualization of the user\'s experience across all touchpoints',
            'A navigation map',
            'A site map'
          ],
          correct: 1,
          explanation: 'A user journey map visualizes the process that a user goes through to accomplish a goal with your product or service.'
        },
        {
          question: 'What is the principle of Fitts\' Law in UI design?',
          options: [
            'A fitness principle',
            'The time to reach a target depends on distance and size',
            'A legal principle',
            'A color theory'
          ],
          correct: 1,
          explanation: 'Fitts\' Law states that the time required to move to a target area is a function of the distance to the target and the size of the target.'
        }
      ],
      advanced: [
        {
          question: 'What is design systems and why are they important?',
          options: [
            'A collection of reusable components and guidelines for consistent design',
            'A computer system for design',
            'A design methodology',
            'A type of software'
          ],
          correct: 0,
          explanation: 'Design systems are collections of reusable components, guided by clear standards, that can be assembled to build applications consistently and efficiently.'
        },
        {
          question: 'What is the concept of cognitive load in UX?',
          options: [
            'The weight of thoughts',
            'The amount of mental effort required to use an interface',
            'Loading time for cognition',
            'A psychological disorder'
          ],
          correct: 1,
          explanation: 'Cognitive load refers to the amount of mental effort being used in working memory during interface interactions.'
        },
        {
          question: 'What is inclusive design?',
          options: [
            'Including everyone in design meetings',
            'Design that considers the full range of human diversity',
            'A design that includes everything',
            'Expensive design'
          ],
          correct: 1,
          explanation: 'Inclusive design is a methodology that considers the full range of human diversity with respect to ability, language, culture, gender, age, and other forms of human difference.'
        },
        {
          question: 'What is the difference between accessibility and usability?',
          options: [
            'Accessibility focuses on users with disabilities, usability on all users',
            'No difference',
            'Accessibility is about access, usability is about use',
            'Both A and C'
          ],
          correct: 3,
          explanation: 'Accessibility ensures products are usable by people with disabilities, while usability focuses on how easy and pleasant products are to use for all users.'
        },
        {
          question: 'What is service design?',
          options: [
            'Designing services',
            'The activity of planning and organizing people, infrastructure, and materials to improve service quality',
            'A type of web design',
            'Customer service design'
          ],
          correct: 1,
          explanation: 'Service design is the activity of planning and organizing people, infrastructure, communication, and material components of a service to improve its quality and interaction.'
        },
        {
          question: 'What is the concept of emotional design?',
          options: [
            'Design that makes you emotional',
            'Design that considers the emotional impact on users',
            'Design for emotions',
            'Emotional intelligence in design'
          ],
          correct: 1,
          explanation: 'Emotional design focuses on creating products that evoke positive emotions and create meaningful connections with users.'
        },
        {
          question: 'What is design thinking methodology?',
          options: [
            'Thinking about design',
            'A human-centered approach to innovation and problem-solving',
            'A design philosophy',
            'A way to think creatively'
          ],
          correct: 1,
          explanation: 'Design thinking is a human-centered approach to innovation that integrates the needs of people, possibilities of technology, and requirements for business success.'
        },
        {
          question: 'What is the concept of dark patterns in UX?',
          options: [
            'Dark colored designs',
            'User interfaces designed to trick users into unintended actions',
            'Patterns used in dark mode',
            'Hidden design patterns'
          ],
          correct: 1,
          explanation: 'Dark patterns are user interfaces that are crafted to trick users into doing things they might not want to do, like buying insurance or signing up for recurring bills.'
        },
        {
          question: 'What is behavioral economics in UX design?',
          options: [
            'Economics of behavior',
            'Applying psychological insights about human behavior to design decisions',
            'Economic behavior patterns',
            'Behavioral analysis of economics'
          ],
          correct: 1,
          explanation: 'Behavioral economics in UX involves applying psychological insights about how people actually behave (vs. how they should behave) to design better user experiences.'
        },
        {
          question: 'What is the concept of microinteractions?',
          options: [
            'Very small interactions',
            'Contained product moments that revolve around a single use case',
            'Interactions with microorganisms',
            'Quick interactions'
          ],
          correct: 1,
          explanation: 'Microinteractions are contained product moments that revolve around a single use case—they have one main task and provide feedback to users.'
        }
      ]
    },
    'Machine Learning': {
      beginner: [
        {
          question: 'What is Machine Learning?',
          options: [
            'A type of computer hardware',
            'A method of data analysis that automates analytical model building',
            'A programming language',
            'A database system'
          ],
          correct: 1,
          explanation: 'Machine Learning is a method of data analysis that automates analytical model building, allowing computers to learn without being explicitly programmed.'
        },
        {
          question: 'What are the three main types of machine learning?',
          options: [
            'Supervised, Unsupervised, Reinforcement',
            'Linear, Non-linear, Circular',
            'Fast, Medium, Slow',
            'Simple, Complex, Advanced'
          ],
          correct: 0,
          explanation: 'The three main types of machine learning are Supervised Learning, Unsupervised Learning, and Reinforcement Learning.'
        },
        {
          question: 'What is supervised learning?',
          options: [
            'Learning with a supervisor present',
            'Learning from labeled training data',
            'Learning without any data',
            'Learning from unlabeled data'
          ],
          correct: 1,
          explanation: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs.'
        },
        {
          question: 'What is a dataset in machine learning?',
          options: [
            'A collection of data used for training models',
            'A type of algorithm',
            'A programming tool',
            'A computer component'
          ],
          correct: 0,
          explanation: 'A dataset is a collection of data used to train, validate, and test machine learning models.'
        },
        {
          question: 'What is a feature in machine learning?',
          options: [
            'A special characteristic of an algorithm',
            'An individual measurable property of observed phenomena',
            'A type of model',
            'A programming function'
          ],
          correct: 1,
          explanation: 'A feature is an individual measurable property or characteristic of a phenomenon being observed.'
        },
        {
          question: 'What is training data?',
          options: [
            'Data used to train employees',
            'Data used to teach a machine learning algorithm',
            'Data about training programs',
            'Exercise data'
          ],
          correct: 1,
          explanation: 'Training data is the dataset used to teach a machine learning algorithm to make predictions or decisions.'
        },
        {
          question: 'What is the difference between classification and regression?',
          options: [
            'Classification predicts categories, regression predicts continuous values',
            'No difference',
            'Classification is easier',
            'Regression is newer'
          ],
          correct: 0,
          explanation: 'Classification predicts discrete categories or classes, while regression predicts continuous numerical values.'
        },
        {
          question: 'What is overfitting in machine learning?',
          options: [
            'When a model fits too well to training data and performs poorly on new data',
            'When a model is too big',
            'When training takes too long',
            'When there\'s too much data'
          ],
          correct: 0,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize to new data.'
        },
        {
          question: 'What is a neural network?',
          options: [
            'A network of neurons in the brain',
            'A computing system inspired by biological neural networks',
            'A type of internet connection',
            'A social network'
          ],
          correct: 1,
          explanation: 'A neural network is a computing system vaguely inspired by the biological neural networks that constitute animal brains.'
        },
        {
          question: 'What is the purpose of splitting data into training and testing sets?',
          options: [
            'To save storage space',
            'To evaluate model performance on unseen data',
            'To speed up training',
            'To organize data better'
          ],
          correct: 1,
          explanation: 'Data is split to train the model on one set and evaluate its performance on unseen data to assess generalization ability.'
        }
      ],
      intermediate: [
        {
          question: 'What is cross-validation?',
          options: [
            'Validating data twice',
            'A technique to assess model performance by training on multiple data subsets',
            'A type of neural network',
            'A data preprocessing step'
          ],
          correct: 1,
          explanation: 'Cross-validation is a technique to assess how well a model will generalize by training and testing on different subsets of data.'
        },
        {
          question: 'What is feature engineering?',
          options: [
            'Engineering features into products',
            'The process of selecting and transforming variables for machine learning models',
            'A type of software engineering',
            'Building engineering features'
          ],
          correct: 1,
          explanation: 'Feature engineering is the process of using domain knowledge to select, modify, or create features that make machine learning algorithms work better.'
        },
        {
          question: 'What is regularization in machine learning?',
          options: [
            'Making models regular',
            'A technique to prevent overfitting by adding a penalty term',
            'A data cleaning process',
            'A type of algorithm'
          ],
          correct: 1,
          explanation: 'Regularization is a technique used to prevent overfitting by adding a penalty term to the loss function.'
        },
        {
          question: 'What is the bias-variance tradeoff?',
          options: [
            'A tradeoff between model complexity and generalization',
            'A type of algorithm',
            'A data preprocessing technique',
            'A performance metric'
          ],
          correct: 0,
          explanation: 'The bias-variance tradeoff describes the relationship between model complexity, training error, and generalization error.'
        },
        {
          question: 'What is ensemble learning?',
          options: [
            'Learning in groups',
            'Combining multiple models to improve performance',
            'A type of neural network',
            'A data collection method'
          ],
          correct: 1,
          explanation: 'Ensemble learning combines multiple machine learning models to create a stronger predictor than any individual model.'
        },
        {
          question: 'What is gradient descent?',
          options: [
            'Going downhill',
            'An optimization algorithm to minimize the cost function',
            'A type of neural network',
            'A data preprocessing technique'
          ],
          correct: 1,
          explanation: 'Gradient descent is an optimization algorithm used to minimize the cost function by iteratively moving toward the minimum.'
        },
        {
          question: 'What is the purpose of activation functions in neural networks?',
          options: [
            'To activate the network',
            'To introduce non-linearity and enable learning complex patterns',
            'To speed up training',
            'To reduce overfitting'
          ],
          correct: 1,
          explanation: 'Activation functions introduce non-linearity into neural networks, enabling them to learn complex patterns and relationships.'
        },
        {
          question: 'What is backpropagation?',
          options: [
            'Going backwards',
            'An algorithm for training neural networks by propagating errors backward',
            'A type of neural network',
            'A data preprocessing step'
          ],
          correct: 1,
          explanation: 'Backpropagation is an algorithm for training neural networks that calculates gradients by propagating errors backward through the network.'
        },
        {
          question: 'What is the difference between bagging and boosting?',
          options: [
            'Bagging trains models in parallel, boosting trains sequentially',
            'No difference',
            'Bagging is newer',
            'Boosting is faster'
          ],
          correct: 0,
          explanation: 'Bagging trains multiple models in parallel on different subsets of data, while boosting trains models sequentially, each learning from previous mistakes.'
        },
        {
          question: 'What is dimensionality reduction?',
          options: [
            'Reducing the size of data',
            'Reducing the number of features while preserving important information',
            'Making models smaller',
            'Reducing training time'
          ],
          correct: 1,
          explanation: 'Dimensionality reduction is the process of reducing the number of features in a dataset while preserving the most important information.'
        }
      ],
      advanced: [
        {
          question: 'What is transfer learning?',
          options: [
            'Transferring data between systems',
            'Using pre-trained models as starting points for new tasks',
            'A type of neural network',
            'A data transfer protocol'
          ],
          correct: 1,
          explanation: 'Transfer learning involves using a pre-trained model on a new, related task, leveraging knowledge gained from the original task.'
        },
        {
          question: 'What is the vanishing gradient problem?',
          options: [
            'When gradients disappear',
            'When gradients become too small in deep networks, hindering learning',
            'A type of overfitting',
            'A data preprocessing issue'
          ],
          correct: 1,
          explanation: 'The vanishing gradient problem occurs when gradients become exponentially small in deep networks, making it difficult to train early layers.'
        },
        {
          question: 'What is attention mechanism in deep learning?',
          options: [
            'Paying attention to training',
            'A technique that allows models to focus on relevant parts of input',
            'A type of neural network',
            'A regularization technique'
          ],
          correct: 1,
          explanation: 'Attention mechanisms allow models to dynamically focus on different parts of the input when making predictions.'
        },
        {
          question: 'What is the difference between generative and discriminative models?',
          options: [
            'Generative models create data, discriminative models classify data',
            'No difference',
            'Generative models are newer',
            'Discriminative models are faster'
          ],
          correct: 0,
          explanation: 'Generative models learn to generate new data similar to training data, while discriminative models learn to distinguish between different classes.'
        },
        {
          question: 'What is a Generative Adversarial Network (GAN)?',
          options: [
            'A network that generates adversaries',
            'Two neural networks competing against each other',
            'A type of discriminative model',
            'A data preprocessing technique'
          ],
          correct: 1,
          explanation: 'GANs consist of two neural networks (generator and discriminator) competing against each other to generate realistic data.'
        },
        {
          question: 'What is reinforcement learning?',
          options: [
            'Learning with reinforcement',
            'Learning through interaction with an environment using rewards and penalties',
            'A type of supervised learning',
            'A data preprocessing technique'
          ],
          correct: 1,
          explanation: 'Reinforcement learning is a type of machine learning where an agent learns to make decisions by interacting with an environment and receiving rewards or penalties.'
        },
        {
          question: 'What is the curse of dimensionality?',
          options: [
            'A curse on dimensions',
            'Problems that arise when working with high-dimensional data',
            'A type of overfitting',
            'A neural network architecture'
          ],
          correct: 1,
          explanation: 'The curse of dimensionality refers to various phenomena that arise when analyzing data in high-dimensional spaces, such as sparsity and distance concentration.'
        },
        {
          question: 'What is batch normalization?',
          options: [
            'Normalizing batches of data',
            'A technique to normalize inputs to each layer in a neural network',
            'A type of regularization',
            'A data preprocessing step'
          ],
          correct: 1,
          explanation: 'Batch normalization normalizes the inputs to each layer in a neural network, helping to stabilize and accelerate training.'
        },
        {
          question: 'What is the difference between online and batch learning?',
          options: [
            'Online learning updates continuously, batch learning updates periodically',
            'No difference',
            'Online learning is faster',
            'Batch learning is newer'
          ],
          correct: 0,
          explanation: 'Online learning updates the model continuously as new data arrives, while batch learning updates the model periodically using batches of data.'
        },
        {
          question: 'What is meta-learning?',
          options: [
            'Learning about learning',
            'Learning to learn new tasks quickly with minimal data',
            'A type of neural network',
            'A data preprocessing technique'
          ],
          correct: 1,
          explanation: 'Meta-learning, or "learning to learn," focuses on designing models that can quickly adapt to new tasks with minimal training data.'
        }
      ]
    }
  };

  private getDifficultyForLevel(level: number): 'beginner' | 'intermediate' | 'advanced' {
    if (level <= 1) return 'beginner';
    if (level <= 3) return 'intermediate';
    return 'advanced';
  }

  private getQuestionsForTopic(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): any[] {
    // Normalize topic name for lookup
    const normalizedTopic = Object.keys(this.questionDatabase).find(key => 
      key.toLowerCase() === topic.toLowerCase()
    ) || 'JavaScript'; // Default fallback

    const topicQuestions = this.questionDatabase[normalizedTopic];
    if (!topicQuestions || !topicQuestions[difficulty]) {
      // Fallback to JavaScript beginner questions if topic/difficulty not found
      return this.questionDatabase['JavaScript']['beginner'];
    }

    return topicQuestions[difficulty];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async generateQuestions(request: QuestionGenerationRequest): Promise<Question[]> {
    const { topic, level, questionCount, difficulty } = request;
    
    try {
      // Get questions for the specific topic and difficulty
      const availableQuestions = this.getQuestionsForTopic(topic, difficulty);
      
      // Shuffle questions to provide variety
      const shuffledQuestions = this.shuffleArray(availableQuestions);
      
      // Take the requested number of questions (up to 10)
      const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionCount, 10));
      
      // Convert to the expected format
      const formattedQuestions: Question[] = selectedQuestions.map((q, index) => ({
        id: `${topic.toLowerCase()}_${level}_${Date.now()}_${index}`,
        question_text: q.question,
        options: q.options,
        correct_answer: q.correct,
        explanation: q.explanation,
        difficulty,
        topic
      }));

      // If we need more questions than available, repeat some with slight variations
      while (formattedQuestions.length < questionCount && formattedQuestions.length < 10) {
        const additionalQuestions = shuffledQuestions.slice(0, questionCount - formattedQuestions.length);
        additionalQuestions.forEach((q, index) => {
          formattedQuestions.push({
            id: `${topic.toLowerCase()}_${level}_${Date.now()}_repeat_${index}`,
            question_text: q.question,
            options: q.options,
            correct_answer: q.correct,
            explanation: q.explanation,
            difficulty,
            topic
          });
        });
      }

      return formattedQuestions.slice(0, questionCount);
    } catch (error) {
      console.error('Error generating questions:', error);
      
      // Fallback to basic questions
      const fallbackQuestions = this.questionDatabase['JavaScript']['beginner'];
      return fallbackQuestions.slice(0, questionCount).map((q, index) => ({
        id: `fallback_${Date.now()}_${index}`,
        question_text: q.question,
        options: q.options,
        correct_answer: q.correct,
        explanation: q.explanation,
        difficulty: 'beginner' as const,
        topic: 'JavaScript'
      }));
    }
  }

  async generateQuestionsForTopic(topicName: string, level: number = 0): Promise<Question[]> {
    const difficulty = this.getDifficultyForLevel(level);
    
    return this.generateQuestions({
      topic: topicName,
      level,
      questionCount: 10, // Always generate 10 questions per level
      difficulty
    });
  }

  // Method to add new topics and questions (for future expansion)
  addTopicQuestions(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced', questions: any[]) {
    if (!this.questionDatabase[topic]) {
      this.questionDatabase[topic] = { beginner: [], intermediate: [], advanced: [] };
    }
    this.questionDatabase[topic][difficulty] = questions;
  }

  // Method to get available topics
  getAvailableTopics(): string[] {
    return Object.keys(this.questionDatabase);
  }

  // Method to get question count for a topic and difficulty
  getQuestionCount(topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): number {
    const normalizedTopic = Object.keys(this.questionDatabase).find(key => 
      key.toLowerCase() === topic.toLowerCase()
    );
    
    if (!normalizedTopic || !this.questionDatabase[normalizedTopic][difficulty]) {
      return 0;
    }
    
    return this.questionDatabase[normalizedTopic][difficulty].length;
  }
}

export const aiService = new AIService();
export type { Question, QuestionGenerationRequest };