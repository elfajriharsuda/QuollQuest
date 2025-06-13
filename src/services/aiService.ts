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
        0: [ // Beginner Level 0 - Basic Syntax & Variables
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
            question: 'How do you write a single-line comment in JavaScript?',
            options: ['<!-- This is a comment -->', '/* This is a comment */', '// This is a comment', '# This is a comment'],
            correct: 2,
            explanation: 'JavaScript uses // for single-line comments and /* */ for multi-line comments.'
          },
          {
            question: 'What does console.log() do?',
            options: ['Creates a new variable', 'Prints output to the console', 'Deletes a variable', 'Creates a function'],
            correct: 1,
            explanation: 'console.log() is used to output information to the browser console for debugging purposes.'
          },
          {
            question: 'Which operator is used for strict equality comparison in JavaScript?',
            options: ['=', '==', '===', 'equals'],
            correct: 2,
            explanation: '=== is the strict equality operator that compares both value and type without type coercion.'
          },
          {
            question: 'What is the result of 5 + "3" in JavaScript?',
            options: ['8', '53', 'Error', 'undefined'],
            correct: 1,
            explanation: 'JavaScript performs type coercion, converting the number 5 to a string and concatenating it with "3".'
          },
          {
            question: 'Which keyword is used to create a constant in JavaScript?',
            options: ['var', 'let', 'const', 'final'],
            correct: 2,
            explanation: 'The "const" keyword creates a constant that cannot be reassigned after declaration.'
          },
          {
            question: 'What is the correct way to create a string in JavaScript?',
            options: ['"Hello World"', "'Hello World'", '`Hello World`', 'All of the above'],
            correct: 3,
            explanation: 'JavaScript supports single quotes, double quotes, and template literals (backticks) for creating strings.'
          },
          {
            question: 'What does the typeof operator return for an array?',
            options: ['array', 'object', 'list', 'undefined'],
            correct: 1,
            explanation: 'In JavaScript, arrays are objects, so typeof returns "object" for arrays.'
          },
          {
            question: 'How do you create a multi-line comment in JavaScript?',
            options: ['// comment', '/* comment */', '<!-- comment -->', '# comment'],
            correct: 1,
            explanation: 'Multi-line comments in JavaScript are created using /* to start and */ to end the comment.'
          }
        ],
        1: [ // Beginner Level 1 - Functions & Basic Operations
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
          },
          {
            question: 'Which method removes the last element from an array?',
            options: ['pop()', 'remove()', 'delete()', 'shift()'],
            correct: 0,
            explanation: 'The pop() method removes and returns the last element from an array.'
          },
          {
            question: 'What is the correct way to write an if statement in JavaScript?',
            options: ['if i = 5 then', 'if (i == 5)', 'if i == 5', 'if i = 5'],
            correct: 1,
            explanation: 'JavaScript if statements require parentheses around the condition: if (condition).'
          },
          {
            question: 'How do you create an array in JavaScript?',
            options: ['var arr = []', 'var arr = ()', 'var arr = {}', 'var arr = <>'],
            correct: 0,
            explanation: 'Arrays in JavaScript are created using square brackets [].'
          },
          {
            question: 'What is the result of 10 % 3 in JavaScript?',
            options: ['3', '1', '0', '3.33'],
            correct: 1,
            explanation: 'The % operator returns the remainder of division. 10 divided by 3 is 3 with remainder 1.'
          },
          {
            question: 'Which loop is guaranteed to execute at least once?',
            options: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
            correct: 2,
            explanation: 'A do-while loop executes the code block first, then checks the condition, guaranteeing at least one execution.'
          }
        ],
        2: [ // Intermediate Level 2 - Objects & Advanced Concepts
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
            question: 'What does the "this" keyword refer to in a regular function?',
            options: [
              'Always the global object',
              'The current function',
              'The object that calls the function',
              'The parent object'
            ],
            correct: 2,
            explanation: 'In a regular function, "this" refers to the object that calls the function, or the global object if no object calls it.'
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
          },
          {
            question: 'How do you create an object in JavaScript?',
            options: ['var obj = []', 'var obj = {}', 'var obj = ()', 'var obj = new Object[]'],
            correct: 1,
            explanation: 'Objects in JavaScript are created using curly braces {} or the new Object() constructor.'
          },
          {
            question: 'What is the purpose of JSON.stringify()?',
            options: [
              'To parse JSON strings',
              'To convert JavaScript objects to JSON strings',
              'To validate JSON',
              'To format JSON'
            ],
            correct: 1,
            explanation: 'JSON.stringify() converts JavaScript objects into JSON strings for storage or transmission.'
          },
          {
            question: 'What is the scope of a variable declared with let inside a block?',
            options: ['Global scope', 'Function scope', 'Block scope', 'Module scope'],
            correct: 2,
            explanation: 'Variables declared with let have block scope, meaning they are only accessible within the block they are declared in.'
          },
          {
            question: 'Which method is used to iterate over array elements?',
            options: ['forEach()', 'iterate()', 'loop()', 'each()'],
            correct: 0,
            explanation: 'The forEach() method executes a provided function once for each array element.'
          },
          {
            question: 'What happens when you try to access a property that doesn\'t exist on an object?',
            options: ['Error is thrown', 'Returns undefined', 'Returns null', 'Returns false'],
            correct: 1,
            explanation: 'Accessing a non-existent property on an object returns undefined in JavaScript.'
          }
        ],
        3: [ // Intermediate Level 3 - Promises & Modern Features
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
          },
          {
            question: 'Which method is used to combine multiple arrays?',
            options: ['join()', 'concat()', 'merge()', 'combine()'],
            correct: 1,
            explanation: 'The concat() method is used to merge two or more arrays and returns a new array.'
          },
          {
            question: 'What is the purpose of the filter() method?',
            options: [
              'To modify array elements',
              'To create a new array with elements that pass a test',
              'To sort array elements',
              'To find a single element'
            ],
            correct: 1,
            explanation: 'The filter() method creates a new array with all elements that pass the test implemented by the provided function.'
          },
          {
            question: 'What is a template literal in JavaScript?',
            options: [
              'A string enclosed in backticks that allows embedded expressions',
              'A predefined string template',
              'A method to create HTML templates',
              'A way to define string constants'
            ],
            correct: 0,
            explanation: 'Template literals are string literals enclosed in backticks (`) that allow embedded expressions using ${}.'
          },
          {
            question: 'What does the reduce() method do?',
            options: [
              'Reduces array size',
              'Executes a reducer function on each element to produce a single value',
              'Removes elements from array',
              'Sorts array elements'
            ],
            correct: 1,
            explanation: 'The reduce() method executes a reducer function on each element of the array, resulting in a single output value.'
          },
          {
            question: 'How do you handle errors in Promises?',
            options: ['try/catch', 'catch() method', 'error() method', 'Both try/catch and catch() method'],
            correct: 3,
            explanation: 'Promise errors can be handled using the catch() method or try/catch blocks with async/await.'
          }
        ],
        4: [ // Advanced Level 4 - Advanced Patterns & APIs
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
          },
          {
            question: 'What is the purpose of Object.freeze()?',
            options: [
              'To stop object execution',
              'To make an object immutable',
              'To copy an object',
              'To delete object properties'
            ],
            correct: 1,
            explanation: 'Object.freeze() makes an object immutable, preventing new properties from being added and existing properties from being modified.'
          },
          {
            question: 'What is the difference between Map and Object?',
            options: [
              'No difference',
              'Map can have any type of keys, Object keys are strings/symbols',
              'Object can have any type of keys, Map keys are strings',
              'Map is older than Object'
            ],
            correct: 1,
            explanation: 'Map can have keys of any type, while Object keys are limited to strings and symbols. Map also maintains insertion order.'
          },
          {
            question: 'What is the purpose of the bind() method?',
            options: [
              'To combine two functions',
              'To create a new function with a specific "this" value',
              'To execute a function immediately',
              'To copy a function'
            ],
            correct: 1,
            explanation: 'The bind() method creates a new function with a specific "this" value and optionally pre-filled arguments.'
          },
          {
            question: 'What is a Set in JavaScript?',
            options: [
              'A collection of unique values',
              'A type of array',
              'A mathematical set operation',
              'A way to set variables'
            ],
            correct: 0,
            explanation: 'Set is a collection object that stores unique values of any type, whether primitive values or object references.'
          },
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
          }
        ],
        5: [ // Advanced Level 5 - Expert Concepts & Modern APIs
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
          },
          {
            question: 'What is the nullish coalescing operator (??)?',
            options: [
              'An operator that checks for null values',
              'An operator that returns the right operand when left is null or undefined',
              'An operator that creates null values',
              'An operator that removes null values'
            ],
            correct: 1,
            explanation: 'The nullish coalescing operator (??) returns the right operand when the left operand is null or undefined.'
          },
          {
            question: 'What is the purpose of WeakSet?',
            options: [
              'A set with weak references to objects',
              'A smaller version of Set',
              'A set that can be easily deleted',
              'A set with limited functionality'
            ],
            correct: 0,
            explanation: 'WeakSet holds weak references to objects, allowing garbage collection when there are no other references to the objects.'
          },
          {
            question: 'What is the purpose of the Atomics object?',
            options: [
              'To create atomic elements',
              'To provide atomic operations on SharedArrayBuffer',
              'To handle atomic data types',
              'To create atomic functions'
            ],
            correct: 1,
            explanation: 'Atomics provides atomic operations on SharedArrayBuffer objects, useful for multi-threaded programming with Web Workers.'
          },
          {
            question: 'What is a private field in JavaScript classes?',
            options: [
              'A field that cannot be accessed',
              'A field prefixed with # that is only accessible within the class',
              'A field that is automatically private',
              'A field that requires special permissions'
            ],
            correct: 1,
            explanation: 'Private fields are prefixed with # and can only be accessed from within the class that declares them.'
          },
          {
            question: 'What is the purpose of the AbortController?',
            options: [
              'To abort JavaScript execution',
              'To cancel asynchronous operations like fetch requests',
              'To control browser navigation',
              'To abort function calls'
            ],
            correct: 1,
            explanation: 'AbortController provides a way to abort asynchronous operations like fetch requests or other DOM operations.'
          },
          {
            question: 'What is the top-level await feature?',
            options: [
              'Using await in any function',
              'Using await at the module level without async function',
              'Using await at the top of files',
              'Using await in global scope'
            ],
            correct: 1,
            explanation: 'Top-level await allows you to use await at the module level without wrapping it in an async function.'
          }
        ]
      },
      'Python': {
        0: [ // Beginner Level 0 - Basic Syntax
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
          },
          {
            question: 'What is the result of 10 / 3 in Python 3?',
            options: ['3', '3.33', '3.3333333333333335', '10/3'],
            correct: 2,
            explanation: 'In Python 3, the / operator performs true division and returns a float.'
          },
          {
            question: 'How do you create a string in Python?',
            options: ['"Hello"', "'Hello'", '"""Hello"""', 'All of the above'],
            correct: 3,
            explanation: 'Python supports single quotes, double quotes, and triple quotes for creating strings.'
          },
          {
            question: 'What is the correct way to check if a variable x equals 5?',
            options: ['if x = 5:', 'if x == 5:', 'if x === 5:', 'if (x == 5):'],
            correct: 1,
            explanation: 'Python uses == for equality comparison and requires a colon after the condition.'
          },
          {
            question: 'Which keyword is used to create a function in Python?',
            options: ['function', 'def', 'func', 'define'],
            correct: 1,
            explanation: 'Python functions are defined using the "def" keyword.'
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
        ],
        1: [ // Beginner Level 1 - Data Structures & Control Flow
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
            question: 'How do you create a dictionary in Python?',
            options: ['{}', '[]', '()', 'dict()'],
            correct: 0,
            explanation: 'Dictionaries in Python are created using curly braces {} or the dict() constructor.'
          },
          {
            question: 'What is the correct way to create a for loop in Python?',
            options: ['for i in range(5):', 'for (i = 0; i < 5; i++):', 'for i = 1 to 5:', 'for i in 1..5:'],
            correct: 0,
            explanation: 'Python for loops use the "for variable in iterable:" syntax.'
          },
          {
            question: 'Which method removes an item from a list by value?',
            options: ['delete()', 'remove()', 'pop()', 'discard()'],
            correct: 1,
            explanation: 'The remove() method removes the first occurrence of a specified value from a list.'
          },
          {
            question: 'What is the result of len("Hello")?',
            options: ['4', '5', '6', 'Error'],
            correct: 1,
            explanation: 'The len() function returns the number of characters in a string. "Hello" has 5 characters.'
          },
          {
            question: 'How do you access the first element of a list named "my_list"?',
            options: ['my_list[1]', 'my_list[0]', 'my_list.first()', 'my_list.get(0)'],
            correct: 1,
            explanation: 'Python uses zero-based indexing, so the first element is accessed with index 0.'
          },
          {
            question: 'What is the correct way to create a while loop in Python?',
            options: ['while (condition):', 'while condition:', 'while condition do:', 'while condition then:'],
            correct: 1,
            explanation: 'Python while loops use the syntax "while condition:" followed by an indented code block.'
          },
          {
            question: 'Which operator is used for exponentiation in Python?',
            options: ['^', '**', 'pow', 'exp'],
            correct: 1,
            explanation: 'Python uses ** for exponentiation. For example, 2**3 equals 8.'
          }
        ],
        2: [ // Intermediate Level 2 - Functions & Modules
          {
            question: 'What is a lambda function in Python?',
            options: [
              'A named function',
              'An anonymous function',
              'A recursive function',
              'A built-in function'
            ],
            correct: 1,
            explanation: 'Lambda functions are anonymous functions that can be defined inline using the lambda keyword.'
          },
          {
            question: 'How do you import a specific function from a module?',
            options: [
              'import module.function',
              'from module import function',
              'import function from module',
              'include module.function'
            ],
            correct: 1,
            explanation: 'Use "from module import function" to import a specific function from a module.'
          },
          {
            question: 'What is the purpose of the __init__ method in a Python class?',
            options: [
              'To initialize class variables',
              'To create the class',
              'To destroy the object',
              'To define class methods'
            ],
            correct: 0,
            explanation: 'The __init__ method is the constructor that initializes object attributes when an instance is created.'
          },
          {
            question: 'What is list comprehension in Python?',
            options: [
              'A way to understand lists',
              'A concise way to create lists',
              'A method to compress lists',
              'A way to document lists'
            ],
            correct: 1,
            explanation: 'List comprehension provides a concise way to create lists based on existing lists or other iterables.'
          },
          {
            question: 'What does the "self" parameter represent in a class method?',
            options: [
              'The class itself',
              'The instance of the class',
              'The parent class',
              'A static reference'
            ],
            correct: 1,
            explanation: 'The "self" parameter refers to the instance of the class and is used to access instance variables and methods.'
          },
          {
            question: 'How do you handle exceptions in Python?',
            options: ['try/catch', 'try/except', 'catch/finally', 'handle/error'],
            correct: 1,
            explanation: 'Python uses try/except blocks to handle exceptions, with optional else and finally clauses.'
          },
          {
            question: 'What is the difference between "is" and "==" in Python?',
            options: [
              'No difference',
              '"is" checks identity, "==" checks equality',
              '"==" checks identity, "is" checks equality',
              'Both check identity'
            ],
            correct: 1,
            explanation: '"is" checks if two variables refer to the same object, while "==" checks if the values are equal.'
          },
          {
            question: 'What is a generator in Python?',
            options: [
              'A function that creates other functions',
              'A function that yields values one at a time',
              'A random number generator',
              'A code generator tool'
            ],
            correct: 1,
            explanation: 'Generators are functions that yield values one at a time, allowing for memory-efficient iteration.'
          },
          {
            question: 'How do you create a virtual environment in Python?',
            options: ['pip install venv', 'python -m venv env_name', 'create-env env_name', 'virtualenv only'],
            correct: 1,
            explanation: 'python -m venv env_name is the standard way to create virtual environments in Python 3.3+.'
          },
          {
            question: 'What is the purpose of the "with" statement in Python?',
            options: [
              'To create variables',
              'To ensure proper resource management',
              'To create loops',
              'To define functions'
            ],
            correct: 1,
            explanation: 'The "with" statement ensures proper acquisition and release of resources, commonly used with file operations.'
          }
        ],
        3: [ // Intermediate Level 3 - Advanced Data Structures & OOP
          {
            question: 'What is the difference between a shallow copy and a deep copy?',
            options: [
              'No difference',
              'Shallow copy copies references, deep copy copies objects',
              'Deep copy copies references, shallow copy copies objects',
              'Both copy references'
            ],
            correct: 1,
            explanation: 'Shallow copy creates a new object but inserts references to objects in the original, while deep copy creates completely independent copies.'
          },
          {
            question: 'What is method overriding in Python?',
            options: [
              'Creating multiple methods with same name',
              'Redefining a parent class method in a child class',
              'Calling multiple methods at once',
              'Deleting methods'
            ],
            correct: 1,
            explanation: 'Method overriding allows a child class to provide a specific implementation of a method defined in its parent class.'
          },
          {
            question: 'What is the purpose of *args in a function definition?',
            options: [
              'To pass keyword arguments',
              'To pass a variable number of positional arguments',
              'To pass default arguments',
              'To pass required arguments'
            ],
            correct: 1,
            explanation: '*args allows a function to accept any number of positional arguments as a tuple.'
          },
          {
            question: 'What is the purpose of **kwargs in a function definition?',
            options: [
              'To pass positional arguments',
              'To pass a variable number of keyword arguments',
              'To pass default arguments',
              'To pass required arguments'
            ],
            correct: 1,
            explanation: '**kwargs allows a function to accept any number of keyword arguments as a dictionary.'
          },
          {
            question: 'What is a decorator in Python?',
            options: [
              'A way to decorate code with comments',
              'A function that modifies or extends another function',
              'A design pattern',
              'A way to format output'
            ],
            correct: 1,
            explanation: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it.'
          },
          {
            question: 'What is the difference between a set and a list in Python?',
            options: [
              'Sets are ordered, lists are not',
              'Sets contain unique elements, lists can have duplicates',
              'Lists are faster than sets',
              'No difference'
            ],
            correct: 1,
            explanation: 'Sets automatically handle uniqueness and are unordered, while lists maintain order and allow duplicates.'
          },
          {
            question: 'What is multiple inheritance in Python?',
            options: [
              'A class inheriting from multiple objects',
              'A class inheriting from multiple parent classes',
              'Multiple classes inheriting from one parent',
              'Creating multiple instances of a class'
            ],
            correct: 1,
            explanation: 'Multiple inheritance allows a class to inherit attributes and methods from multiple parent classes.'
          },
          {
            question: 'What is the purpose of the @property decorator?',
            options: [
              'To create class properties',
              'To make methods behave like attributes',
              'To protect attributes',
              'To create static methods'
            ],
            correct: 1,
            explanation: 'The @property decorator allows methods to be accessed like attributes, providing getter functionality.'
          },
          {
            question: 'What is a context manager in Python?',
            options: [
              'A manager for contexts',
              'An object that defines methods for use with "with" statement',
              'A memory manager',
              'A file manager'
            ],
            correct: 1,
            explanation: 'A context manager is an object that defines methods to be used with the "with" statement for resource management.'
          },
          {
            question: 'What is the difference between append() and extend() for lists?',
            options: [
              'No difference',
              'append() adds single element, extend() adds multiple elements',
              'extend() adds single element, append() adds multiple elements',
              'Both add single elements'
            ],
            correct: 1,
            explanation: 'append() adds a single element to the end of a list, while extend() adds all elements from an iterable.'
          }
        ],
        4: [ // Advanced Level 4 - Advanced Concepts & Libraries
          {
            question: 'What is the Global Interpreter Lock (GIL) in Python?',
            options: [
              'A lock for global variables',
              'A mechanism that prevents multiple threads from executing Python code simultaneously',
              'A security feature',
              'A memory management tool'
            ],
            correct: 1,
            explanation: 'The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously.'
          },
          {
            question: 'What is the difference between multiprocessing and multithreading in Python?',
            options: [
              'No difference',
              'Multiprocessing uses separate processes, multithreading uses threads within a process',
              'Multithreading uses separate processes, multiprocessing uses threads',
              'Both use the same mechanism'
            ],
            correct: 1,
            explanation: 'Multiprocessing creates separate processes that can run in parallel, while multithreading creates threads within a single process.'
          },
          {
            question: 'What is a metaclass in Python?',
            options: [
              'A class that inherits from multiple classes',
              'A class whose instances are classes',
              'A class with meta information',
              'A class that cannot be instantiated'
            ],
            correct: 1,
            explanation: 'A metaclass is a class whose instances are classes themselves, controlling how classes are created.'
          },
          {
            question: 'What is the purpose of the __slots__ attribute?',
            options: [
              'To create time slots',
              'To restrict attribute creation and save memory',
              'To create method slots',
              'To define class hierarchy'
            ],
            correct: 1,
            explanation: '__slots__ restricts the attributes that can be created for instances and can save memory by avoiding __dict__.'
          },
          {
            question: 'What is monkey patching in Python?',
            options: [
              'Patching code like a monkey',
              'Dynamically modifying classes or modules at runtime',
              'A debugging technique',
              'A testing methodology'
            ],
            correct: 1,
            explanation: 'Monkey patching is the practice of dynamically modifying classes or modules at runtime.'
          },
          {
            question: 'What is the difference between @staticmethod and @classmethod?',
            options: [
              'No difference',
              '@staticmethod doesn\'t receive class/instance, @classmethod receives class',
              '@classmethod doesn\'t receive class/instance, @staticmethod receives class',
              'Both receive the same parameters'
            ],
            correct: 1,
            explanation: '@staticmethod doesn\'t receive any implicit first argument, while @classmethod receives the class as the first argument.'
          },
          {
            question: 'What is a descriptor in Python?',
            options: [
              'A way to describe objects',
              'An object that defines how attribute access is handled',
              'A documentation tool',
              'A type annotation'
            ],
            correct: 1,
            explanation: 'A descriptor is an object that defines how attribute access is handled through __get__, __set__, and __delete__ methods.'
          },
          {
            question: 'What is the purpose of the asyncio library?',
            options: [
              'To handle synchronous operations',
              'To write asynchronous, concurrent code',
              'To create async functions only',
              'To manage threads'
            ],
            correct: 1,
            explanation: 'asyncio is a library for writing asynchronous, concurrent code using async/await syntax and event loops.'
          },
          {
            question: 'What is the difference between yield and return?',
            options: [
              'No difference',
              'yield creates a generator, return ends function execution',
              'return creates a generator, yield ends function execution',
              'Both end function execution'
            ],
            correct: 1,
            explanation: 'yield creates a generator that can be resumed, while return ends function execution and returns a value.'
          },
          {
            question: 'What is the purpose of the collections module?',
            options: [
              'To collect garbage',
              'To provide specialized container datatypes',
              'To manage collections of files',
              'To create collections of functions'
            ],
            correct: 1,
            explanation: 'The collections module provides specialized container datatypes like namedtuple, deque, Counter, etc.'
          }
        ],
        5: [ // Expert Level 5 - Expert Concepts & Performance
          {
            question: 'What is the difference between CPython, PyPy, and Jython?',
            options: [
              'They are all the same',
              'Different implementations of Python with different performance characteristics',
              'Different versions of Python',
              'Different Python libraries'
            ],
            correct: 1,
            explanation: 'CPython is the standard implementation, PyPy uses JIT compilation for speed, and Jython runs on the JVM.'
          },
          {
            question: 'What is the purpose of the __new__ method?',
            options: [
              'To create new variables',
              'To control object creation before __init__',
              'To create new methods',
              'To update objects'
            ],
            correct: 1,
            explanation: '__new__ is responsible for creating and returning a new instance of a class, called before __init__.'
          },
          {
            question: 'What is memory profiling and why is it important?',
            options: [
              'Profiling user memories',
              'Analyzing memory usage to optimize performance and detect leaks',
              'Creating memory backups',
              'Managing memory allocation'
            ],
            correct: 1,
            explanation: 'Memory profiling analyzes how much memory your program uses and helps identify memory leaks and optimization opportunities.'
          },
          {
            question: 'What is the difference between is and == when comparing None?',
            options: [
              'No difference',
              'Use "is None" for None comparison, == for value comparison',
              'Use "== None" for None comparison, is for value comparison',
              'Both are equally good'
            ],
            correct: 1,
            explanation: 'Use "is None" when checking for None because None is a singleton, and "is" checks identity which is more appropriate.'
          },
          {
            question: 'What is the purpose of the weakref module?',
            options: [
              'To create weak references that don\'t prevent garbage collection',
              'To create weak variables',
              'To handle weak network connections',
              'To create temporary references'
            ],
            correct: 0,
            explanation: 'weakref allows you to create references to objects that don\'t prevent the object from being garbage collected.'
          },
          {
            question: 'What is the difference between __str__ and __repr__?',
            options: [
              'No difference',
              '__str__ for human-readable output, __repr__ for developer representation',
              '__repr__ for human-readable output, __str__ for developer representation',
              'Both serve the same purpose'
            ],
            correct: 1,
            explanation: '__str__ should return a human-readable string, while __repr__ should return an unambiguous representation for developers.'
          },
          {
            question: 'What is the purpose of the dis module?',
            options: [
              'To disable modules',
              'To disassemble Python bytecode',
              'To distribute modules',
              'To disconnect from services'
            ],
            correct: 1,
            explanation: 'The dis module provides functions to analyze and disassemble Python bytecode for debugging and optimization.'
          },
          {
            question: 'What is the difference between bound and unbound methods?',
            options: [
              'Bound methods are tied to an instance, unbound methods are not',
              'Unbound methods are tied to an instance, bound methods are not',
              'No difference in Python 3',
              'Both are the same'
            ],
            correct: 0,
            explanation: 'Bound methods are associated with an instance and automatically pass self, while unbound methods (Python 2 concept) are not tied to instances.'
          },
          {
            question: 'What is the purpose of the __call__ method?',
            options: [
              'To call other methods',
              'To make objects callable like functions',
              'To handle phone calls',
              'To call parent methods'
            ],
            correct: 1,
            explanation: 'The __call__ method allows objects to be called like functions using the () operator.'
          },
          {
            question: 'What is the difference between shallow and deep copying with respect to nested objects?',
            options: [
              'Shallow copy copies all levels, deep copy copies one level',
              'Deep copy copies all levels recursively, shallow copy copies one level',
              'No difference',
              'Both copy all levels'
            ],
            correct: 1,
            explanation: 'Deep copy recursively copies all nested objects, while shallow copy only copies the top level, sharing references to nested objects.'
          }
        ]
      },
      'React': {
        0: [ // Beginner Level 0 - React Basics
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
          },
          {
            question: 'What is the correct way to import React?',
            options: [
              'import React from "react"',
              'include React from "react"',
              'require React from "react"',
              'import { React } from "react"'
            ],
            correct: 0,
            explanation: 'React is imported as a default export using import React from "react".'
          },
          {
            question: 'How do you render a React component to the DOM?',
            options: [
              'ReactDOM.render()',
              'React.render()',
              'document.render()',
              'component.render()'
            ],
            correct: 0,
            explanation: 'ReactDOM.render() is used to render React components to the DOM (React 17 and earlier).'
          },
          {
            question: 'What is the file extension typically used for React components?',
            options: ['.js', '.jsx', '.react', 'Both .js and .jsx'],
            correct: 3,
            explanation: 'React components can use either .js or .jsx extensions, though .jsx is more descriptive for JSX content.'
          },
          {
            question: 'What must every React component return?',
            options: ['A string', 'JSX or null', 'An object', 'A number'],
            correct: 1,
            explanation: 'React components must return JSX elements, null, or other valid React elements.'
          },
          {
            question: 'How do you add CSS classes to JSX elements?',
            options: ['class="my-class"', 'className="my-class"', 'cssClass="my-class"', 'style="my-class"'],
            correct: 1,
            explanation: 'In JSX, you use className instead of class to add CSS classes because class is a reserved word in JavaScript.'
          }
        ],
        1: [ // Beginner Level 1 - State & Events
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
            question: 'What happens when state changes in React?',
            options: [
              'Nothing happens',
              'The component re-renders',
              'The page refreshes',
              'The application restarts'
            ],
            correct: 1,
            explanation: 'When state changes, React re-renders the component to reflect the new state.'
          },
          {
            question: 'How do you prevent the default behavior of an event in React?',
            options: [
              'event.preventDefault()',
              'event.stopDefault()',
              'event.prevent()',
              'return false'
            ],
            correct: 0,
            explanation: 'Use event.preventDefault() to prevent the default behavior of an event in React.'
          },
          {
            question: 'What is the correct way to handle form input in React?',
            options: [
              'Using refs only',
              'Using controlled components with state',
              'Using jQuery',
              'Using vanilla JavaScript'
            ],
            correct: 1,
            explanation: 'Controlled components use React state to manage form input values, providing better control and validation.'
          },
          {
            question: 'How do you pass a parameter to an event handler?',
            options: [
              'onClick={handleClick(param)}',
              'onClick={() => handleClick(param)}',
              'onClick={handleClick.bind(param)}',
              'onClick={handleClick, param}'
            ],
            correct: 1,
            explanation: 'Use an arrow function to pass parameters to event handlers: onClick={() => handleClick(param)}.'
          }
        ],
        2: [ // Intermediate Level 2 - Component Lifecycle & Advanced Hooks
          {
            question: 'What is the dependency array in useEffect?',
            options: [
              'An array of components',
              'An array of values that determine when the effect runs',
              'An array of functions',
              'An array of props'
            ],
            correct: 1,
            explanation: 'The dependency array tells useEffect when to run by comparing the values in the array between renders.'
          },
          {
            question: 'What happens if you omit the dependency array in useEffect?',
            options: [
              'The effect never runs',
              'The effect runs on every render',
              'The effect runs once',
              'An error occurs'
            ],
            correct: 1,
            explanation: 'Without a dependency array, useEffect runs after every render, which can cause performance issues.'
          },
          {
            question: 'How do you clean up side effects in useEffect?',
            options: [
              'Use a cleanup function',
              'Return a function from useEffect',
              'Use useCleanup hook',
              'Both A and B'
            ],
            correct: 3,
            explanation: 'Return a cleanup function from useEffect to clean up side effects like subscriptions or timers.'
          },
          {
            question: 'What is the useContext hook used for?',
            options: [
              'To create context',
              'To consume context values',
              'To update context',
              'To delete context'
            ],
            correct: 1,
            explanation: 'useContext is used to consume values from a React context without wrapping components in Consumer.'
          },
          {
            question: 'What is prop drilling?',
            options: [
              'Drilling holes in props',
              'Passing props through multiple component levels',
              'Creating props dynamically',
              'Validating props'
            ],
            correct: 1,
            explanation: 'Prop drilling is passing props through multiple component levels to reach deeply nested components.'
          },
          {
            question: 'How do you optimize performance in React?',
            options: [
              'Using React.memo',
              'Using useMemo and useCallback',
              'Avoiding unnecessary re-renders',
              'All of the above'
            ],
            correct: 3,
            explanation: 'React performance can be optimized using React.memo, useMemo, useCallback, and avoiding unnecessary re-renders.'
          },
          {
            question: 'What is the purpose of React.memo?',
            options: [
              'To memorize components',
              'To prevent unnecessary re-renders of functional components',
              'To store component state',
              'To create memoized functions'
            ],
            correct: 1,
            explanation: 'React.memo is a higher-order component that prevents re-renders if props haven\'t changed.'
          },
          {
            question: 'What is the difference between useMemo and useCallback?',
            options: [
              'No difference',
              'useMemo memoizes values, useCallback memoizes functions',
              'useCallback memoizes values, useMemo memoizes functions',
              'Both memoize the same things'
            ],
            correct: 1,
            explanation: 'useMemo memoizes computed values, while useCallback memoizes function references.'
          },
          {
            question: 'What is a custom hook?',
            options: [
              'A hook provided by React',
              'A reusable function that uses React hooks',
              'A hook for customizing components',
              'A hook for styling'
            ],
            correct: 1,
            explanation: 'Custom hooks are reusable functions that use React hooks to encapsulate stateful logic.'
          },
          {
            question: 'How do you share state between components?',
            options: [
              'Using props',
              'Using context',
              'Lifting state up',
              'All of the above'
            ],
            correct: 3,
            explanation: 'State can be shared through props, context, or by lifting state up to a common parent component.'
          }
        ],
        3: [ // Intermediate Level 3 - Advanced Patterns & State Management
          {
            question: 'What is the useReducer hook used for?',
            options: [
              'To reduce component size',
              'To manage complex state logic',
              'To reduce re-renders',
              'To reduce bundle size'
            ],
            correct: 1,
            explanation: 'useReducer is used for managing complex state logic, especially when state updates depend on previous state.'
          },
          {
            question: 'What is a higher-order component (HOC)?',
            options: [
              'A component with high priority',
              'A function that takes a component and returns a new component',
              'A component at the top of the tree',
              'A component with many props'
            ],
            correct: 1,
            explanation: 'A HOC is a function that takes a component and returns a new component with additional functionality.'
          },
          {
            question: 'What is the render prop pattern?',
            options: [
              'A prop that renders components',
              'A technique for sharing code using a prop whose value is a function',
              'A way to render props',
              'A method to optimize rendering'
            ],
            correct: 1,
            explanation: 'Render props is a technique for sharing code between components using a prop whose value is a function.'
          },
          {
            question: 'What is React.Fragment used for?',
            options: [
              'To fragment components',
              'To group multiple elements without adding extra DOM nodes',
              'To create fragments of code',
              'To break components'
            ],
            correct: 1,
            explanation: 'React.Fragment allows you to group multiple elements without adding an extra DOM node.'
          },
          {
            question: 'What is the purpose of the key prop in React?',
            options: [
              'To unlock components',
              'To help React identify which items have changed in lists',
              'To create unique components',
              'To encrypt component data'
            ],
            correct: 1,
            explanation: 'The key prop helps React identify which items have changed, are added, or removed in lists for efficient updates.'
          },
          {
            question: 'What is lazy loading in React?',
            options: [
              'Loading components slowly',
              'Loading components only when needed',
              'Loading components lazily',
              'Delaying component loading'
            ],
            correct: 1,
            explanation: 'Lazy loading loads components only when they are needed, improving initial load performance.'
          },
          {
            question: 'How do you implement lazy loading in React?',
            options: [
              'React.lazy() and Suspense',
              'import() and Suspense',
              'lazy() and Loading',
              'Both A and B'
            ],
            correct: 3,
            explanation: 'Lazy loading is implemented using React.lazy() with dynamic import() and Suspense for loading states.'
          },
          {
            question: 'What is the purpose of Suspense in React?',
            options: [
              'To create suspenseful UIs',
              'To handle loading states for lazy components',
              'To suspend component rendering',
              'To create animations'
            ],
            correct: 1,
            explanation: 'Suspense provides a way to handle loading states while waiting for lazy components to load.'
          },
          {
            question: 'What is the difference between controlled and uncontrolled components?',
            options: [
              'Controlled components use state, uncontrolled use refs',
              'Uncontrolled components use state, controlled use refs',
              'No difference',
              'Both use the same approach'
            ],
            correct: 0,
            explanation: 'Controlled components use React state to manage form data, while uncontrolled components use refs to access DOM values.'
          },
          {
            question: 'What is the purpose of useRef hook?',
            options: [
              'To create references to DOM elements',
              'To store mutable values that persist across renders',
              'To access child component methods',
              'All of the above'
            ],
            correct: 3,
            explanation: 'useRef can create DOM references, store mutable values, and access child component methods.'
          }
        ],
        4: [ // Advanced Level 4 - Performance & Advanced Concepts
          {
            question: 'What is React Fiber?',
            options: [
              'A type of React component',
              'React\'s reconciliation algorithm',
              'A React library',
              'A performance tool'
            ],
            correct: 1,
            explanation: 'React Fiber is the reconciliation algorithm that enables features like time slicing and concurrent rendering.'
          },
          {
            question: 'What is concurrent rendering in React?',
            options: [
              'Rendering multiple components at once',
              'React\'s ability to interrupt and resume rendering work',
              'Rendering components concurrently',
              'Parallel component rendering'
            ],
            correct: 1,
            explanation: 'Concurrent rendering allows React to interrupt and resume rendering work to keep the app responsive.'
          },
          {
            question: 'What is the purpose of React.StrictMode?',
            options: [
              'To enforce strict coding standards',
              'To help identify potential problems in development',
              'To improve performance',
              'To enable strict type checking'
            ],
            correct: 1,
            explanation: 'StrictMode helps identify potential problems by intentionally double-invoking functions and highlighting issues.'
          },
          {
            question: 'What is the difference between React.memo and useMemo?',
            options: [
              'React.memo memoizes components, useMemo memoizes values',
              'useMemo memoizes components, React.memo memoizes values',
              'No difference',
              'Both memoize components'
            ],
            correct: 0,
            explanation: 'React.memo memoizes entire components, while useMemo memoizes computed values within components.'
          },
          {
            question: 'What is the purpose of the useLayoutEffect hook?',
            options: [
              'To create layouts',
              'To run effects synchronously after DOM mutations',
              'To optimize layout performance',
              'To handle layout changes'
            ],
            correct: 1,
            explanation: 'useLayoutEffect runs synchronously after all DOM mutations, useful for measuring DOM elements.'
          },
          {
            question: 'What is React Server Components?',
            options: [
              'Components that run on the server',
              'Components for server-side rendering',
              'Components that fetch server data',
              'Server-side React components'
            ],
            correct: 0,
            explanation: 'React Server Components run on the server and can directly access server resources without client-side JavaScript.'
          },
          {
            question: 'What is the purpose of the useImperativeHandle hook?',
            options: [
              'To handle imperative code',
              'To customize the instance value exposed by ref',
              'To create imperative APIs',
              'To handle imperative updates'
            ],
            correct: 1,
            explanation: 'useImperativeHandle customizes the instance value that is exposed to parent components when using ref.'
          },
          {
            question: 'What is React\'s reconciliation process?',
            options: [
              'The process of reconciling differences',
              'The algorithm React uses to diff and update the DOM',
              'The process of component reconciliation',
              'The method to reconcile state'
            ],
            correct: 1,
            explanation: 'Reconciliation is React\'s algorithm for determining what changes need to be made to update the DOM efficiently.'
          },
          {
            question: 'What is the purpose of React DevTools?',
            options: [
              'To develop React apps',
              'To debug and profile React applications',
              'To create React tools',
              'To deploy React apps'
            ],
            correct: 1,
            explanation: 'React DevTools is a browser extension for debugging React component hierarchies and performance profiling.'
          },
          {
            question: 'What is the difference between shallow and deep comparison in React?',
            options: [
              'Shallow compares references, deep compares values recursively',
              'Deep compares references, shallow compares values',
              'No difference',
              'Both compare the same way'
            ],
            correct: 0,
            explanation: 'Shallow comparison checks if references are the same, while deep comparison recursively checks all nested values.'
          }
        ],
        5: [ // Expert Level 5 - Expert Patterns & Architecture
          {
            question: 'What is the purpose of React.startTransition?',
            options: [
              'To start component transitions',
              'To mark updates as non-urgent for better user experience',
              'To create transition animations',
              'To transition between routes'
            ],
            correct: 1,
            explanation: 'startTransition marks updates as non-urgent, allowing React to prioritize more urgent updates for better UX.'
          },
          {
            question: 'What is the useDeferredValue hook used for?',
            options: [
              'To defer value updates',
              'To defer expensive computations until more urgent updates complete',
              'To create deferred values',
              'To delay value changes'
            ],
            correct: 1,
            explanation: 'useDeferredValue defers updates to less critical parts of the UI until more urgent updates are complete.'
          },
          {
            question: 'What is the purpose of React.unstable_batchedUpdates?',
            options: [
              'To batch component updates',
              'To group multiple state updates into a single re-render',
              'To create update batches',
              'To optimize update performance'
            ],
            correct: 1,
            explanation: 'batchedUpdates groups multiple state updates into a single re-render for better performance.'
          },
          {
            question: 'What is the difference between React 17 and React 18 event handling?',
            options: [
              'No difference',
              'React 18 uses automatic batching for all updates',
              'React 17 uses automatic batching for all updates',
              'Both handle events the same way'
            ],
            correct: 1,
            explanation: 'React 18 introduces automatic batching for all updates, including those in promises, timeouts, and native event handlers.'
          },
          {
            question: 'What is the purpose of the useId hook?',
            options: [
              'To create unique IDs',
              'To generate stable unique IDs for accessibility attributes',
              'To identify components',
              'To create ID references'
            ],
            correct: 1,
            explanation: 'useId generates stable unique IDs that are consistent between server and client for accessibility attributes.'
          },
          {
            question: 'What is React\'s time slicing feature?',
            options: [
              'Slicing time for components',
              'Breaking rendering work into chunks to maintain responsiveness',
              'Creating time-based slices',
              'Optimizing time-based operations'
            ],
            correct: 1,
            explanation: 'Time slicing breaks rendering work into small chunks, allowing React to pause and resume work to keep the app responsive.'
          },
          {
            question: 'What is the purpose of React.unstable_act in testing?',
            options: [
              'To act on components',
              'To ensure all updates are flushed before assertions',
              'To create test actions',
              'To simulate user actions'
            ],
            correct: 1,
            explanation: 'act ensures that all updates related to state changes are flushed before making assertions in tests.'
          },
          {
            question: 'What is the difference between React.createElement and JSX?',
            options: [
              'JSX is compiled to React.createElement calls',
              'React.createElement is compiled to JSX',
              'No difference',
              'They serve different purposes'
            ],
            correct: 0,
            explanation: 'JSX is syntactic sugar that gets compiled to React.createElement calls by build tools like Babel.'
          },
          {
            question: 'What is the purpose of React.cloneElement?',
            options: [
              'To clone React elements',
              'To clone elements with new props',
              'To duplicate components',
              'To copy element references'
            ],
            correct: 1,
            explanation: 'React.cloneElement creates a copy of a React element with new props, useful for modifying children elements.'
          },
          {
            question: 'What is the React Profiler API used for?',
            options: [
              'To profile user behavior',
              'To measure rendering performance programmatically',
              'To create performance profiles',
              'To profile component usage'
            ],
            correct: 1,
            explanation: 'The Profiler API allows you to measure rendering performance programmatically and collect timing information.'
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
      questionCount: 10, // Generate exactly 10 questions per level
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