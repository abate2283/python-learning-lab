window.LESSONS = [
  {
    id: "string-variables",
    number: 1,
    title: "String Variables",
    description: "Store and work with text in Python.",
    status: "available",
    concept: {
      title: "What is a string?",
      body: "A <strong>string</strong> is text. In Python, text is surrounded by quotation marks.",
      code: 'first_name = "Daniel"',
      callout: '<strong>Notice:</strong> <code>first_name</code> is the variable name and <code>"Daniel"</code> is the string value.'
    },
    example: {
      title: "See it in action",
      body: "Python can store a string in a variable and print it later.",
      code: 'greeting = "Hello"\nname = "Daniel"\n\nprint(greeting)\nprint(name)',
      output: "Hello\nDaniel"
    },
    practice: {
      title: "Practice: create a string variable",
      prompt: 'Create a variable named <code>favorite_food</code>, set it equal to a string, then print it.',
      hint: 'Example idea: <code>favorite_food = "Pizza"</code>',
      starterCode: 'favorite_food = "Pizza"\nprint(favorite_food)',
      requirements: [
        { name: "favorite_food", type: "str", nonEmpty: true }
      ],
      mustPrint: ["favorite_food"],
      success: 'Excellent! You created <code>favorite_food</code>, stored a string in it, and printed the value.'
    },
    challenge: {
      title: "Mini challenge",
      prompt: 'Create two string variables named <code>first_name</code> and <code>city</code>. Then print both values.',
      starterCode: 'first_name = ""\ncity = ""\n\nprint(first_name)\nprint(city)',
      hint: 'Put text inside the quotation marks, for example: <code>first_name = "Daniel"</code>.',
      requirements: [
        { name: "first_name", type: "str", nonEmpty: true },
        { name: "city", type: "str", nonEmpty: true }
      ],
      mustPrint: ["first_name", "city"],
      success: 'Challenge passed! 🎉 You created both required string variables and printed their values.'
    }
  },
  {
    id: "numeric-variables",
    number: 2,
    title: "Numeric Variables",
    description: "Work with integers and decimal numbers.",
    status: "available",
    concept: {
      title: "Numbers in Python",
      body: "Python commonly uses <strong>int</strong> for whole numbers and <strong>float</strong> for numbers with a decimal point.",
      code: "age = 25\nprice = 9.99",
      callout: '<strong>Notice:</strong> <code>25</code> is an integer and <code>9.99</code> is a floating-point number.'
    },
    example: {
      title: "See numeric variables in action",
      body: "Numeric variables can be printed and used in calculations.",
      code: "apples = 4\nprice_each = 1.50\ntotal = apples * price_each\n\nprint(total)",
      output: "6.0"
    },
    practice: {
      title: "Practice: create an integer variable",
      prompt: 'Create a variable named <code>age</code>, give it a whole-number value, then print it.',
      hint: 'Example idea: <code>age = 25</code>',
      starterCode: "age = 25\nprint(age)",
      requirements: [
        { name: "age", type: "int" }
      ],
      mustPrint: ["age"],
      success: 'Excellent! You created an integer variable named <code>age</code> and printed it.'
    },
    challenge: {
      title: "Mini challenge",
      prompt: 'Create an integer variable named <code>age</code> and a decimal variable named <code>price</code>. Print both values.',
      starterCode: "age = 0\nprice = 0.0\n\nprint(age)\nprint(price)",
      hint: 'Use a whole number for <code>age</code> and a number with a decimal point for <code>price</code>.',
      requirements: [
        { name: "age", type: "int" },
        { name: "price", type: "float" }
      ],
      mustPrint: ["age", "price"],
      success: 'Challenge passed! 🎉 You created both an integer and a floating-point variable and printed them.'
    }
  },
  {
    id: "input-output",
    number: 3,
    title: "Input & Output",
    description: "Read user input and display useful results.",
    status: "locked",
    concept: {
      title: "Getting input from the user",
      body: 'The <strong>input()</strong> function pauses your program and lets the user type a response. The response returned by <code>input()</code> is a string.',
      code: 'name = input("What is your name? ")',
      callout: '<strong>Important:</strong> Even if the user types numbers, <code>input()</code> returns text unless you convert it.'
    },
    example: {
      title: "Ask, store, and print",
      body: "You can save what the user types in a variable and then use that value in your output.",
      code: 'name = input("What is your name? ")\nprint("Hello", name)',
      output: "What is your name? Daniel\nHello Daniel"
    },
    practice: {
      title: "Practice: ask for a name",
      prompt: 'Use <code>input()</code> to ask the user for their name. Store the answer in a variable named <code>name</code>, then print the value.',
      hint: 'Start with <code>name = input("What is your name? ")</code>.',
      starterCode: 'name = input("What is your name? ")\nprint(name)',
      requirements: [
        { name: "name", type: "str", nonEmpty: true }
      ],
      mustPrint: ["name"],
      success: 'Excellent! You collected user input, stored it in <code>name</code>, and printed the response.'
    },
    challenge: {
      title: "Mini challenge: personalize the output",
      prompt: 'Ask the user for their <code>first_name</code> and <code>favorite_food</code>. Then print both answers so the user can see what they entered.',
      starterCode: 'first_name = input("What is your first name? ")\nfavorite_food = input("What is your favorite food? ")\n\nprint(first_name)\nprint(favorite_food)',
      hint: 'Use <code>input()</code> twice—once for each variable—then print both variables.',
      requirements: [
        { name: "first_name", type: "str", nonEmpty: true },
        { name: "favorite_food", type: "str", nonEmpty: true }
      ],
      mustPrint: ["first_name", "favorite_food"],
      success: 'Challenge passed! 🎉 You asked for two pieces of input and displayed both answers.'
    }
  },
  {
    id: "module-challenge",
    number: 4,
    title: "Module Challenge",
    description: "Combine strings, numbers, input, and output.",
    status: "locked"
  }
];
