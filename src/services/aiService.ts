import { supabase } from '../lib/supabase';

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
  private questionCache = new Map<string, Question[]>();

  getAvailableTopics(): string[] {
    return [
      'JavaScript',
      'Python', 
      'React',
      'TypeScript',
      'Node.js',
      'CSS',
      'HTML',
      'SQL',
      'Git',
      'API Design',
      'Data Structures',
      'Algorithms'
    ];
  }

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
    const allTemplates: Record<string, Record<number, any[]>> = {
      'JavaScript': {
        0: [ // Beginner Level
          {
            question: 'What is the correct way to declare a variable in JavaScript?',
            options: ['variable x = 5;', 'var x = 5;', 'declare x = 5;', 'x := 5;'],
            correct: 1,
            explanation: 'In JavaScript, variables are declared using var, let, or const keywords. "var x = 5;" is the traditional way.'
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
            explanation: 'The alert() function displays a dialog box with a message and an OK button.'
          },
          {
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'Hyper Text Making Language'],
            correct: 0,
            explanation: 'HTML stands for Hyper Text Markup Language, which is used to create web pages.'
          },
          {
            question: 'Which symbol is used for comments in JavaScript?',
            options: ['<!-- -->', '/* */', '//', 'Both /* */ and //'],
            correct: 3,
            explanation: 'JavaScript supports both single-line comments (//) and multi-line comments (/* */).'
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
            explanation: 'Functions in JavaScript are declared using the function keyword followed by the function name.'
          },
          {
            question: 'What is the correct way to write a conditional statement in JavaScript?',
            options: ['if i == 5 then', 'if (i == 5)', 'if i = 5', 'if i === 5 then'],
            correct: 1,
            explanation: 'JavaScript if statements require parentheses around the condition.'
          },
          {
            question: 'Which event occurs when the user clicks on an HTML element?',
            options: ['onchange', 'onclick', 'onmouseclick', 'onmouseover'],
            correct: 1,
            explanation: 'The onclick event occurs when a user clicks on an HTML element.'
          },
          {
            question: 'What is the correct way to write a for loop in JavaScript?',
            options: ['for (i = 0; i <= 5)', 'for (i = 0; i <= 5; i++)', 'for i = 1 to 5', 'for (i <= 5; i++)'],
            correct: 1,
            explanation: 'A for loop in JavaScript has three parts: initialization, condition, and increment/decrement.'
          }
        ],
        1: [ // Beginner-Intermediate
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
            question: 'What is the output of: console.log(typeof null);',
            options: ['null', 'undefined', 'object', 'boolean'],
            correct: 2,
            explanation: 'In JavaScript, typeof null returns "object" due to a historical bug that has been kept for backward compatibility.'
          },
          {
            question: 'Which method adds an element to the end of an array?',
            options: ['append()', 'push()', 'add()', 'insert()'],
            correct: 1,
            explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
          },
          {
            question: 'What is hoisting in JavaScript?',
            options: [
              'Moving variables to the top of the file',
              'Variable and function declarations are moved to the top of their scope',
              'A way to optimize code',
              'A method to handle errors'
            ],
            correct: 1,
            explanation: 'Hoisting is JavaScript\'s behavior of moving variable and function declarations to the top of their containing scope.'
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
          },
          {
            question: 'What is a closure in JavaScript?',
            options: [
              'A way to close a function',
              'A function that has access to variables in its outer scope',
              'A method to end a loop',
              'A type of error handling'
            ],
            correct: 1,
            explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.'
          },
          {
            question: 'What is the difference between let, var, and const?',
            options: [
              'No difference',
              'var is function-scoped, let and const are block-scoped',
              'let is global, var and const are local',
              'const is for constants only'
            ],
            correct: 1,
            explanation: 'var is function-scoped, while let and const are block-scoped. const also prevents reassignment.'
          },
          {
            question: 'What is event bubbling?',
            options: [
              'Events moving from child to parent elements',
              'Events moving from parent to child elements',
              'Events being cancelled',
              'Events being duplicated'
            ],
            correct: 0,
            explanation: 'Event bubbling is when an event starts from the target element and bubbles up to parent elements.'
          },
          {
            question: 'What is the purpose of the async/await keywords?',
            options: [
              'To make code run faster',
              'To handle asynchronous operations more easily',
              'To create loops',
              'To define variables'
            ],
            correct: 1,
            explanation: 'async/await provides a cleaner way to work with Promises and handle asynchronous operations.'
          },
          {
            question: 'What is destructuring in JavaScript?',
            options: [
              'Breaking code into smaller parts',
              'Extracting values from arrays or objects into variables',
              'Removing elements from arrays',
              'A way to handle errors'
            ],
            correct: 1,
            explanation: 'Destructuring allows you to extract values from arrays or properties from objects into distinct variables.'
          }
        ],
        2: [ // Intermediate
          {
            question: 'What is the difference between call(), apply(), and bind()?',
            options: [
              'They are identical methods',
              'call() and apply() invoke immediately, bind() returns a new function',
              'Only the syntax is different',
              'bind() is deprecated'
            ],
            correct: 1,
            explanation: 'call() and apply() invoke the function immediately with a specified this value, while bind() returns a new function with the this value bound.'
          },
          {
            question: 'What is a Promise in JavaScript?',
            options: [
              'A guarantee that code will work',
              'An object representing eventual completion of an asynchronous operation',
              'A type of loop',
              'A way to declare variables'
            ],
            correct: 1,
            explanation: 'A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.'
          },
          {
            question: 'What is the prototype chain?',
            options: [
              'A way to chain functions',
              'The mechanism by which objects inherit properties and methods',
              'A type of loop',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'The prototype chain is the mechanism by which JavaScript objects inherit features from one another.'
          },
          {
            question: 'What is the difference between map() and forEach()?',
            options: [
              'No difference',
              'map() returns a new array, forEach() returns undefined',
              'forEach() is faster',
              'map() only works with numbers'
            ],
            correct: 1,
            explanation: 'map() creates and returns a new array with the results of calling a function on every element, while forEach() executes a function for each element but returns undefined.'
          },
          {
            question: 'What is event delegation?',
            options: [
              'Assigning events to multiple elements',
              'Using a parent element to handle events for child elements',
              'Removing events from elements',
              'Creating custom events'
            ],
            correct: 1,
            explanation: 'Event delegation is a technique where you use a parent element to handle events for its child elements, taking advantage of event bubbling.'
          },
          {
            question: 'What is the difference between synchronous and asynchronous code?',
            options: [
              'Synchronous is faster',
              'Synchronous blocks execution, asynchronous doesn\'t',
              'No difference in JavaScript',
              'Asynchronous is always better'
            ],
            correct: 1,
            explanation: 'Synchronous code blocks the execution thread until it completes, while asynchronous code allows other code to run while waiting for operations to complete.'
          },
          {
            question: 'What is a generator function?',
            options: [
              'A function that creates other functions',
              'A function that can pause and resume execution',
              'A function that generates random numbers',
              'A deprecated feature'
            ],
            correct: 1,
            explanation: 'A generator function can pause and resume its execution, yielding multiple values over time using the yield keyword.'
          },
          {
            question: 'What is the purpose of the spread operator (...)?',
            options: [
              'To create comments',
              'To expand iterables or copy objects/arrays',
              'To create loops',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'The spread operator (...) allows an iterable to be expanded in places where multiple elements are expected, or to copy objects and arrays.'
          },
          {
            question: 'What is a WeakMap in JavaScript?',
            options: [
              'A Map with limited functionality',
              'A Map where keys must be objects and are weakly referenced',
              'A deprecated feature',
              'A Map that stores weak passwords'
            ],
            correct: 1,
            explanation: 'A WeakMap is a collection where keys must be objects and are held weakly, meaning they can be garbage collected if there are no other references to them.'
          },
          {
            question: 'What is the difference between shallow and deep copying?',
            options: [
              'No difference',
              'Shallow copy copies only the first level, deep copy copies all levels',
              'Deep copy is always faster',
              'Shallow copy is deprecated'
            ],
            correct: 1,
            explanation: 'Shallow copy creates a new object but inserts references to nested objects, while deep copy creates a completely independent copy of all nested objects.'
          }
        ],
        3: [ // Intermediate-Advanced
          {
            question: 'What is the difference between microtasks and macrotasks in the event loop?',
            options: [
              'No difference',
              'Microtasks have higher priority and execute before macrotasks',
              'Macrotasks are faster',
              'They are the same thing'
            ],
            correct: 1,
            explanation: 'Microtasks (like Promise callbacks) have higher priority and are executed before macrotasks (like setTimeout) in each iteration of the event loop.'
          },
          {
            question: 'What is a Proxy in JavaScript?',
            options: [
              'A network proxy',
              'An object that intercepts and customizes operations on another object',
              'A type of function',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'A Proxy allows you to intercept and customize operations performed on objects (like property lookup, assignment, enumeration, function invocation, etc.).'
          },
          {
            question: 'What is the purpose of Symbol in JavaScript?',
            options: [
              'To create mathematical symbols',
              'To create unique identifiers for object properties',
              'To handle errors',
              'To create loops'
            ],
            correct: 1,
            explanation: 'Symbols are primitive data types that create unique identifiers for object properties, ensuring no naming conflicts.'
          },
          {
            question: 'What is tail call optimization?',
            options: [
              'Optimizing the last function call in a recursive function',
              'A way to optimize loops',
              'A debugging technique',
              'A deprecated feature'
            ],
            correct: 0,
            explanation: 'Tail call optimization is a technique where the last function call in a recursive function is optimized to prevent stack overflow.'
          },
          {
            question: 'What is the difference between Object.freeze() and Object.seal()?',
            options: [
              'No difference',
              'freeze() prevents all changes, seal() allows property value changes',
              'seal() is stronger than freeze()',
              'They are deprecated'
            ],
            correct: 1,
            explanation: 'Object.freeze() prevents all changes to an object, while Object.seal() prevents adding/removing properties but allows changing existing property values.'
          },
          {
            question: 'What is a service worker?',
            options: [
              'A type of web worker that acts as a proxy between web app and network',
              'A debugging tool',
              'A type of function',
              'A server-side technology'
            ],
            correct: 0,
            explanation: 'A service worker is a script that runs in the background and acts as a proxy between your web application and the network, enabling features like offline functionality.'
          },
          {
            question: 'What is the difference between composition and inheritance?',
            options: [
              'No difference',
              'Composition uses "has-a" relationships, inheritance uses "is-a"',
              'Inheritance is always better',
              'Composition is deprecated'
            ],
            correct: 1,
            explanation: 'Composition creates objects by combining other objects (has-a relationship), while inheritance creates objects based on existing classes (is-a relationship).'
          },
          {
            question: 'What is a higher-order function?',
            options: [
              'A function with high performance',
              'A function that takes other functions as arguments or returns functions',
              'A function with many parameters',
              'A deprecated concept'
            ],
            correct: 1,
            explanation: 'A higher-order function is a function that takes one or more functions as arguments or returns a function as its result.'
          },
          {
            question: 'What is the purpose of the Reflect API?',
            options: [
              'To create reflections in UI',
              'To provide methods for interceptable JavaScript operations',
              'To handle errors',
              'To create animations'
            ],
            correct: 1,
            explanation: 'The Reflect API provides methods for interceptable JavaScript operations, offering a more functional approach to meta-programming.'
          },
          {
            question: 'What is memory management in JavaScript?',
            options: [
              'Manual memory allocation',
              'Automatic garbage collection handles memory management',
              'Memory is never freed',
              'Developers must manually free memory'
            ],
            correct: 1,
            explanation: 'JavaScript uses automatic garbage collection to manage memory, freeing up memory that is no longer referenced by the application.'
          }
        ],
        4: [ // Advanced
          {
            question: 'What is the difference between lexical scoping and dynamic scoping?',
            options: [
              'No difference in JavaScript',
              'Lexical scoping is determined at compile time, dynamic at runtime',
              'Dynamic scoping is faster',
              'JavaScript uses dynamic scoping'
            ],
            correct: 1,
            explanation: 'JavaScript uses lexical scoping where variable scope is determined by where variables are declared in the code, not where they are called from.'
          },
          {
            question: 'What is a memory leak and how can you prevent it?',
            options: [
              'Memory leaks don\'t exist in JavaScript',
              'Unreferenced objects that can\'t be garbage collected',
              'A feature of JavaScript',
              'Only happens in old browsers'
            ],
            correct: 1,
            explanation: 'Memory leaks occur when objects are no longer needed but still referenced, preventing garbage collection. They can be prevented by removing event listeners, clearing timers, and avoiding circular references.'
          },
          {
            question: 'What is the difference between compile-time and runtime errors?',
            options: [
              'No difference',
              'Compile-time errors occur during parsing, runtime during execution',
              'Runtime errors are worse',
              'JavaScript only has runtime errors'
            ],
            correct: 1,
            explanation: 'Compile-time errors (syntax errors) are caught during code parsing, while runtime errors occur during code execution.'
          },
          {
            question: 'What is the purpose of the WeakRef API?',
            options: [
              'To create weak passwords',
              'To hold weak references to objects that can be garbage collected',
              'To handle network requests',
              'To create weak types'
            ],
            correct: 1,
            explanation: 'WeakRef allows you to hold a weak reference to an object that doesn\'t prevent the object from being garbage collected.'
          },
          {
            question: 'What is the difference between imperative and declarative programming?',
            options: [
              'No difference',
              'Imperative describes how, declarative describes what',
              'Declarative is always better',
              'JavaScript only supports imperative'
            ],
            correct: 1,
            explanation: 'Imperative programming describes how to do something step by step, while declarative programming describes what you want to achieve.'
          },
          {
            question: 'What is a finite state machine in JavaScript?',
            options: [
              'A type of loop',
              'A computational model with states and transitions',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'A finite state machine is a computational model that can be in one of a finite number of states and can transition between states based on inputs.'
          },
          {
            question: 'What is the purpose of the AbortController API?',
            options: [
              'To abort JavaScript execution',
              'To cancel asynchronous operations like fetch requests',
              'To handle errors',
              'To create controllers'
            ],
            correct: 1,
            explanation: 'AbortController provides a way to abort asynchronous operations like fetch requests, allowing for better control over network requests.'
          },
          {
            question: 'What is tree shaking in JavaScript?',
            options: [
              'A debugging technique',
              'Eliminating dead code from bundles',
              'A way to traverse DOM trees',
              'A performance monitoring tool'
            ],
            correct: 1,
            explanation: 'Tree shaking is a dead code elimination technique used by bundlers to remove unused code from the final bundle.'
          },
          {
            question: 'What is the difference between mutable and immutable data structures?',
            options: [
              'No difference',
              'Mutable can be changed, immutable cannot',
              'Immutable is always faster',
              'JavaScript only has mutable structures'
            ],
            correct: 1,
            explanation: 'Mutable data structures can be modified after creation, while immutable data structures cannot be changed once created.'
          },
          {
            question: 'What is functional programming and its benefits?',
            options: [
              'Programming with functions only',
              'A paradigm emphasizing pure functions and immutability',
              'A deprecated approach',
              'Only for mathematical applications'
            ],
            correct: 1,
            explanation: 'Functional programming is a paradigm that emphasizes pure functions, immutability, and avoiding side effects, leading to more predictable and testable code.'
          }
        ],
        5: [ // Expert
          {
            question: 'What is the difference between structural and nominal typing?',
            options: [
              'No difference',
              'Structural typing is based on structure, nominal on explicit declarations',
              'Nominal typing is better',
              'JavaScript uses nominal typing'
            ],
            correct: 1,
            explanation: 'Structural typing (like TypeScript) is based on the shape/structure of objects, while nominal typing is based on explicit type declarations.'
          },
          {
            question: 'What is a monad in functional programming?',
            options: [
              'A type of function',
              'A design pattern for handling computations with context',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'A monad is a design pattern that provides a way to wrap values and chain operations on them while handling context like errors or asynchronous operations.'
          },
          {
            question: 'What is the purpose of the FinalizationRegistry API?',
            options: [
              'To finalize objects',
              'To register cleanup callbacks when objects are garbage collected',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'FinalizationRegistry allows you to register cleanup callbacks that are called when objects are garbage collected.'
          },
          {
            question: 'What is continuation-passing style (CPS)?',
            options: [
              'A way to write CSS',
              'A programming style where functions receive continuations as arguments',
              'A debugging technique',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'CPS is a programming style where functions receive continuations (functions representing what to do next) as arguments instead of returning values directly.'
          },
          {
            question: 'What is the difference between covariance and contravariance?',
            options: [
              'No difference',
              'Covariance preserves subtyping, contravariance reverses it',
              'They are the same concept',
              'JavaScript doesn\'t support either'
            ],
            correct: 1,
            explanation: 'Covariance preserves the subtyping relationship (if A is a subtype of B, then Array<A> is a subtype of Array<B>), while contravariance reverses it.'
          },
          {
            question: 'What is a zipper data structure?',
            options: [
              'A compression algorithm',
              'A data structure for efficient navigation and modification of immutable structures',
              'A type of array',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'A zipper is a data structure that allows efficient navigation and modification of immutable tree-like structures by maintaining focus on a particular location.'
          },
          {
            question: 'What is the actor model in concurrent programming?',
            options: [
              'A way to create actors in games',
              'A model where actors communicate through message passing',
              'A debugging pattern',
              'A UI pattern'
            ],
            correct: 1,
            explanation: 'The actor model is a concurrent computation model where actors are independent entities that communicate only through asynchronous message passing.'
          },
          {
            question: 'What is lazy evaluation and its benefits?',
            options: [
              'Slow evaluation',
              'Delaying computation until the result is needed',
              'A performance anti-pattern',
              'A debugging technique'
            ],
            correct: 1,
            explanation: 'Lazy evaluation delays computation until the result is actually needed, which can improve performance and enable working with infinite data structures.'
          },
          {
            question: 'What is the difference between homomorphism and isomorphism?',
            options: [
              'No difference',
              'Homomorphism preserves structure, isomorphism is bidirectional homomorphism',
              'They are unrelated concepts',
              'JavaScript doesn\'t use either'
            ],
            correct: 1,
            explanation: 'A homomorphism is a structure-preserving map between two algebraic structures, while an isomorphism is a bidirectional homomorphism that shows two structures are essentially the same.'
          },
          {
            question: 'What is a catamorphism in functional programming?',
            options: [
              'A type of error',
              'A generalization of fold operations that deconstructs data structures',
              'A performance optimization',
              'A debugging technique'
            ],
            correct: 1,
            explanation: 'A catamorphism is a generalization of fold operations that provides a way to deconstruct data structures in a systematic way, often used in functional programming for recursive data processing.'
          }
        ]
      },
      'Python': {
        0: [ // Beginner
          {
            question: 'What is the correct way to create a variable in Python?',
            options: ['var x = 5', 'x = 5', 'int x = 5', 'declare x = 5'],
            correct: 1,
            explanation: 'In Python, variables are created by simply assigning a value to a name. No declaration keyword is needed.'
          },
          {
            question: 'Which of the following is the correct way to create a comment in Python?',
            options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
            correct: 2,
            explanation: 'In Python, comments start with the # symbol.'
          },
          {
            question: 'What is the output of print(type([]))?',
            options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
            correct: 1,
            explanation: 'Empty square brackets [] create a list in Python, so type([]) returns <class \'list\'>.'
          },
          {
            question: 'How do you create a string in Python?',
            options: ['string("Hello")', '"Hello" or \'Hello\'', 'str = Hello', 'create_string("Hello")'],
            correct: 1,
            explanation: 'Strings in Python can be created using either double quotes or single quotes.'
          },
          {
            question: 'What is the correct way to create a list in Python?',
            options: ['list = (1, 2, 3)', 'list = {1, 2, 3}', 'list = [1, 2, 3]', 'list = <1, 2, 3>'],
            correct: 2,
            explanation: 'Lists in Python are created using square brackets with comma-separated values.'
          },
          {
            question: 'How do you print "Hello World" in Python?',
            options: ['echo("Hello World")', 'print("Hello World")', 'console.log("Hello World")', 'printf("Hello World")'],
            correct: 1,
            explanation: 'The print() function is used to output text in Python.'
          },
          {
            question: 'What is the correct way to create a for loop in Python?',
            options: ['for i in range(5):', 'for (i = 0; i < 5; i++):', 'for i = 1 to 5:', 'foreach i in range(5):'],
            correct: 0,
            explanation: 'Python for loops use the "for variable in iterable:" syntax.'
          },
          {
            question: 'How do you create a function in Python?',
            options: ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'],
            correct: 1,
            explanation: 'Functions in Python are defined using the "def" keyword.'
          },
          {
            question: 'What is the correct way to create an if statement in Python?',
            options: ['if (x == 5):', 'if x == 5:', 'if x = 5:', 'if x equals 5:'],
            correct: 1,
            explanation: 'Python if statements don\'t require parentheses around the condition, and use == for comparison.'
          },
          {
            question: 'How do you get user input in Python?',
            options: ['input()', 'get_input()', 'read()', 'scanf()'],
            correct: 0,
            explanation: 'The input() function is used to get user input in Python.'
          }
        ],
        1: [ // Beginner-Intermediate
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
            question: 'What is a Python dictionary?',
            options: [
              'An ordered collection of items',
              'A collection of key-value pairs',
              'A type of list',
              'A function'
            ],
            correct: 1,
            explanation: 'A dictionary is a collection of key-value pairs, where each key is unique.'
          },
          {
            question: 'What is the purpose of the len() function?',
            options: [
              'To create a list',
              'To return the length of an object',
              'To sort a list',
              'To convert to string'
            ],
            correct: 1,
            explanation: 'The len() function returns the number of items in an object like a list, string, or dictionary.'
          },
          {
            question: 'What is list comprehension in Python?',
            options: [
              'A way to understand lists',
              'A concise way to create lists',
              'A method to sort lists',
              'A debugging technique'
            ],
            correct: 1,
            explanation: 'List comprehension provides a concise way to create lists based on existing lists or other iterables.'
          },
          {
            question: 'What is the difference between append() and extend()?',
            options: [
              'No difference',
              'append() adds one item, extend() adds multiple items',
              'extend() is faster',
              'append() is deprecated'
            ],
            correct: 1,
            explanation: 'append() adds a single item to the end of a list, while extend() adds all items from an iterable to the end of the list.'
          },
          {
            question: 'What is a Python module?',
            options: [
              'A type of function',
              'A file containing Python code that can be imported',
              'A debugging tool',
              'A type of variable'
            ],
            correct: 1,
            explanation: 'A module is a file containing Python definitions and statements that can be imported and used in other Python programs.'
          },
          {
            question: 'What is the purpose of the range() function?',
            options: [
              'To create a list of numbers',
              'To generate a sequence of numbers',
              'To find the range of a list',
              'To sort numbers'
            ],
            correct: 1,
            explanation: 'The range() function generates a sequence of numbers, commonly used in for loops.'
          },
          {
            question: 'What is exception handling in Python?',
            options: [
              'A way to handle errors gracefully',
              'A debugging technique',
              'A performance optimization',
              'A way to create exceptions'
            ],
            correct: 0,
            explanation: 'Exception handling allows you to catch and handle errors that occur during program execution using try/except blocks.'
          },
          {
            question: 'What is the difference between is and == in Python?',
            options: [
              'No difference',
              'is checks identity, == checks equality',
              '== is faster',
              'is is deprecated'
            ],
            correct: 1,
            explanation: 'The "is" operator checks if two variables refer to the same object in memory, while "==" checks if the values are equal.'
          }
        ],
        2: [ // Intermediate
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
          },
          {
            question: 'What is the purpose of *args and **kwargs?',
            options: [
              'To create variables',
              'To pass variable number of arguments to functions',
              'To handle errors',
              'To create loops'
            ],
            correct: 1,
            explanation: '*args allows a function to accept any number of positional arguments, **kwargs allows any number of keyword arguments.'
          },
          {
            question: 'What is a generator in Python?',
            options: [
              'A function that generates random numbers',
              'A function that yields values one at a time',
              'A type of loop',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'A generator is a function that yields values one at a time using the yield keyword, allowing for memory-efficient iteration.'
          },
          {
            question: 'What is the difference between shallow and deep copy?',
            options: [
              'No difference',
              'Shallow copy copies references, deep copy copies objects',
              'Deep copy is always faster',
              'Shallow copy is deprecated'
            ],
            correct: 1,
            explanation: 'Shallow copy creates a new object but inserts references to nested objects, while deep copy creates completely independent copies.'
          },
          {
            question: 'What is a lambda function?',
            options: [
              'A named function',
              'An anonymous function',
              'A type of loop',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'A lambda function is a small anonymous function that can have any number of arguments but can only have one expression.'
          },
          {
            question: 'What is the purpose of the __init__ method?',
            options: [
              'To initialize objects',
              'To destroy objects',
              'To copy objects',
              'To compare objects'
            ],
            correct: 0,
            explanation: 'The __init__ method is a constructor that initializes newly created objects with initial values.'
          },
          {
            question: 'What is inheritance in Python?',
            options: [
              'A way to copy code',
              'A mechanism where a class inherits properties from another class',
              'A debugging technique',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'Inheritance allows a class to inherit attributes and methods from another class, promoting code reuse.'
          },
          {
            question: 'What is the purpose of the super() function?',
            options: [
              'To create super variables',
              'To call methods from parent class',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The super() function is used to call methods from the parent class in inheritance hierarchies.'
          },
          {
            question: 'What is a context manager in Python?',
            options: [
              'A debugging tool',
              'An object that defines methods for use with the "with" statement',
              'A type of function',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'A context manager is an object that defines methods to be used with the "with" statement for resource management.'
          },
          {
            question: 'What is the difference between staticmethod and classmethod?',
            options: [
              'No difference',
              'staticmethod doesn\'t receive class/instance, classmethod receives class',
              'classmethod is deprecated',
              'staticmethod is faster'
            ],
            correct: 1,
            explanation: 'staticmethod doesn\'t receive any implicit first argument, while classmethod receives the class as the first argument.'
          }
        ],
        3: [ // Intermediate-Advanced
          {
            question: 'What is the Global Interpreter Lock (GIL)?',
            options: [
              'A security feature',
              'A mutex that prevents multiple threads from executing Python bytecode simultaneously',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode at once.'
          },
          {
            question: 'What is metaclass in Python?',
            options: [
              'A type of class',
              'A class whose instances are classes',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'A metaclass is a class whose instances are classes. It defines how classes are constructed.'
          },
          {
            question: 'What is the purpose of the __slots__ attribute?',
            options: [
              'To create slots in UI',
              'To restrict attributes and save memory',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: '__slots__ restricts the attributes that instances can have and can save memory by avoiding the __dict__ attribute.'
          },
          {
            question: 'What is a descriptor in Python?',
            options: [
              'A way to describe objects',
              'An object that defines how attribute access is handled',
              'A debugging tool',
              'A type of function'
            ],
            correct: 1,
            explanation: 'A descriptor is an object that defines how attribute access is handled through __get__, __set__, and __delete__ methods.'
          },
          {
            question: 'What is the difference between multiprocessing and multithreading?',
            options: [
              'No difference',
              'Multiprocessing uses separate processes, multithreading uses threads',
              'Multithreading is always better',
              'Multiprocessing is deprecated'
            ],
            correct: 1,
            explanation: 'Multiprocessing creates separate processes that can run on different CPU cores, while multithreading creates threads within the same process.'
          },
          {
            question: 'What is monkey patching?',
            options: [
              'A debugging technique',
              'Dynamically modifying classes or modules at runtime',
              'A performance optimization',
              'A testing framework'
            ],
            correct: 1,
            explanation: 'Monkey patching is the practice of dynamically modifying classes or modules at runtime to change their behavior.'
          },
          {
            question: 'What is the purpose of the asyncio module?',
            options: [
              'To handle file I/O',
              'To write asynchronous code using async/await',
              'To create threads',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'The asyncio module provides infrastructure for writing single-threaded concurrent code using coroutines, async/await syntax.'
          },
          {
            question: 'What is a coroutine in Python?',
            options: [
              'A type of function',
              'A function that can pause and resume execution',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'A coroutine is a function that can pause and resume its execution, allowing for cooperative multitasking.'
          },
          {
            question: 'What is the difference between property and attribute?',
            options: [
              'No difference',
              'Property uses getter/setter methods, attribute is direct access',
              'Attribute is deprecated',
              'Property is faster'
            ],
            correct: 1,
            explanation: 'A property uses getter/setter methods to control access to an attribute, while a regular attribute provides direct access.'
          },
          {
            question: 'What is the purpose of the weakref module?',
            options: [
              'To create weak passwords',
              'To create weak references that don\'t prevent garbage collection',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The weakref module allows you to create weak references to objects that don\'t prevent the object from being garbage collected.'
          }
        ],
        4: [ // Advanced
          {
            question: 'What is the difference between __new__ and __init__?',
            options: [
              'No difference',
              '__new__ creates the instance, __init__ initializes it',
              '__init__ is deprecated',
              '__new__ is faster'
            ],
            correct: 1,
            explanation: '__new__ is responsible for creating and returning a new instance, while __init__ initializes the already created instance.'
          },
          {
            question: 'What is the method resolution order (MRO)?',
            options: [
              'The order methods are called',
              'The order in which base classes are searched for methods',
              'A debugging technique',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'MRO is the order in which Python searches for methods in a hierarchy of classes, especially important in multiple inheritance.'
          },
          {
            question: 'What is the purpose of the __call__ method?',
            options: [
              'To call functions',
              'To make objects callable like functions',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The __call__ method allows an object to be called like a function by implementing the function call operator.'
          },
          {
            question: 'What is a closure in Python?',
            options: [
              'A way to close files',
              'A function that captures variables from its enclosing scope',
              'A debugging technique',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'A closure is a function that captures and retains access to variables from its enclosing scope even after the outer function returns.'
          },
          {
            question: 'What is the difference between bound and unbound methods?',
            options: [
              'No difference in Python 3',
              'Bound methods have an instance, unbound methods don\'t',
              'Unbound methods are deprecated',
              'Bound methods are faster'
            ],
            correct: 0,
            explanation: 'In Python 3, the distinction between bound and unbound methods was removed. All methods are now bound when accessed through an instance.'
          },
          {
            question: 'What is the purpose of the __enter__ and __exit__ methods?',
            options: [
              'To enter and exit functions',
              'To implement context manager protocol',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: '__enter__ and __exit__ methods implement the context manager protocol, allowing objects to be used with the "with" statement.'
          },
          {
            question: 'What is the difference between is and == for strings?',
            options: [
              'No difference',
              'is checks identity, == checks value; string interning affects behavior',
              '== is always better',
              'is is deprecated'
            ],
            correct: 1,
            explanation: 'For strings, "is" checks if they are the same object in memory (affected by string interning), while "==" checks if they have the same value.'
          },
          {
            question: 'What is the purpose of the collections.abc module?',
            options: [
              'To create collections',
              'To provide abstract base classes for collections',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The collections.abc module provides abstract base classes that define interfaces for various collection types.'
          },
          {
            question: 'What is the difference between __str__ and __repr__?',
            options: [
              'No difference',
              '__str__ is for end users, __repr__ is for developers',
              '__repr__ is deprecated',
              '__str__ is faster'
            ],
            correct: 1,
            explanation: '__str__ should return a human-readable string for end users, while __repr__ should return an unambiguous string representation for developers.'
          },
          {
            question: 'What is the purpose of the functools module?',
            options: [
              'To create functions',
              'To provide utilities for working with functions and callable objects',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The functools module provides utilities for working with higher-order functions and operations on callable objects.'
          }
        ],
        5: [ // Expert
          {
            question: 'What is the difference between CPython, PyPy, and Jython?',
            options: [
              'No difference',
              'Different Python implementations with different performance characteristics',
              'Different versions of Python',
              'Different Python libraries'
            ],
            correct: 1,
            explanation: 'CPython is the standard implementation, PyPy uses JIT compilation for speed, and Jython runs on the JVM.'
          },
          {
            question: 'What is the purpose of the dis module?',
            options: [
              'To disable features',
              'To disassemble Python bytecode',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The dis module provides functions to disassemble Python bytecode, useful for understanding how Python executes code.'
          },
          {
            question: 'What is the difference between __getattr__ and __getattribute__?',
            options: [
              'No difference',
              '__getattr__ is called when attribute is not found, __getattribute__ is called for all attribute access',
              '__getattribute__ is deprecated',
              '__getattr__ is faster'
            ],
            correct: 1,
            explanation: '__getattribute__ is called for every attribute access, while __getattr__ is only called when the attribute is not found through normal lookup.'
          },
          {
            question: 'What is the purpose of the ast module?',
            options: [
              'To create abstract syntax trees',
              'To parse and manipulate Python source code',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The ast module helps Python applications process trees of the Python abstract syntax grammar.'
          },
          {
            question: 'What is the difference between sys.exit() and os._exit()?',
            options: [
              'No difference',
              'sys.exit() raises SystemExit, os._exit() terminates immediately',
              'os._exit() is deprecated',
              'sys.exit() is faster'
            ],
            correct: 1,
            explanation: 'sys.exit() raises a SystemExit exception that can be caught, while os._exit() terminates the process immediately without cleanup.'
          },
          {
            question: 'What is the purpose of the gc module?',
            options: [
              'To collect garbage',
              'To control Python\'s garbage collector',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The gc module provides an interface to the optional garbage collector for cyclic references.'
          },
          {
            question: 'What is the difference between compile() and eval()?',
            options: [
              'No difference',
              'compile() creates code objects, eval() executes expressions',
              'eval() is deprecated',
              'compile() is faster'
            ],
            correct: 1,
            explanation: 'compile() compiles source code into code objects that can be executed, while eval() evaluates and executes expressions.'
          },
          {
            question: 'What is the purpose of the inspect module?',
            options: [
              'To inspect objects',
              'To get information about live objects and source code',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The inspect module provides several useful functions to help get information about live objects such as modules, classes, methods, functions, etc.'
          },
          {
            question: 'What is the difference between __import__ and importlib?',
            options: [
              'No difference',
              '__import__ is low-level, importlib is high-level import machinery',
              'importlib is deprecated',
              '__import__ is faster'
            ],
            correct: 1,
            explanation: '__import__ is the low-level function used by import statements, while importlib provides a higher-level interface to the import machinery.'
          },
          {
            question: 'What is the purpose of the types module?',
            options: [
              'To create types',
              'To provide utilities for working with types and dynamic type creation',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'The types module defines utility functions and classes for working with types and dynamic type creation.'
          }
        ]
      },
      'React': {
        0: [ // Beginner
          {
            question: 'What is React?',
            options: [
              'A database',
              'A JavaScript library for building user interfaces',
              'A web server',
              'A CSS framework'
            ],
            correct: 1,
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
              'Through context',
              'Through refs'
            ],
            correct: 1,
            explanation: 'Props (properties) are the primary way to pass data from parent components to child components in React.'
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
            explanation: 'React uses camelCase event handlers like onClick, and you pass function references without parentheses.'
          },
          {
            question: 'What is the purpose of the key prop in React lists?',
            options: [
              'To style list items',
              'To help React identify which items have changed',
              'To sort the list',
              'To filter the list'
            ],
            correct: 1,
            explanation: 'The key prop helps React identify which items have changed, are added, or are removed, improving performance.'
          },
          {
            question: 'How do you create a class component in React?',
            options: [
              'class MyComponent extends React.Component',
              'class MyComponent extends Component',
              'Both A and B are correct',
              'class MyComponent implements React.Component'
            ],
            correct: 2,
            explanation: 'Class components can extend either React.Component or Component (if imported separately).'
          },
          {
            question: 'What is the render method used for in class components?',
            options: [
              'To handle events',
              'To return JSX that describes the UI',
              'To manage state',
              'To handle side effects'
            ],
            correct: 1,
            explanation: 'The render method in class components returns JSX that describes what the UI should look like.'
          },
          {
            question: 'How do you import React in a component file?',
            options: [
              'import React from "react"',
              'include React from "react"',
              'require React from "react"',
              'using React from "react"'
            ],
            correct: 0,
            explanation: 'React is imported using ES6 import syntax: import React from "react".'
          }
        ],
        1: [ // Beginner-Intermediate
          {
            question: 'What is state in React?',
            options: [
              'A way to style components',
              'An object that holds data that may change over time',
              'A method to handle events',
              'A way to import components'
            ],
            correct: 1,
            explanation: 'State is an object that holds data that may change over the lifetime of the component and affects what is rendered.'
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
            question: 'How do you update state in a functional component?',
            options: [
              'this.setState()',
              'setState()',
              'Using the setter function from useState',
              'state.update()'
            ],
            correct: 2,
            explanation: 'In functional components, you use the setter function returned by useState to update state.'
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
            question: 'What is the difference between props and state?',
            options: [
              'No difference',
              'Props are passed from parent, state is internal to component',
              'State is passed from parent, props are internal',
              'Props and state are the same thing'
            ],
            correct: 1,
            explanation: 'Props are passed down from parent components, while state is managed internally within a component.'
          },
          {
            question: 'What is conditional rendering in React?',
            options: [
              'Rendering components based on conditions',
              'A way to style components',
              'A performance optimization',
              'A debugging technique'
            ],
            correct: 0,
            explanation: 'Conditional rendering is the practice of rendering different components or elements based on certain conditions.'
          },
          {
            question: 'How do you handle forms in React?',
            options: [
              'Using controlled components',
              'Using uncontrolled components',
              'Both controlled and uncontrolled components',
              'React doesn\'t support forms'
            ],
            correct: 2,
            explanation: 'React supports both controlled components (where React controls the form data) and uncontrolled components (where DOM handles form data).'
          },
          {
            question: 'What is the purpose of React.Fragment?',
            options: [
              'To create fragments of code',
              'To group multiple elements without adding extra DOM nodes',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'React.Fragment allows you to group multiple elements without adding an extra DOM node to the output.'
          },
          {
            question: 'What is the difference between function and class components?',
            options: [
              'No difference',
              'Function components are simpler and use hooks, class components use lifecycle methods',
              'Class components are always better',
              'Function components are deprecated'
            ],
            correct: 1,
            explanation: 'Function components are simpler and use hooks for state and side effects, while class components use lifecycle methods and this.state.'
          }
        ],
        2: [ // Intermediate
          {
            question: 'What is React Context?',
            options: [
              'A way to style components',
              'A way to pass data through component tree without props drilling',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'React Context provides a way to pass data through the component tree without having to pass props down manually at every level.'
          },
          {
            question: 'What is the useReducer hook used for?',
            options: [
              'To reduce component size',
              'To manage complex state logic',
              'To optimize performance',
              'To handle side effects'
            ],
            correct: 1,
            explanation: 'useReducer is used for managing complex state logic that involves multiple sub-values or when the next state depends on the previous one.'
          },
          {
            question: 'What is React.memo()?',
            options: [
              'A way to memorize components',
              'A higher-order component for performance optimization',
              'A debugging tool',
              'A way to handle memory'
            ],
            correct: 1,
            explanation: 'React.memo() is a higher-order component that memoizes the result and skips re-rendering if props haven\'t changed.'
          },
          {
            question: 'What is the purpose of useCallback hook?',
            options: [
              'To call functions',
              'To memoize callback functions',
              'To handle events',
              'To manage state'
            ],
            correct: 1,
            explanation: 'useCallback returns a memoized version of the callback that only changes if one of the dependencies has changed.'
          },
          {
            question: 'What is the purpose of useMemo hook?',
            options: [
              'To memorize components',
              'To memoize expensive calculations',
              'To handle side effects',
              'To manage state'
            ],
            correct: 1,
            explanation: 'useMemo returns a memoized value and only recalculates when one of the dependencies has changed.'
          },
          {
            question: 'What are React lifecycle methods?',
            options: [
              'Methods to create components',
              'Methods that are called at different stages of component lifecycle',
              'Methods to handle events',
              'Methods to style components'
            ],
            correct: 1,
            explanation: 'Lifecycle methods are special methods in class components that are called at different stages of the component\'s lifecycle.'
          },
          {
            question: 'What is the difference between componentDidMount and useEffect?',
            options: [
              'No difference',
              'componentDidMount is for class components, useEffect is for functional components',
              'useEffect is deprecated',
              'componentDidMount is faster'
            ],
            correct: 1,
            explanation: 'componentDidMount is a lifecycle method for class components, while useEffect is a hook for functional components that can replicate lifecycle behavior.'
          },
          {
            question: 'What is prop drilling?',
            options: [
              'A debugging technique',
              'Passing props through multiple component levels',
              'A performance optimization',
              'A way to create components'
            ],
            correct: 1,
            explanation: 'Prop drilling is the process of passing props through multiple levels of components to reach a deeply nested component.'
          },
          {
            question: 'What is the purpose of useRef hook?',
            options: [
              'To create references to DOM elements',
              'To manage state',
              'To handle side effects',
              'To optimize performance'
            ],
            correct: 0,
            explanation: 'useRef returns a mutable ref object that can hold a reference to a DOM element or any mutable value.'
          },
          {
            question: 'What is a higher-order component (HOC)?',
            options: [
              'A component with high performance',
              'A function that takes a component and returns a new component',
              'A component with many props',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'A higher-order component is a function that takes a component and returns a new component with additional functionality.'
          }
        ],
        3: [ // Intermediate-Advanced
          {
            question: 'What is React Suspense?',
            options: [
              'A way to suspend components',
              'A component for handling loading states of lazy-loaded components',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'React Suspense allows you to handle loading states for components that are loaded asynchronously, like with React.lazy().'
          },
          {
            question: 'What is code splitting in React?',
            options: [
              'Splitting code into multiple files',
              'Dynamically importing components to reduce bundle size',
              'A debugging technique',
              'A way to organize code'
            ],
            correct: 1,
            explanation: 'Code splitting is a technique to split your code into smaller chunks that can be loaded on demand, reducing initial bundle size.'
          },
          {
            question: 'What is the difference between controlled and uncontrolled components?',
            options: [
              'No difference',
              'Controlled components have their state managed by React, uncontrolled by DOM',
              'Uncontrolled components are better',
              'Controlled components are deprecated'
            ],
            correct: 1,
            explanation: 'Controlled components have their form data handled by React state, while uncontrolled components let the DOM handle form data.'
          },
          {
            question: 'What is React.lazy()?',
            options: [
              'A way to make components lazy',
              'A function for lazy loading components',
              'A performance optimization',
              'A debugging tool'
            ],
            correct: 1,
            explanation: 'React.lazy() allows you to define a component that is loaded dynamically, enabling code splitting.'
          },
          {
            question: 'What is the purpose of React.StrictMode?',
            options: [
              'To make React strict',
              'To highlight potential problems in development',
              'To optimize performance',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'React.StrictMode is a tool for highlighting potential problems in an application during development.'
          },
          {
            question: 'What is the difference between useState and useReducer?',
            options: [
              'No difference',
              'useState for simple state, useReducer for complex state logic',
              'useReducer is deprecated',
              'useState is faster'
            ],
            correct: 1,
            explanation: 'useState is preferable for simple state, while useReducer is better for complex state logic involving multiple sub-values.'
          },
          {
            question: 'What is React reconciliation?',
            options: [
              'A debugging process',
              'The process of comparing virtual DOM trees and updating the real DOM',
              'A performance optimization',
              'A way to handle errors'
            ],
            correct: 1,
            explanation: 'Reconciliation is React\'s algorithm for comparing virtual DOM trees and efficiently updating the real DOM.'
          },
          {
            question: 'What is the purpose of React DevTools?',
            options: [
              'To develop React',
              'Browser extension for debugging React applications',
              'A testing framework',
              'A performance monitoring tool'
            ],
            correct: 1,
            explanation: 'React DevTools is a browser extension that allows you to inspect React component hierarchies and debug React applications.'
          },
          {
            question: 'What is the difference between React.createElement and JSX?',
            options: [
              'No difference',
              'JSX is syntactic sugar for React.createElement',
              'React.createElement is deprecated',
              'JSX is faster'
            ],
            correct: 1,
            explanation: 'JSX is syntactic sugar that gets compiled to React.createElement calls by tools like Babel.'
          },
          {
            question: 'What is the purpose of the dependency array in useEffect?',
            options: [
              'To list dependencies',
              'To control when the effect runs',
              'To optimize performance',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'The dependency array controls when the effect runs - it only re-runs when one of the dependencies changes.'
          }
        ],
        4: [ // Advanced
          {
            question: 'What is React Fiber?',
            options: [
              'A type of component',
              'React\'s reconciliation algorithm for better performance',
              'A debugging tool',
              'A testing framework'
            ],
            correct: 1,
            explanation: 'React Fiber is a complete rewrite of React\'s reconciliation algorithm that enables features like time slicing and concurrent rendering.'
          },
          {
            question: 'What is concurrent rendering in React?',
            options: [
              'Rendering multiple components at once',
              'React\'s ability to interrupt and resume rendering work',
              'A performance optimization',
              'A debugging feature'
            ],
            correct: 1,
            explanation: 'Concurrent rendering allows React to interrupt rendering work to handle high-priority updates, improving user experience.'
          },
          {
            question: 'What is the purpose of React.forwardRef()?',
            options: [
              'To forward components',
              'To pass refs through components to child elements',
              'To optimize performance',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'React.forwardRef() allows a component to pass a ref through to one of its child components.'
          },
          {
            question: 'What is the difference between React.PureComponent and React.Component?',
            options: [
              'No difference',
              'PureComponent implements shallow comparison in shouldComponentUpdate',
              'Component is deprecated',
              'PureComponent is faster'
            ],
            correct: 1,
            explanation: 'React.PureComponent automatically implements shouldComponentUpdate with a shallow prop and state comparison.'
          },
          {
            question: 'What is the purpose of React.cloneElement()?',
            options: [
              'To clone components',
              'To clone and modify React elements',
              'To optimize performance',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'React.cloneElement() clones and returns a new React element using the original element as the starting point.'
          },
          {
            question: 'What is the difference between shallow and deep rendering in testing?',
            options: [
              'No difference',
              'Shallow renders only the component, deep renders child components too',
              'Deep rendering is deprecated',
              'Shallow rendering is faster'
            ],
            correct: 1,
            explanation: 'Shallow rendering only renders the component itself without its children, while deep rendering renders the entire component tree.'
          },
          {
            question: 'What is the purpose of React.Children utilities?',
            options: [
              'To create children',
              'To manipulate and transform children props',
              'To optimize performance',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'React.Children provides utilities for dealing with the opaque data structure of props.children.'
          },
          {
            question: 'What is the difference between React.Fragment and div?',
            options: [
              'No difference',
              'Fragment doesn\'t create extra DOM nodes',
              'div is deprecated',
              'Fragment is faster'
            ],
            correct: 1,
            explanation: 'React.Fragment allows you to group elements without adding an extra DOM node, unlike div which creates a DOM element.'
          },
          {
            question: 'What is the purpose of the key prop in React reconciliation?',
            options: [
              'To unlock components',
              'To help React identify which items have changed for efficient updates',
              'To optimize performance',
              'To handle errors'
            ],
            correct: 1,
            explanation: 'The key prop helps React identify which items have changed, are added, or removed, enabling efficient reconciliation.'
          },
          {
            question: 'What is the difference between synthetic events and native events?',
            options: [
              'No difference',
              'Synthetic events are React\'s wrapper around native events for consistency',
              'Native events are deprecated',
              'Synthetic events are faster'
            ],
            correct: 1,
            explanation: 'Synthetic events are React\'s wrapper around native events that provide consistent behavior across different browsers.'
          }
        ],
        5: [ // Expert
          {
            question: 'What is React\'s time slicing?',
            options: [
              'A way to slice time',
              'Breaking rendering work into chunks to avoid blocking the main thread',
              'A debugging technique',
              'A performance monitoring tool'
            ],
            correct: 1,
            explanation: 'Time slicing allows React to break rendering work into chunks and spread it out over multiple frames to avoid blocking the main thread.'
          },
          {
            question: 'What is the difference between React.memo and useMemo?',
            options: [
              'No difference',
              'React.memo memoizes components, useMemo memoizes values',
              'useMemo is deprecated',
              'React.memo is faster'
            ],
            correct: 1,
            explanation: 'React.memo is a higher-order component that memoizes the entire component, while useMemo memoizes computed values.'
          },
          {
            question: 'What is React\'s automatic batching?',
            options: [
              'Automatic component creation',
              'Grouping multiple state updates into a single re-render',
              'A debugging feature',
              'A performance monitoring tool'
            ],
            correct: 1,
            explanation: 'Automatic batching groups multiple state updates into a single re-render for better performance.'
          },
          {
            question: 'What is the purpose of React.startTransition()?',
            options: [
              'To start animations',
              'To mark updates as non-urgent for concurrent features',
              'To handle errors',
              'To optimize performance'
            ],
            correct: 1,
            explanation: 'React.startTransition() allows you to mark updates as non-urgent, enabling React to prioritize more urgent updates.'
          },
          {
            question: 'What is the difference between useLayoutEffect and useEffect?',
            options: [
              'No difference',
              'useLayoutEffect runs synchronously after DOM mutations, useEffect runs asynchronously',
              'useEffect is deprecated',
              'useLayoutEffect is faster'
            ],
            correct: 1,
            explanation: 'useLayoutEffect runs synchronously after all DOM mutations but before the browser paints, while useEffect runs asynchronously.'
          },
          {
            question: 'What is React\'s Suspense for data fetching?',
            options: [
              'A way to suspend data',
              'A pattern for handling loading states in data fetching',
              'A debugging tool',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'Suspense for data fetching allows components to "suspend" rendering while waiting for asynchronous data to load.'
          },
          {
            question: 'What is the purpose of React.unstable_batchedUpdates()?',
            options: [
              'To create unstable updates',
              'To manually batch state updates outside of React event handlers',
              'A debugging tool',
              'A deprecated feature'
            ],
            correct: 1,
            explanation: 'React.unstable_batchedUpdates() allows you to manually batch state updates that occur outside of React event handlers.'
          },
          {
            question: 'What is React\'s concurrent mode?',
            options: [
              'A mode for concurrent programming',
              'A set of features for better user experience through interruptible rendering',
              'A debugging mode',
              'A performance monitoring mode'
            ],
            correct: 1,
            explanation: 'Concurrent mode is a set of React features that help apps stay responsive by rendering component trees without blocking the main thread.'
          },
          {
            question: 'What is the purpose of React.experimental_useOpaqueIdentifier()?',
            options: [
              'To create opaque identifiers',
              'To generate unique IDs that are consistent between server and client',
              'A debugging tool',
              'A deprecated feature'
            ],
            correct: 1,
            explanation: 'This experimental hook generates unique IDs that are consistent between server and client rendering, useful for accessibility.'
          },
          {
            question: 'What is React\'s selective hydration?',
            options: [
              'A way to hydrate selectively',
              'Hydrating parts of the app based on user interactions',
              'A debugging technique',
              'A performance optimization'
            ],
            correct: 1,
            explanation: 'Selective hydration allows React to prioritize hydrating parts of the app that the user is interacting with first.'
          }
        ]
      }
    };

    // Get questions for the topic, fallback to JavaScript if topic not found
    const topicQuestions = allTemplates[topic] || allTemplates['JavaScript'];
    
    // Get questions for the specific level, fallback to level 0 if not found
    const levelQuestions = topicQuestions[level] || topicQuestions[0] || [];
    
    // Ensure we have exactly 10 questions
    let selectedQuestions = [...levelQuestions];
    
    // If we have fewer than 10 questions, repeat them
    while (selectedQuestions.length < 10) {
      selectedQuestions = [...selectedQuestions, ...levelQuestions];
    }

    // Return exactly 10 questions
    return selectedQuestions.slice(0, 10);
  }

  async generateQuestions(request: QuestionGenerationRequest): Promise<Question[]> {
    const cacheKey = `${request.topic}_${request.level}_${request.difficulty}`;
    
    // Check cache first
    if (this.questionCache.has(cacheKey)) {
      console.log('Returning cached questions for:', cacheKey);
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
      
      // Cache the questions
      this.questionCache.set(cacheKey, questions);
      
      return questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to template questions
      const fallbackQuestions = this.getQuestionTemplates(request.topic, request.level).map((template, index) => ({
        id: `fallback_${cacheKey}_${index}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }));
      
      // Cache the fallback questions
      this.questionCache.set(cacheKey, fallbackQuestions);
      
      return fallbackQuestions;
    }
  }

  async generateQuestionsForTopic(topicName: string, level: number = 0): Promise<Question[]> {
    const difficulty = level <= 1 ? 'beginner' : level <= 3 ? 'intermediate' : 'advanced';
    
    console.log(`Generating questions for ${topicName}, level ${level}, difficulty: ${difficulty}`);
    
    return this.generateQuestions({
      topic: topicName,
      level,
      questionCount: 10,
      difficulty
    });
  }

  // Method to save questions to database for persistence
  async saveQuestionsToDatabase(topicId: string, level: number, questions: Question[]): Promise<void> {
    try {
      const questionsToSave = questions.map(q => ({
        topic_id: topicId,
        level: level,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        ai_generated: true
      }));

      const { error } = await supabase
        .from('quest_questions')
        .insert(questionsToSave);

      if (error) {
        console.error('Error saving questions to database:', error);
      } else {
        console.log(`Saved ${questions.length} questions to database for topic ${topicId}, level ${level}`);
      }
    } catch (error) {
      console.error('Error in saveQuestionsToDatabase:', error);
    }
  }

  // Method to load questions from database
  async loadQuestionsFromDatabase(topicId: string, level: number): Promise<Question[] | null> {
    try {
      const { data, error } = await supabase
        .from('quest_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('level', level)
        .limit(10);

      if (error) {
        console.error('Error loading questions from database:', error);
        return null;
      }

      if (data && data.length > 0) {
        return data.map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation
        }));
      }

      return null;
    } catch (error) {
      console.error('Error in loadQuestionsFromDatabase:', error);
      return null;
    }
  }

  // Clear cache method for testing
  clearCache(): void {
    this.questionCache.clear();
  }
}

export const aiService = new AIService();
export type { Question, QuestionGenerationRequest };