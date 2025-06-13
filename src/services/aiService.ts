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
        id: `q_${Date.now()}_${index}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }))
    };
  }

  private getQuestionTemplates(topic: string, level: number) {
    const allQuestions = this.getAllQuestions(topic);
    
    // Get 10 questions for the specific level
    const startIndex = level * 10;
    const endIndex = startIndex + 10;
    
    // If we don't have enough questions for this level, cycle through available ones
    const selectedQuestions = [];
    for (let i = 0; i < 10; i++) {
      const questionIndex = (startIndex + i) % allQuestions.length;
      selectedQuestions.push(allQuestions[questionIndex]);
    }
    
    return selectedQuestions;
  }

  private getAllQuestions(topic: string) {
    const questionSets: Record<string, any[]> = {
      'JavaScript': [
        // Level 0 (Beginner) - Questions 0-9
        {
          question: 'Which keyword is used to declare a variable in JavaScript?',
          options: ['var', 'variable', 'declare', 'let'],
          correct: 0,
          explanation: 'The "var" keyword is the traditional way to declare variables in JavaScript, though "let" and "const" are now preferred.'
        },
        {
          question: 'What does "console.log()" do in JavaScript?',
          options: ['Creates a new variable', 'Prints output to the console', 'Defines a function', 'Imports a library'],
          correct: 1,
          explanation: 'console.log() is used to output information to the browser\'s console for debugging purposes.'
        },
        {
          question: 'Which symbol is used for single-line comments in JavaScript?',
          options: ['#', '//', '/*', '--'],
          correct: 1,
          explanation: 'Double forward slashes (//) are used for single-line comments in JavaScript.'
        },
        {
          question: 'What is the correct way to write a JavaScript string?',
          options: ['"Hello World"', '(Hello World)', '[Hello World]', '{Hello World}'],
          correct: 0,
          explanation: 'Strings in JavaScript are enclosed in quotes (single or double).'
        },
        {
          question: 'Which operator is used for addition in JavaScript?',
          options: ['add', '+', 'plus', '&'],
          correct: 1,
          explanation: 'The plus sign (+) is used for addition in JavaScript.'
        },
        {
          question: 'What is the correct file extension for JavaScript files?',
          options: ['.java', '.js', '.javascript', '.script'],
          correct: 1,
          explanation: 'JavaScript files use the .js extension.'
        },
        {
          question: 'Which of these is a JavaScript data type?',
          options: ['text', 'number', 'character', 'decimal'],
          correct: 1,
          explanation: 'Number is one of the primitive data types in JavaScript.'
        },
        {
          question: 'How do you create a function in JavaScript?',
          options: ['function myFunction()', 'create myFunction()', 'def myFunction()', 'func myFunction()'],
          correct: 0,
          explanation: 'Functions in JavaScript are declared using the "function" keyword.'
        },
        {
          question: 'What does "true" and "false" represent in JavaScript?',
          options: ['Strings', 'Numbers', 'Boolean values', 'Objects'],
          correct: 2,
          explanation: 'True and false are boolean values representing logical states.'
        },
        {
          question: 'Which method is used to get the length of a string?',
          options: ['size()', 'length', 'count()', 'getLength()'],
          correct: 1,
          explanation: 'The length property returns the number of characters in a string.'
        },

        // Level 1 (Beginner) - Questions 10-19
        {
          question: 'What is the output of typeof null in JavaScript?',
          options: ['null', 'undefined', 'object', 'boolean'],
          correct: 2,
          explanation: 'typeof null returns "object" due to a historical bug in JavaScript that has been kept for backward compatibility.'
        },
        {
          question: 'Which method adds an element to the end of an array?',
          options: ['append()', 'push()', 'add()', 'insert()'],
          correct: 1,
          explanation: 'The push() method adds one or more elements to the end of an array.'
        },
        {
          question: 'What is the difference between let and var?',
          options: ['No difference', 'let has block scope, var has function scope', 'var is newer', 'let is faster'],
          correct: 1,
          explanation: 'let has block scope while var has function scope, making let safer to use.'
        },
        {
          question: 'How do you write an if statement in JavaScript?',
          options: ['if i = 5', 'if (i == 5)', 'if i == 5 then', 'if i equals 5'],
          correct: 1,
          explanation: 'If statements in JavaScript use parentheses around the condition.'
        },
        {
          question: 'Which loop runs at least once?',
          options: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
          correct: 2,
          explanation: 'A do-while loop executes the code block once before checking the condition.'
        },
        {
          question: 'What does the === operator do?',
          options: ['Assignment', 'Loose equality', 'Strict equality', 'Not equal'],
          correct: 2,
          explanation: 'The === operator checks for strict equality (both value and type must match).'
        },
        {
          question: 'How do you access the first element of an array called "arr"?',
          options: ['arr[1]', 'arr[0]', 'arr.first()', 'arr.get(0)'],
          correct: 1,
          explanation: 'Arrays in JavaScript are zero-indexed, so the first element is at index 0.'
        },
        {
          question: 'Which method removes the last element from an array?',
          options: ['pop()', 'remove()', 'delete()', 'shift()'],
          correct: 0,
          explanation: 'The pop() method removes and returns the last element of an array.'
        },
        {
          question: 'What is the correct way to write a JavaScript object?',
          options: ['var obj = (name: "John")', 'var obj = {name: "John"}', 'var obj = [name: "John"]', 'var obj = <name: "John">'],
          correct: 1,
          explanation: 'JavaScript objects are written with curly braces and key-value pairs.'
        },
        {
          question: 'How do you call a function named "myFunction"?',
          options: ['call myFunction()', 'myFunction()', 'execute myFunction()', 'run myFunction()'],
          correct: 1,
          explanation: 'Functions are called by writing their name followed by parentheses.'
        },

        // Level 2 (Intermediate) - Questions 20-29
        {
          question: 'What is a closure in JavaScript?',
          options: ['A way to close files', 'A function with access to outer scope', 'A loop structure', 'An error handling method'],
          correct: 1,
          explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns.'
        },
        {
          question: 'What does the "this" keyword refer to?',
          options: ['The current function', 'The global object', 'The object that owns the method', 'The previous element'],
          correct: 2,
          explanation: 'The "this" keyword refers to the object that owns the method being executed.'
        },
        {
          question: 'How do you handle asynchronous operations in modern JavaScript?',
          options: ['callbacks only', 'promises only', 'async/await', 'setTimeout only'],
          correct: 2,
          explanation: 'async/await is the modern way to handle asynchronous operations, built on top of promises.'
        },
        {
          question: 'What is event bubbling?',
          options: ['Creating new events', 'Events moving up the DOM tree', 'Deleting events', 'Events moving down the DOM tree'],
          correct: 1,
          explanation: 'Event bubbling is when an event starts from the target element and bubbles up through its ancestors.'
        },
        {
          question: 'Which method creates a new array with all elements that pass a test?',
          options: ['forEach()', 'map()', 'filter()', 'reduce()'],
          correct: 2,
          explanation: 'The filter() method creates a new array with elements that pass the provided test function.'
        },
        {
          question: 'What is the difference between == and ===?',
          options: ['No difference', '== is faster', '=== checks type and value, == performs type coercion', '== is newer'],
          correct: 2,
          explanation: '=== performs strict comparison while == performs type coercion before comparison.'
        },
        {
          question: 'How do you create a promise in JavaScript?',
          options: ['new Promise()', 'Promise.create()', 'makePromise()', 'createPromise()'],
          correct: 0,
          explanation: 'Promises are created using the Promise constructor with new Promise().'
        },
        {
          question: 'What does the spread operator (...) do?',
          options: ['Multiplies numbers', 'Spreads array elements', 'Creates functions', 'Handles errors'],
          correct: 1,
          explanation: 'The spread operator expands array elements or object properties.'
        },
        {
          question: 'Which method transforms each element of an array?',
          options: ['filter()', 'map()', 'reduce()', 'forEach()'],
          correct: 1,
          explanation: 'The map() method creates a new array by transforming each element with a provided function.'
        },
        {
          question: 'What is destructuring in JavaScript?',
          options: ['Deleting objects', 'Extracting values from arrays/objects', 'Creating new variables', 'Combining arrays'],
          correct: 1,
          explanation: 'Destructuring allows extracting values from arrays or properties from objects into distinct variables.'
        },

        // Level 3 (Intermediate) - Questions 30-39
        {
          question: 'What is the purpose of Promise.all()?',
          options: ['Run promises sequentially', 'Run promises in parallel and wait for all', 'Cancel all promises', 'Create new promises'],
          correct: 1,
          explanation: 'Promise.all() runs multiple promises in parallel and resolves when all of them complete.'
        },
        {
          question: 'How do you create a class in ES6?',
          options: ['function MyClass()', 'class MyClass {}', 'new Class MyClass', 'create class MyClass'],
          correct: 1,
          explanation: 'ES6 introduced the class keyword for creating classes in JavaScript.'
        },
        {
          question: 'What does the map() method return?',
          options: ['The original array', 'A new array', 'A single value', 'Nothing'],
          correct: 1,
          explanation: 'The map() method returns a new array with the results of calling a function on every element.'
        },
        {
          question: 'What is hoisting in JavaScript?',
          options: ['Moving code up', 'Variable and function declarations moved to top of scope', 'Deleting variables', 'Creating new scope'],
          correct: 1,
          explanation: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope during compilation.'
        },
        {
          question: 'Which method combines all array elements into a string?',
          options: ['combine()', 'join()', 'merge()', 'concat()'],
          correct: 1,
          explanation: 'The join() method creates and returns a new string by concatenating all array elements.'
        },
        {
          question: 'What is the difference between null and undefined?',
          options: ['No difference', 'null is assigned, undefined is not initialized', 'undefined is assigned, null is not initialized', 'null is a string'],
          correct: 1,
          explanation: 'null is an assigned value representing no value, while undefined means a variable has been declared but not assigned.'
        },
        {
          question: 'How do you check if a property exists in an object?',
          options: ['obj.hasProperty()', 'obj.exists()', 'obj.hasOwnProperty()', 'obj.contains()'],
          correct: 2,
          explanation: 'hasOwnProperty() checks if an object has a specific property as its own (not inherited).'
        },
        {
          question: 'What does the reduce() method do?',
          options: ['Removes elements', 'Reduces array size', 'Applies function to accumulate single value', 'Sorts array'],
          correct: 2,
          explanation: 'reduce() executes a reducer function on each array element, resulting in a single output value.'
        },
        {
          question: 'How do you create an arrow function?',
          options: ['=> function()', '() => {}', 'arrow function()', 'function => ()'],
          correct: 1,
          explanation: 'Arrow functions use the => syntax: () => {} for parameterless or (param) => {} for parameters.'
        },
        {
          question: 'What is the purpose of the bind() method?',
          options: ['Combine arrays', 'Set the this context', 'Create new objects', 'Handle errors'],
          correct: 1,
          explanation: 'bind() creates a new function with a specific this context and optionally preset arguments.'
        },

        // Level 4 (Advanced) - Questions 40-49
        {
          question: 'What is a WeakMap in JavaScript?',
          options: ['A weak reference map', 'A map with weak keys that can be garbage collected', 'A slow map', 'A temporary map'],
          correct: 1,
          explanation: 'WeakMap is a collection where keys are weakly referenced and can be garbage collected when no other references exist.'
        },
        {
          question: 'What are generators in JavaScript?',
          options: ['Functions that create objects', 'Functions that can pause and resume execution', 'Random number generators', 'Code generators'],
          correct: 1,
          explanation: 'Generators are functions that can be paused and resumed, yielding multiple values over time.'
        },
        {
          question: 'What is the Proxy object used for?',
          options: ['Network requests', 'Intercepting and customizing object operations', 'Creating copies', 'Handling errors'],
          correct: 1,
          explanation: 'Proxy allows you to intercept and customize operations performed on objects (property lookup, assignment, etc.).'
        },
        {
          question: 'What is the Symbol primitive type?',
          options: ['A mathematical symbol', 'A unique identifier', 'A string type', 'A number type'],
          correct: 1,
          explanation: 'Symbol is a primitive data type that creates unique identifiers for object properties.'
        },
        {
          question: 'What does the Reflect API provide?',
          options: ['Object reflection and manipulation', 'Code reflection', 'Performance monitoring', 'Error handling'],
          correct: 0,
          explanation: 'Reflect provides methods for interceptable JavaScript operations, similar to Proxy handler methods.'
        },
        {
          question: 'What is the difference between call() and apply()?',
          options: ['No difference', 'call() takes arguments separately, apply() takes an array', 'apply() is faster', 'call() is newer'],
          correct: 1,
          explanation: 'call() takes arguments individually while apply() takes arguments as an array.'
        },
        {
          question: 'What is a service worker?',
          options: ['A background script for web apps', 'A server worker', 'A database worker', 'A UI worker'],
          correct: 0,
          explanation: 'Service workers are scripts that run in the background, enabling features like offline functionality and push notifications.'
        },
        {
          question: 'What is the purpose of Object.freeze()?',
          options: ['Stop object execution', 'Make object immutable', 'Cool down object', 'Pause object'],
          correct: 1,
          explanation: 'Object.freeze() makes an object immutable - you cannot add, delete, or modify its properties.'
        },
        {
          question: 'What is a module in JavaScript?',
          options: ['A small function', 'A reusable piece of code with its own scope', 'A loop structure', 'An error type'],
          correct: 1,
          explanation: 'Modules are reusable pieces of code with their own scope that can export and import functionality.'
        },
        {
          question: 'What is the event loop?',
          options: ['A loop for events', 'The mechanism that handles asynchronous operations', 'A type of for loop', 'An error handling loop'],
          correct: 1,
          explanation: 'The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.'
        },

        // Level 5 (Expert) - Questions 50-59
        {
          question: 'What is a SharedArrayBuffer?',
          options: ['A shared array', 'A buffer for sharing memory between workers', 'A network buffer', 'A graphics buffer'],
          correct: 1,
          explanation: 'SharedArrayBuffer represents a raw binary data buffer that can be shared between multiple workers.'
        },
        {
          question: 'What is the BigInt type used for?',
          options: ['Large strings', 'Arbitrarily large integers', 'Big objects', 'Large arrays'],
          correct: 1,
          explanation: 'BigInt is a primitive type for representing integers larger than Number.MAX_SAFE_INTEGER.'
        },
        {
          question: 'What is the difference between microtasks and macrotasks?',
          options: ['Size difference', 'Microtasks have higher priority in event loop', 'No difference', 'Macrotasks are faster'],
          correct: 1,
          explanation: 'Microtasks (like Promise callbacks) have higher priority and execute before macrotasks (like setTimeout).'
        },
        {
          question: 'What is optional chaining (?.) used for?',
          options: ['Creating chains', 'Safely accessing nested properties', 'Chaining functions', 'Creating optional parameters'],
          correct: 1,
          explanation: 'Optional chaining allows safe access to nested object properties without throwing errors if intermediate properties are null/undefined.'
        },
        {
          question: 'What is the nullish coalescing operator (??)?',
          options: ['Null checker', 'Returns right operand when left is null/undefined', 'Null creator', 'Null remover'],
          correct: 1,
          explanation: 'The nullish coalescing operator (??) returns the right operand when the left operand is null or undefined.'
        },
        {
          question: 'What is top-level await?',
          options: ['Await at function top', 'Using await outside async functions in modules', 'Fastest await', 'Await with highest priority'],
          correct: 1,
          explanation: 'Top-level await allows using await directly in modules without wrapping in an async function.'
        },
        {
          question: 'What is a FinalizationRegistry?',
          options: ['Final registry', 'Registry for cleanup callbacks when objects are garbage collected', 'Registration system', 'Final validation'],
          correct: 1,
          explanation: 'FinalizationRegistry allows registering cleanup callbacks that are called when objects are garbage collected.'
        },
        {
          question: 'What is the purpose of WeakRef?',
          options: ['Weak references to objects', 'Weak variable references', 'Reference counting', 'Memory management'],
          correct: 0,
          explanation: 'WeakRef creates a weak reference to an object that doesn\'t prevent garbage collection.'
        },
        {
          question: 'What is a private field in JavaScript classes?',
          options: ['Hidden field', 'Field with # prefix that is truly private', 'Protected field', 'Internal field'],
          correct: 1,
          explanation: 'Private fields use # prefix and are truly private, not accessible outside the class.'
        },
        {
          question: 'What is the Temporal API?',
          options: ['Time travel API', 'Modern date/time API proposal', 'Temporary storage API', 'Template API'],
          correct: 1,
          explanation: 'Temporal is a proposed modern API for working with dates and times, addressing issues with the Date object.'
        }
      ],

      'Python': [
        // Level 0 (Beginner) - Questions 0-9
        {
          question: 'What is the output of print("Hello World")?',
          options: ['Hello World', '"Hello World"', 'print("Hello World")', 'Error'],
          correct: 0,
          explanation: 'The print() function outputs the string without quotes to the console.'
        },
        {
          question: 'Which symbol is used for comments in Python?',
          options: ['//', '#', '/*', '--'],
          correct: 1,
          explanation: 'The hash symbol (#) is used for single-line comments in Python.'
        },
        {
          question: 'What is the correct file extension for Python files?',
          options: ['.python', '.py', '.pt', '.pyt'],
          correct: 1,
          explanation: 'Python files use the .py extension.'
        },
        {
          question: 'How do you create a variable in Python?',
          options: ['var x = 5', 'x = 5', 'int x = 5', 'create x = 5'],
          correct: 1,
          explanation: 'Python uses simple assignment without type declarations: x = 5'
        },
        {
          question: 'Which of these is a Python data type?',
          options: ['string', 'int', 'float', 'All of the above'],
          correct: 3,
          explanation: 'Python has string, int, float, and many other built-in data types.'
        },
        {
          question: 'How do you get user input in Python?',
          options: ['input()', 'get()', 'read()', 'scan()'],
          correct: 0,
          explanation: 'The input() function is used to get user input in Python.'
        },
        {
          question: 'What does len() function do?',
          options: ['Lengthens a string', 'Returns the length of an object', 'Creates a list', 'Deletes characters'],
          correct: 1,
          explanation: 'len() returns the number of items in an object (string, list, etc.).'
        },
        {
          question: 'How do you create a list in Python?',
          options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
          correct: 1,
          explanation: 'Lists in Python are created using square brackets [].'
        },
        {
          question: 'Which operator is used for exponentiation in Python?',
          options: ['^', '**', 'exp', 'pow'],
          correct: 1,
          explanation: 'The ** operator is used for exponentiation in Python (e.g., 2**3 = 8).'
        },
        {
          question: 'What is the correct way to check if two values are equal?',
          options: ['x = y', 'x == y', 'x === y', 'x eq y'],
          correct: 1,
          explanation: 'The == operator is used for equality comparison in Python.'
        },

        // Level 1 (Beginner) - Questions 10-19
        {
          question: 'What is the output of type([])?',
          options: ['<class \'array\'>', '<class \'list\'>', '<class \'tuple\'>', '<class \'dict\'>'],
          correct: 1,
          explanation: 'Empty square brackets [] create a list in Python, so type([]) returns <class \'list\'>.'
        },
        {
          question: 'How do you create a virtual environment in Python?',
          options: ['pip install venv', 'python -m venv myenv', 'create-env myenv', 'virtualenv only'],
          correct: 1,
          explanation: 'python -m venv is the standard way to create virtual environments in Python 3.3+.'
        },
        {
          question: 'What is the difference between a list and a tuple?',
          options: ['Lists are ordered, tuples are not', 'Lists are mutable, tuples are immutable', 'Lists use [], tuples use {}', 'No difference'],
          correct: 1,
          explanation: 'Lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation).'
        },
        {
          question: 'Which method adds an item to the end of a list?',
          options: ['add()', 'append()', 'insert()', 'Both append() and insert()'],
          correct: 3,
          explanation: 'Both append() (adds to end) and insert() (adds at specific index) can add items to a list.'
        },
        {
          question: 'How do you create a dictionary in Python?',
          options: ['dict = [key: value]', 'dict = {key: value}', 'dict = (key: value)', 'dict = <key: value>'],
          correct: 1,
          explanation: 'Dictionaries in Python are created using curly braces with key-value pairs.'
        },
        {
          question: 'What does the range() function do?',
          options: ['Creates a list', 'Generates a sequence of numbers', 'Finds the range of values', 'Sorts numbers'],
          correct: 1,
          explanation: 'range() generates a sequence of numbers, commonly used in for loops.'
        },
        {
          question: 'How do you write a for loop in Python?',
          options: ['for i in range(5):', 'for (i = 0; i < 5; i++):', 'for i = 1 to 5:', 'loop i in 5:'],
          correct: 0,
          explanation: 'Python for loops use the "for item in iterable:" syntax.'
        },
        {
          question: 'What is indentation used for in Python?',
          options: ['Decoration', 'Defining code blocks', 'Comments', 'Variable names'],
          correct: 1,
          explanation: 'Python uses indentation to define code blocks instead of curly braces.'
        },
        {
          question: 'How do you define a function in Python?',
          options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
          correct: 1,
          explanation: 'Functions in Python are defined using the "def" keyword.'
        },
        {
          question: 'What does the split() method do?',
          options: ['Joins strings', 'Splits a string into a list', 'Removes characters', 'Counts characters'],
          correct: 1,
          explanation: 'split() divides a string into a list based on a specified separator.'
        },

        // Level 2 (Intermediate) - Questions 20-29
        {
          question: 'What is a lambda function in Python?',
          options: ['A named function', 'An anonymous function', 'A class method', 'A built-in function'],
          correct: 1,
          explanation: 'Lambda functions are anonymous functions defined using the lambda keyword.'
        },
        {
          question: 'How do you import a specific function from a module?',
          options: ['import module.function', 'from module import function', 'include module.function', 'using module.function'],
          correct: 1,
          explanation: 'Use "from module import function" to import specific functions from a module.'
        },
        {
          question: 'What is the purpose of __init__ method?',
          options: ['Initialize a class', 'Initialize an object', 'Import modules', 'Initialize variables'],
          correct: 1,
          explanation: '__init__ is the constructor method that initializes new objects when they are created.'
        },
        {
          question: 'What is list comprehension?',
          options: ['Understanding lists', 'A concise way to create lists', 'List documentation', 'List comparison'],
          correct: 1,
          explanation: 'List comprehension provides a concise way to create lists using a single line of code.'
        },
        {
          question: 'How do you handle exceptions in Python?',
          options: ['try/catch', 'try/except', 'catch/throw', 'handle/error'],
          correct: 1,
          explanation: 'Python uses try/except blocks for exception handling.'
        },
        {
          question: 'What is the difference between is and ==?',
          options: ['No difference', 'is checks identity, == checks equality', '== checks identity, is checks equality', 'is is faster'],
          correct: 1,
          explanation: '"is" checks if two variables refer to the same object, while "==" checks if values are equal.'
        },
        {
          question: 'What does the enumerate() function do?',
          options: ['Counts items', 'Returns index and value pairs', 'Numbers items', 'Lists items'],
          correct: 1,
          explanation: 'enumerate() returns pairs of index and value for each item in an iterable.'
        },
        {
          question: 'How do you create a class in Python?',
          options: ['class MyClass:', 'create class MyClass:', 'new class MyClass:', 'define class MyClass:'],
          correct: 0,
          explanation: 'Classes in Python are defined using the "class" keyword followed by a colon.'
        },
        {
          question: 'What is the purpose of self in Python methods?',
          options: ['Self-reference', 'Refers to the instance of the class', 'A keyword', 'Self-documentation'],
          correct: 1,
          explanation: '"self" refers to the instance of the class and is used to access instance variables and methods.'
        },
        {
          question: 'What does the zip() function do?',
          options: ['Compresses files', 'Combines multiple iterables', 'Creates archives', 'Speeds up code'],
          correct: 1,
          explanation: 'zip() combines multiple iterables (lists, tuples, etc.) element by element.'
        },

        // Level 3 (Intermediate) - Questions 30-39
        {
          question: 'What is the difference between shallow and deep copy?',
          options: ['Depth of copying', 'Shallow copies references, deep copies objects recursively', 'Speed difference', 'Memory usage'],
          correct: 1,
          explanation: 'Shallow copy creates a new object but references to nested objects, deep copy creates new objects recursively.'
        },
        {
          question: 'What is method overriding in Python?',
          options: ['Creating new methods', 'Redefining parent class methods in child class', 'Deleting methods', 'Copying methods'],
          correct: 1,
          explanation: 'Method overriding allows a child class to provide a specific implementation of a method defined in its parent class.'
        },
        {
          question: 'What do *args and **kwargs mean?',
          options: ['Variable arguments and keyword arguments', 'Multiplication and power', 'Pointers', 'Comments'],
          correct: 0,
          explanation: '*args allows a function to accept any number of positional arguments, **kwargs allows any number of keyword arguments.'
        },
        {
          question: 'What is a decorator in Python?',
          options: ['A design pattern', 'A function that modifies another function', 'A class method', 'An import statement'],
          correct: 1,
          explanation: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it.'
        },
        {
          question: 'What is the purpose of the with statement?',
          options: ['Conditional execution', 'Context management', 'Loop control', 'Function definition'],
          correct: 1,
          explanation: 'The with statement is used for context management, ensuring proper resource cleanup.'
        },
        {
          question: 'What is a generator in Python?',
          options: ['A function that generates code', 'A function that yields values one at a time', 'A random number generator', 'A class generator'],
          correct: 1,
          explanation: 'A generator is a function that yields values one at a time, allowing for memory-efficient iteration.'
        },
        {
          question: 'What does the yield keyword do?',
          options: ['Returns a value', 'Pauses function execution and returns a value', 'Stops execution', 'Creates variables'],
          correct: 1,
          explanation: 'yield pauses the function execution and returns a value, allowing the function to resume later.'
        },
        {
          question: 'What is multiple inheritance?',
          options: ['Inheriting multiple times', 'A class inheriting from multiple parent classes', 'Multiple objects', 'Multiple methods'],
          correct: 1,
          explanation: 'Multiple inheritance allows a class to inherit attributes and methods from multiple parent classes.'
        },
        {
          question: 'What is the purpose of __str__ method?',
          options: ['String conversion', 'Returns string representation of object', 'Creates strings', 'String manipulation'],
          correct: 1,
          explanation: '__str__ method returns a human-readable string representation of an object.'
        },
        {
          question: 'What is a property in Python?',
          options: ['Object attribute', 'A way to access methods like attributes', 'Class variable', 'Instance variable'],
          correct: 1,
          explanation: 'Properties allow you to access methods like attributes, providing getter/setter functionality.'
        },

        // Level 4 (Advanced) - Questions 40-49
        {
          question: 'What is the Global Interpreter Lock (GIL)?',
          options: ['Global variable lock', 'Mechanism that prevents multiple threads from executing Python code simultaneously', 'Global import lock', 'Global iteration lock'],
          correct: 1,
          explanation: 'GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously.'
        },
        {
          question: 'What is the difference between multiprocessing and multithreading?',
          options: ['No difference', 'Multiprocessing uses separate processes, multithreading uses threads within a process', 'Speed difference', 'Memory usage'],
          correct: 1,
          explanation: 'Multiprocessing creates separate processes with their own memory space, while multithreading creates threads within the same process.'
        },
        {
          question: 'What is a metaclass in Python?',
          options: ['A meta description', 'A class whose instances are classes', 'A parent class', 'A class method'],
          correct: 1,
          explanation: 'A metaclass is a class whose instances are classes themselves, controlling how classes are created.'
        },
        {
          question: 'What is the purpose of __slots__?',
          options: ['Creating slots', 'Restricting instance attributes and saving memory', 'Method slots', 'Time slots'],
          correct: 1,
          explanation: '__slots__ restricts the attributes an instance can have and can save memory by avoiding __dict__.'
        },
        {
          question: 'What is monkey patching?',
          options: ['Patching monkeys', 'Dynamically modifying classes or modules at runtime', 'Bug fixing', 'Code patching'],
          correct: 1,
          explanation: 'Monkey patching is dynamically modifying a class or module at runtime to change or extend its behavior.'
        },
        {
          question: 'What is the difference between __new__ and __init__?',
          options: ['No difference', '__new__ creates the instance, __init__ initializes it', '__init__ creates, __new__ initializes', 'Both create instances'],
          correct: 1,
          explanation: '__new__ is responsible for creating the instance, while __init__ initializes the already created instance.'
        },
        {
          question: 'What is a context manager?',
          options: ['Context handler', 'Object that defines runtime context for executing a block of code', 'Context switcher', 'Context creator'],
          correct: 1,
          explanation: 'A context manager defines the runtime context for executing a block of code, typically used with the "with" statement.'
        },
        {
          question: 'What is the purpose of asyncio?',
          options: ['Synchronous programming', 'Asynchronous programming framework', 'Input/output operations', 'Async imports'],
          correct: 1,
          explanation: 'asyncio is a library for writing concurrent code using async/await syntax for asynchronous programming.'
        },
        {
          question: 'What is a descriptor in Python?',
          options: ['Object description', 'Object that defines how attribute access is handled', 'Class descriptor', 'Method descriptor'],
          correct: 1,
          explanation: 'A descriptor is an object that defines how attribute access is handled through __get__, __set__, and __delete__ methods.'
        },
        {
          question: 'What is the difference between staticmethod and classmethod?',
          options: ['No difference', 'staticmethod has no access to class/instance, classmethod receives class as first argument', 'Speed difference', 'staticmethod is newer'],
          correct: 1,
          explanation: 'staticmethod has no access to class or instance data, while classmethod receives the class as the first argument.'
        },

        // Level 5 (Expert) - Questions 50-59
        {
          question: 'What is the difference between CPython and PyPy?',
          options: ['No difference', 'CPython is the standard implementation, PyPy is a JIT-compiled implementation', 'CPython is faster', 'PyPy is older'],
          correct: 1,
          explanation: 'CPython is the standard Python implementation written in C, while PyPy is an alternative implementation with JIT compilation for better performance.'
        },
        {
          question: 'What is the purpose of __new__ method?',
          options: ['Initialize objects', 'Create and return new instances', 'Update objects', 'Delete objects'],
          correct: 1,
          explanation: '__new__ is responsible for creating and returning a new instance of a class before __init__ is called.'
        },
        {
          question: 'What is memory profiling in Python?',
          options: ['Memory allocation', 'Analyzing memory usage of Python programs', 'Memory management', 'Memory optimization'],
          correct: 1,
          explanation: 'Memory profiling involves analyzing how much memory Python programs use and identifying memory bottlenecks.'
        },
        {
          question: 'What is a weakref in Python?',
          options: ['Weak reference', 'Reference that doesn\'t prevent garbage collection', 'Weak variable', 'Weak import'],
          correct: 1,
          explanation: 'A weak reference is a reference to an object that doesn\'t prevent the object from being garbage collected.'
        },
        {
          question: 'What is the purpose of __call__ method?',
          options: ['Call functions', 'Make instances callable like functions', 'Method calling', 'Function calls'],
          correct: 1,
          explanation: '__call__ method allows instances of a class to be called like functions.'
        },
        {
          question: 'What is bytecode in Python?',
          options: ['Binary code', 'Intermediate representation of Python code', 'Byte operations', 'Code bytes'],
          correct: 1,
          explanation: 'Bytecode is the intermediate representation that Python source code is compiled to before execution by the Python virtual machine.'
        },
        {
          question: 'What is the difference between __getattr__ and __getattribute__?',
          options: ['No difference', '__getattr__ is called when attribute is not found, __getattribute__ is called for every attribute access', 'Speed difference', '__getattr__ is newer'],
          correct: 1,
          explanation: '__getattribute__ is called for every attribute access, while __getattr__ is only called when the attribute is not found through normal lookup.'
        },
        {
          question: 'What is the purpose of sys.intern()?',
          options: ['Internal system', 'Intern strings for memory optimization', 'System internals', 'Internal functions'],
          correct: 1,
          explanation: 'sys.intern() interns strings, which can save memory when the same string is used multiple times.'
        },
        {
          question: 'What is a coroutine in Python?',
          options: ['Core routine', 'Function that can be paused and resumed', 'Routine core', 'Cooperative routine'],
          correct: 1,
          explanation: 'A coroutine is a function that can be paused and resumed, allowing for cooperative multitasking.'
        },
        {
          question: 'What is the purpose of __slots__ optimization?',
          options: ['Slot optimization', 'Reduces memory usage by avoiding __dict__', 'Speed optimization', 'Slot management'],
          correct: 1,
          explanation: '__slots__ optimization reduces memory usage by storing instance variables in a fixed-size array instead of a dictionary.'
        }
      ],

      'React': [
        // Level 0 (Beginner) - Questions 0-9
        {
          question: 'What is React?',
          options: ['A database', 'A JavaScript library for building user interfaces', 'A server framework', 'A CSS framework'],
          correct: 1,
          explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, particularly web applications.'
        },
        {
          question: 'What is JSX?',
          options: ['A new programming language', 'JavaScript XML - a syntax extension', 'A CSS framework', 'A database query language'],
          correct: 1,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.'
        },
        {
          question: 'How do you create a React component?',
          options: ['function MyComponent() {}', 'class MyComponent extends React.Component {}', 'const MyComponent = () => {}', 'All of the above'],
          correct: 3,
          explanation: 'React components can be created as function components, class components, or arrow function components.'
        },
        {
          question: 'What is a prop in React?',
          options: ['A property passed to components', 'A state variable', 'A method', 'A CSS class'],
          correct: 0,
          explanation: 'Props (properties) are arguments passed into React components to pass data from parent to child components.'
        },
        {
          question: 'How do you display a variable in JSX?',
          options: ['{{variable}}', '{variable}', '(variable)', '[variable]'],
          correct: 1,
          explanation: 'Variables in JSX are displayed using curly braces: {variable}'
        },
        {
          question: 'What is the virtual DOM?',
          options: ['A copy of the real DOM kept in memory', 'A new type of HTML', 'A CSS framework', 'A database'],
          correct: 0,
          explanation: 'The virtual DOM is a JavaScript representation of the real DOM kept in memory and synced with the real DOM.'
        },
        {
          question: 'How do you handle events in React?',
          options: ['onclick="handler"', 'onClick={handler}', 'on-click={handler}', 'click={handler}'],
          correct: 1,
          explanation: 'React uses camelCase event handlers like onClick={handler} instead of lowercase HTML attributes.'
        },
        {
          question: 'What is the correct way to import React?',
          options: ['import React from "react"', 'include React', 'require("react")', 'import "react"'],
          correct: 0,
          explanation: 'React is imported using ES6 import syntax: import React from "react"'
        },
        {
          question: 'How do you create a list in React?',
          options: ['Using for loops', 'Using map() method', 'Using forEach()', 'Using while loops'],
          correct: 1,
          explanation: 'Lists in React are typically created using the map() method to transform arrays into JSX elements.'
        },
        {
          question: 'What is a key prop used for?',
          options: ['Styling', 'Identifying list items uniquely', 'Event handling', 'State management'],
          correct: 1,
          explanation: 'Key props help React identify which list items have changed, been added, or removed for efficient re-rendering.'
        },

        // Level 1 (Beginner) - Questions 10-19
        {
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1,
          explanation: 'useState is the primary hook for managing state in functional React components.'
        },
        {
          question: 'What is the purpose of useEffect hook?',
          options: ['To manage component state', 'To handle side effects', 'To create context', 'To optimize performance'],
          correct: 1,
          explanation: 'useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM.'
        },
        {
          question: 'How do you pass data from parent to child component?',
          options: ['Through state', 'Through props', 'Through context', 'Through refs'],
          correct: 1,
          explanation: 'Props (properties) are the primary way to pass data from parent components to child components in React.'
        },
        {
          question: 'What is conditional rendering in React?',
          options: ['Rendering based on conditions', 'Rendering components conditionally', 'Using if statements in JSX', 'All of the above'],
          correct: 3,
          explanation: 'Conditional rendering means displaying different content based on certain conditions, often using ternary operators or logical AND.'
        },
        {
          question: 'How do you update state in a functional component?',
          options: ['this.setState()', 'setState()', 'Using the setter function from useState', 'Directly modifying state'],
          correct: 2,
          explanation: 'In functional components, you update state using the setter function returned by useState hook.'
        },
        {
          question: 'What is the difference between controlled and uncontrolled components?',
          options: ['No difference', 'Controlled components have React-managed state, uncontrolled use DOM state', 'Controlled are faster', 'Uncontrolled are newer'],
          correct: 1,
          explanation: 'Controlled components have their state managed by React, while uncontrolled components manage their own state internally.'
        },
        {
          question: 'How do you handle form submission in React?',
          options: ['onSubmit={handleSubmit}', 'onsubmit="handleSubmit"', 'submit={handleSubmit}', 'form-submit={handleSubmit}'],
          correct: 0,
          explanation: 'Form submission in React is handled using the onSubmit event handler on the form element.'
        },
        {
          question: 'What is the purpose of React.Fragment?',
          options: ['Creating fragments', 'Grouping elements without extra DOM nodes', 'Breaking components', 'Fragment management'],
          correct: 1,
          explanation: 'React.Fragment allows you to group multiple elements without adding an extra DOM node.'
        },
        {
          question: 'How do you prevent default behavior in React events?',
          options: ['event.preventDefault()', 'return false', 'event.stop()', 'event.cancel()'],
          correct: 0,
          explanation: 'Use event.preventDefault() to prevent the default behavior of events in React.'
        },
        {
          question: 'What is the children prop?',
          options: ['Child components', 'Content passed between component tags', 'Component children', 'Nested elements'],
          correct: 1,
          explanation: 'The children prop contains the content passed between the opening and closing tags of a component.'
        },

        // Level 2 (Intermediate) - Questions 20-29
        {
          question: 'What is the dependency array in useEffect?',
          options: ['Array of dependencies', 'Controls when effect runs', 'List of variables to watch', 'All of the above'],
          correct: 3,
          explanation: 'The dependency array controls when useEffect runs by specifying which values the effect depends on.'
        },
        {
          question: 'How do you create a custom hook?',
          options: ['function useCustom() {}', 'const useCustom = () => {}', 'Both are correct', 'class useCustom {}'],
          correct: 2,
          explanation: 'Custom hooks are JavaScript functions that start with "use" and can call other hooks.'
        },
        {
          question: 'What is useContext hook used for?',
          options: ['Creating context', 'Consuming context values', 'Context management', 'Context creation'],
          correct: 1,
          explanation: 'useContext hook is used to consume values from a React context without wrapping components in Consumer.'
        },
        {
          question: 'What is prop drilling?',
          options: ['Drilling holes in props', 'Passing props through multiple component layers', 'Prop optimization', 'Prop validation'],
          correct: 1,
          explanation: 'Prop drilling is the process of passing props through multiple component layers to reach deeply nested components.'
        },
        {
          question: 'How do you optimize React component re-renders?',
          options: ['React.memo', 'useMemo', 'useCallback', 'All of the above'],
          correct: 3,
          explanation: 'React.memo, useMemo, and useCallback are all optimization techniques to prevent unnecessary re-renders.'
        },
        {
          question: 'What is the purpose of React.memo?',
          options: ['Memory management', 'Memoizing component renders', 'Creating memos', 'Memory optimization'],
          correct: 1,
          explanation: 'React.memo is a higher-order component that memoizes the result and skips re-rendering if props haven\'t changed.'
        },
        {
          question: 'When should you use useCallback?',
          options: ['Always', 'When passing callbacks to optimized child components', 'Never', 'For all functions'],
          correct: 1,
          explanation: 'useCallback should be used when passing callbacks to optimized child components to prevent unnecessary re-renders.'
        },
        {
          question: 'What is the difference between useMemo and useCallback?',
          options: ['No difference', 'useMemo memoizes values, useCallback memoizes functions', 'useMemo is faster', 'useCallback is newer'],
          correct: 1,
          explanation: 'useMemo memoizes computed values, while useCallback memoizes function references.'
        },
        {
          question: 'How do you handle errors in React components?',
          options: ['try/catch', 'Error boundaries', 'componentDidCatch', 'Both Error boundaries and componentDidCatch'],
          correct: 3,
          explanation: 'Error boundaries and componentDidCatch are used to handle errors in React component trees.'
        },
        {
          question: 'What is the purpose of useRef hook?',
          options: ['Creating references', 'Accessing DOM elements directly', 'Storing mutable values', '2 and 3'],
          correct: 3,
          explanation: 'useRef can be used to access DOM elements directly and store mutable values that persist across renders.'
        },

        // Level 3 (Intermediate) - Questions 30-39
        {
          question: 'What is useReducer hook used for?',
          options: ['Reducing arrays', 'Managing complex state logic', 'Performance optimization', 'Reducing components'],
          correct: 1,
          explanation: 'useReducer is used for managing complex state logic, especially when state updates depend on previous state.'
        },
        {
          question: 'What are Higher-Order Components (HOCs)?',
          options: ['High-level components', 'Functions that take a component and return a new component', 'Complex components', 'Parent components'],
          correct: 1,
          explanation: 'HOCs are functions that take a component and return a new component with additional functionality.'
        },
        {
          question: 'What is the render prop pattern?',
          options: ['Rendering props', 'A technique for sharing code using a prop whose value is a function', 'Prop rendering', 'Component rendering'],
          correct: 1,
          explanation: 'Render props is a technique for sharing code between components using a prop whose value is a function.'
        },
        {
          question: 'How do you implement lazy loading in React?',
          options: ['React.lazy()', 'import()', 'Suspense', 'All of the above'],
          correct: 3,
          explanation: 'Lazy loading in React is implemented using React.lazy() with dynamic import() and Suspense for loading states.'
        },
        {
          question: 'What is React Suspense used for?',
          options: ['Suspending components', 'Handling loading states for lazy components', 'Pausing execution', 'Suspense management'],
          correct: 1,
          explanation: 'Suspense is used to handle loading states while waiting for lazy-loaded components or data to load.'
        },
        {
          question: 'What is the purpose of React.StrictMode?',
          options: ['Strict typing', 'Highlighting potential problems in development', 'Performance mode', 'Production mode'],
          correct: 1,
          explanation: 'StrictMode is a development tool that highlights potential problems and unsafe lifecycles in your application.'
        },
        {
          question: 'How do you share state between sibling components?',
          options: ['Direct sharing', 'Lifting state up to common parent', 'Using refs', 'Component communication'],
          correct: 1,
          explanation: 'State is shared between sibling components by lifting it up to their nearest common parent component.'
        },
        {
          question: 'What is the purpose of useLayoutEffect?',
          options: ['Layout management', 'Synchronous DOM mutations before browser paint', 'Layout optimization', 'Effect layout'],
          correct: 1,
          explanation: 'useLayoutEffect runs synchronously after all DOM mutations but before the browser paints.'
        },
        {
          question: 'How do you handle side effects in React?',
          options: ['useEffect', 'useLayoutEffect', 'Custom hooks', 'All of the above'],
          correct: 3,
          explanation: 'Side effects in React are handled using useEffect, useLayoutEffect, or custom hooks that encapsulate the logic.'
        },
        {
          question: 'What is React Context used for?',
          options: ['Context switching', 'Sharing data across component tree without prop drilling', 'Component context', 'Context management'],
          correct: 1,
          explanation: 'React Context provides a way to share data across the component tree without having to pass props down manually.'
        },

        // Level 4 (Advanced) - Questions 40-49
        {
          question: 'What is React Fiber?',
          options: ['Fiber optics', 'React\'s reconciliation algorithm', 'Network fiber', 'Component fiber'],
          correct: 1,
          explanation: 'React Fiber is the new reconciliation algorithm that enables incremental rendering and better performance.'
        },
        {
          question: 'What is concurrent rendering in React?',
          options: ['Parallel rendering', 'Ability to interrupt and resume rendering work', 'Concurrent components', 'Multi-threaded rendering'],
          correct: 1,
          explanation: 'Concurrent rendering allows React to interrupt and resume rendering work to keep the app responsive.'
        },
        {
          question: 'What is the difference between useLayoutEffect and useEffect?',
          options: ['No difference', 'useLayoutEffect runs synchronously, useEffect runs asynchronously', 'useLayoutEffect is faster', 'useEffect is newer'],
          correct: 1,
          explanation: 'useLayoutEffect runs synchronously after DOM mutations, while useEffect runs asynchronously after render.'
        },
        {
          question: 'What is React reconciliation?',
          options: ['Component reconciliation', 'Process of updating the DOM efficiently', 'Conflict resolution', 'Data reconciliation'],
          correct: 1,
          explanation: 'Reconciliation is React\'s process of efficiently updating the DOM by comparing virtual DOM trees.'
        },
        {
          question: 'How does React\'s diffing algorithm work?',
          options: ['Compares entire trees', 'Compares trees level by level with heuristics', 'Random comparison', 'Sequential comparison'],
          correct: 1,
          explanation: 'React\'s diffing algorithm compares virtual DOM trees level by level using heuristics for efficient updates.'
        },
        {
          question: 'What are React Portals?',
          options: ['Component portals', 'Way to render children into DOM node outside parent hierarchy', 'Portal components', 'Navigation portals'],
          correct: 1,
          explanation: 'Portals provide a way to render children into a DOM node that exists outside the parent component\'s DOM hierarchy.'
        },
        {
          question: 'What is the purpose of React.forwardRef?',
          options: ['Forward references', 'Passing refs through components', 'Reference forwarding', 'Component forwarding'],
          correct: 1,
          explanation: 'forwardRef allows components to pass refs through to child components, useful for accessing DOM elements.'
        },
        {
          question: 'What is React.cloneElement used for?',
          options: ['Cloning elements', 'Creating new elements with modified props', 'Element duplication', 'Component cloning'],
          correct: 1,
          explanation: 'cloneElement creates a new React element using another element as the starting point with modified props.'
        },
        {
          question: 'How do you implement code splitting in React?',
          options: ['Manual splitting', 'React.lazy() and dynamic imports', 'Code division', 'Component splitting'],
          correct: 1,
          explanation: 'Code splitting in React is implemented using React.lazy() with dynamic imports to load components on demand.'
        },
        {
          question: 'What is the React Profiler?',
          options: ['User profiler', 'Tool for measuring component performance', 'Profile manager', 'Component profiler'],
          correct: 1,
          explanation: 'React Profiler is a tool for measuring the performance of React applications and identifying bottlenecks.'
        },

        // Level 5 (Expert) - Questions 50-59
        {
          question: 'What is React\'s time slicing?',
          options: ['Time management', 'Breaking rendering work into chunks', 'Time optimization', 'Slice timing'],
          correct: 1,
          explanation: 'Time slicing allows React to break rendering work into chunks and spread it across multiple frames for better performance.'
        },
        {
          question: 'What is the React Profiler API?',
          options: ['Profiling API', 'API for measuring component render performance', 'Profile management API', 'Component API'],
          correct: 1,
          explanation: 'The Profiler API allows you to programmatically measure the performance of React component trees.'
        },
        {
          question: 'What are React Server Components?',
          options: ['Server-side components', 'Components that render on the server', 'Component servers', 'Server management'],
          correct: 1,
          explanation: 'React Server Components are a new type of component that renders on the server, reducing bundle size and improving performance.'
        },
        {
          question: 'What is startTransition in React 18?',
          options: ['Starting transitions', 'Marking updates as non-urgent', 'Transition management', 'Component transitions'],
          correct: 1,
          explanation: 'startTransition allows you to mark updates as non-urgent, letting React prioritize more important updates.'
        },
        {
          question: 'What is useDeferredValue hook?',
          options: ['Deferred values', 'Deferring value updates for performance', 'Value management', 'Delayed values'],
          correct: 1,
          explanation: 'useDeferredValue allows you to defer updates to less important parts of the UI for better performance.'
        },
        {
          question: 'What is React\'s automatic batching?',
          options: ['Batch processing', 'Automatically grouping multiple state updates', 'Auto batching', 'Batch management'],
          correct: 1,
          explanation: 'Automatic batching groups multiple state updates into a single re-render for better performance.'
        },
        {
          question: 'What is the React DevTools Profiler?',
          options: ['Development profiler', 'Browser extension for profiling React apps', 'Tool profiler', 'Dev tool'],
          correct: 1,
          explanation: 'React DevTools Profiler is a browser extension that helps profile and debug React application performance.'
        },
        {
          question: 'What is React\'s Selective Hydration?',
          options: ['Selective process', 'Hydrating components based on user interaction', 'Component selection', 'Hydration management'],
          correct: 1,
          explanation: 'Selective Hydration allows React to prioritize hydrating components based on user interactions.'
        },
        {
          question: 'What is the React 18 createRoot API?',
          options: ['Root creation', 'New API for creating React roots with concurrent features', 'API creation', 'Root management'],
          correct: 1,
          explanation: 'createRoot is the new API in React 18 for creating roots that enable concurrent features.'
        },
        {
          question: 'What is React\'s Streaming SSR?',
          options: ['Server streaming', 'Streaming server-side rendered content', 'Stream management', 'SSR streaming'],
          correct: 1,
          explanation: 'Streaming SSR allows React to send HTML to the browser in chunks, improving perceived performance.'
        }
      ]
    };

    return questionSets[topic] || questionSets['JavaScript'];
  }

  getAvailableTopics(): string[] {
    return ['JavaScript', 'Python', 'React', 'Machine Learning', 'Data Science', 'Web Development'];
  }

  async generateQuestions(request: QuestionGenerationRequest): Promise<Question[]> {
    const cacheKey = `${request.topic}-${request.level}`;
    
    // Check cache first
    if (this.questionCache.has(cacheKey)) {
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
        id: `fallback_${Date.now()}_${index}`,
        question_text: template.question,
        options: template.options,
        correct_answer: template.correct,
        explanation: template.explanation
      }));
      
      // Cache fallback questions too
      this.questionCache.set(cacheKey, fallbackQuestions);
      
      return fallbackQuestions;
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