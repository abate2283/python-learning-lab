window.MODULES = [
  {
    id: "python-foundations",
    number: 1,
    title: "Python Foundations",
    description: "Build a foundation with variables, input, output, and a hands-on module challenge."
  },
  {
    id: "variables-strings",
    number: 2,
    title: "Variables & Strings",
    description: "Learn assignment, reassignment, value tracking, and how string values move through variables.",
    testUnlocked: true
  }
];

window.LESSONS = [
  {
    id: "string-variables",
    moduleId: "python-foundations",
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
    moduleId: "python-foundations",
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
    moduleId: "python-foundations",
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
    moduleId: "python-foundations",
    number: 4,
    title: "Module Challenge",
    description: "Combine strings, numbers, input, and output.",
    status: "locked",
    concept: {
      title: "Bring the foundation together",
      body: "A useful program often combines several skills: reading input, converting numeric input, storing values, calculating a result, and displaying output.",
      code: 'name = input("Name: ")\nscore = int(input("Score: "))\nprint(name, score)',
      callout: '<strong>Goal:</strong> Use the skills from the first three lessons together in one program.'
    },
    example: {
      title: "A small profile program",
      body: "This example asks for a name and two scores, then calculates the total.",
      code: 'name = input("Name: ")\nfirst = int(input("First score: "))\nsecond = int(input("Second score: "))\ntotal = first + second\nprint(name)\nprint(total)',
      output: "Name: Maya\nFirst score: 8\nSecond score: 7\nMaya\n15"
    },
    practice: {
      title: "Practice: combine input and calculation",
      prompt: 'Ask for two integer values named <code>first_score</code> and <code>second_score</code>. Create <code>total_score</code> as their sum and print it.',
      hint: 'Convert each input with <code>int()</code>, then add the two variables.',
      starterCode: 'first_score = int(input("First score: "))\nsecond_score = int(input("Second score: "))\n\n# Create total_score below\n\nprint(total_score)',
      requirements: [
        { name: "first_score", type: "int" },
        { name: "second_score", type: "int" },
        { name: "total_score", type: "int" }
      ],
      mustPrint: ["total_score"],
      success: 'Excellent! You combined input, integer conversion, variables, arithmetic, and output.'
    },
    challenge: {
      title: "Foundation mastery challenge",
      prompt: 'Ask for a learner name and two integer scores. Store the name in <code>learner_name</code>, calculate <code>total_score</code>, then print the learner name and total score.',
      starterCode: 'learner_name = input("Learner name: ")\nscore_one = int(input("Score one: "))\nscore_two = int(input("Score two: "))\n\n# Write your solution below\n',
      hint: 'Create <code>total_score = score_one + score_two</code>, then print both required values.',
      requirements: [
        { name: "learner_name", type: "str", nonEmpty: true },
        { name: "total_score", type: "int" }
      ],
      mustPrint: ["learner_name", "total_score"],
      hiddenTests: [
        { inputs: ["Ava", "4", "6"], expected: { total_score: 10 } },
        { inputs: ["Noah", "15", "25"], expected: { total_score: 40 } },
        { inputs: ["Mia", "0", "9"], expected: { total_score: 9 } }
      ],
      success: 'Module challenge passed! 🏆 Your solution worked with multiple hidden test values.'
    }
  },
  {
    id: "variable-assignment",
    moduleId: "variables-strings",
    number: 1,
    title: "Variable Assignment",
    description: "Understand what assignment does and write correct assignment statements.",
    status: "available",
    concept: {
      title: "Assignment stores a value",
      body: 'An assignment statement gives a variable a current value. Read <code>score = 10</code> as “assign 10 to score.” The variable name goes on the left and the value or expression goes on the right.',
      code: 'score = 10\nplayer_name = "Avery"',
      callout: '<strong>Mental model:</strong> Python evaluates the right side first, then stores that result in the variable on the left.'
    },
    example: {
      title: "Assignment in action",
      body: "A variable can store a value and another variable can use that value.",
      code: 'base_points = 12\nbonus_points = 5\ntotal_points = base_points + bonus_points\n\nprint(total_points)',
      output: "17"
    },
    practice: {
      title: "Guided code: assign a sum",
      prompt: 'Create <code>total_tokens</code> by adding <code>red_tokens</code> and <code>blue_tokens</code>. Print <code>total_tokens</code>.',
      hint: 'The assignment begins with <code>total_tokens =</code>. Use both variables on the right side.',
      starterCode: 'red_tokens = 9\nblue_tokens = 6\n\n# Write your assignment below\n\nprint(total_tokens)',
      requirements: [
        { name: "total_tokens", type: "int", equals: 15 }
      ],
      mustPrint: ["total_tokens"],
      success: 'Correct! You assigned the result of an expression to <code>total_tokens</code>.'
    },
    challenge: {
      title: "Coding challenge: total the two inputs",
      prompt: 'Read two integers into <code>nickel_count</code> and <code>dime_count</code>. Assign <code>total_coins</code> their sum, then print <code>total_coins</code>. Your code must work for values you have not seen.',
      starterCode: 'total_coins = 0\n\nnickel_count = int(input())\ndime_count = int(input())\n\n# Your solution goes here\n\nprint(total_coins)',
      hint: 'Do not use a fixed answer. Add <code>nickel_count</code> and <code>dime_count</code>.',
      requirements: [
        { name: "total_coins", type: "int" }
      ],
      mustPrint: ["total_coins"],
      hiddenTests: [
        { inputs: ["100", "200"], expected: { total_coins: 300 } },
        { inputs: ["7", "13"], expected: { total_coins: 20 } },
        { inputs: ["0", "50"], expected: { total_coins: 50 } },
        { inputs: ["42", "8"], expected: { total_coins: 50 } }
      ],
      success: 'Challenge passed! 🎉 Your assignment worked for every hidden input pair.'
    }
  },
  {
    id: "reassignment-tracking",
    moduleId: "variables-strings",
    number: 2,
    title: "Reassignment & Value Tracking",
    description: "Follow a variable as its value changes one statement at a time.",
    status: "locked",
    concept: {
      title: "Variables can receive new values",
      body: 'A later assignment replaces the variable’s previous value. In <code>score = score + 5</code>, Python first reads the old value of <code>score</code>, adds 5, then stores the new result back into <code>score</code>.',
      code: 'score = 10\nscore = score + 5\nscore = score * 2',
      callout: '<strong>Trace it:</strong> 10 → 15 → 30. Each line uses the value that exists at that moment.'
    },
    example: {
      title: "Changing one variable does not rewind another",
      body: 'When <code>saved_score</code> receives a value, changing <code>score</code> later does not automatically recalculate <code>saved_score</code>.',
      code: 'score = 8\nsaved_score = score + 2\nscore = 3\n\nprint(score)\nprint(saved_score)',
      output: "3\n10"
    },
    practice: {
      title: "Guided code: update the score",
      prompt: 'Start with <code>score = 10</code>. Add 7 to its current value, then multiply the updated value by 2. Print <code>score</code>.',
      hint: 'Use <code>score = score + 7</code> first. Then update <code>score</code> again.',
      starterCode: 'score = 10\n\n# Update score twice below\n\nprint(score)',
      requirements: [
        { name: "score", type: "int", equals: 34 }
      ],
      mustPrint: ["score"],
      success: 'Excellent! You traced and updated the same variable through two assignments.'
    },
    challenge: {
      title: "Coding challenge: running balance",
      prompt: 'Read <code>starting_balance</code>, <code>deposit</code>, and <code>purchase</code> as integers. Store the starting value in <code>balance</code>, add the deposit to the current balance, subtract the purchase, and print <code>balance</code>.',
      starterCode: 'starting_balance = int(input())\ndeposit = int(input())\npurchase = int(input())\n\nbalance = starting_balance\n\n# Update balance below\n\nprint(balance)',
      hint: 'Update <code>balance</code> once for the deposit and once for the purchase.',
      requirements: [
        { name: "balance", type: "int" }
      ],
      mustPrint: ["balance"],
      hiddenTests: [
        { inputs: ["100", "40", "25"], expected: { balance: 115 } },
        { inputs: ["75", "10", "30"], expected: { balance: 55 } },
        { inputs: ["0", "50", "12"], expected: { balance: 38 } }
      ],
      success: 'Challenge passed! 🎉 Your running balance updates correctly for hidden values.'
    }
  },
  {
    id: "strings-through-variables",
    moduleId: "variables-strings",
    number: 3,
    title: "Strings Through Variables",
    description: "Assign, copy, and update text values stored in variables.",
    status: "locked",
    concept: {
      title: "Variables can refer to text",
      body: 'A string variable stores text. Assignment can also copy the current string value from one variable into another.',
      code: 'first_name = "Jordan"\ndisplay_name = first_name',
      callout: '<strong>Important:</strong> If <code>first_name</code> is assigned different text later, <code>display_name</code> keeps the value it received earlier unless it is assigned again.'
    },
    example: {
      title: "Track two string variables",
      body: "Watch the values at the moment each assignment runs.",
      code: 'favorite_color = "Blue"\nsaved_color = favorite_color\nfavorite_color = "Green"\n\nprint(favorite_color)\nprint(saved_color)',
      output: "Green\nBlue"
    },
    practice: {
      title: "Guided code: copy a string value",
      prompt: 'Create <code>display_name</code> from the current value of <code>first_name</code>. Then change <code>first_name</code> to <code>"Sam"</code>. Print both variables.',
      hint: 'Assign <code>display_name = first_name</code> before changing <code>first_name</code>.',
      starterCode: 'first_name = "Taylor"\n\n# Copy first_name, then change first_name\n\nprint(first_name)\nprint(display_name)',
      requirements: [
        { name: "first_name", type: "str", equals: "Sam" },
        { name: "display_name", type: "str", equals: "Taylor" }
      ],
      mustPrint: ["first_name", "display_name"],
      success: 'Correct! You preserved the earlier string value in a second variable.'
    },
    challenge: {
      title: "Coding challenge: build a simple label",
      prompt: 'Read <code>first_name</code> and <code>city</code>. Create <code>profile_label</code> using the format <code>Name - City</code>, then print it. Example: <code>Ada - Tulsa</code>.',
      starterCode: 'first_name = input()\ncity = input()\n\n# Create profile_label below\n\nprint(profile_label)',
      hint: 'Join the three pieces with <code>+</code>: the name, <code>" - "</code>, and the city.',
      requirements: [
        { name: "profile_label", type: "str", nonEmpty: true }
      ],
      mustPrint: ["profile_label"],
      hiddenTests: [
        { inputs: ["Ada", "Tulsa"], expected: { profile_label: "Ada - Tulsa" } },
        { inputs: ["Zion", "Chicago"], expected: { profile_label: "Zion - Chicago" } },
        { inputs: ["Maya", "Denver"], expected: { profile_label: "Maya - Denver" } }
      ],
      success: 'Challenge passed! 🎉 Your string expression works with different names and cities.'
    }
  },
  {
    id: "variables-strings-mastery",
    moduleId: "variables-strings",
    number: 4,
    title: "Variables & Strings Mastery",
    description: "Combine assignment, reassignment, numeric input, and strings in one program.",
    status: "locked",
    concept: {
      title: "Mastery means combining skills",
      body: "You now know how to assign values, use existing variables in new expressions, change values over time, and build text from variables.",
      code: 'name = input()\npoints = int(input())\nbonus = int(input())\npoints = points + bonus\nlabel = name + ": " + str(points)',
      callout: '<strong>Mastery goal:</strong> Build a solution that works for values you have never seen before.'
    },
    example: {
      title: "A learner score label",
      body: "The numeric value changes first, then the final string is built from the updated value.",
      code: 'name = "Avery"\npoints = 12\npoints = points + 3\nlabel = name + ": " + str(points)\nprint(label)',
      output: "Avery: 15"
    },
    practice: {
      title: "Practice: update then label",
      prompt: 'Start with the provided values. Update <code>points</code> by adding <code>bonus</code>, then create <code>result_label</code> in the format <code>Name scored TOTAL</code>.',
      hint: 'After updating <code>points</code>, use <code>str(points)</code> when joining it into text.',
      starterCode: 'name = "Mia"\npoints = 20\nbonus = 5\n\n# Update points and create result_label\n\nprint(result_label)',
      requirements: [
        { name: "points", type: "int", equals: 25 },
        { name: "result_label", type: "str", equals: "Mia scored 25" }
      ],
      mustPrint: ["result_label"],
      success: 'Excellent! You combined reassignment, numeric values, conversion, and strings.'
    },
    challenge: {
      title: "Mastery challenge: learner progress card",
      prompt: 'Read a learner name, completed lessons, and newly completed lessons. Update <code>completed</code>, then create <code>summary</code> exactly as <code>NAME completed TOTAL lessons</code>. Print <code>summary</code>. Hidden tests will use several different learners and totals.',
      starterCode: 'learner_name = input()\ncompleted = int(input())\nnewly_completed = int(input())\n\n# Update completed\n# Create summary\n\nprint(summary)',
      hint: 'First use the current value of <code>completed</code> to calculate its new value. Then convert that number with <code>str()</code> while building <code>summary</code>.',
      requirements: [
        { name: "completed", type: "int" },
        { name: "summary", type: "str", nonEmpty: true }
      ],
      mustPrint: ["summary"],
      hiddenTests: [
        { inputs: ["Avery", "3", "2"], expected: { completed: 5, summary: "Avery completed 5 lessons" } },
        { inputs: ["Maya", "0", "4"], expected: { completed: 4, summary: "Maya completed 4 lessons" } },
        { inputs: ["Noah", "8", "1"], expected: { completed: 9, summary: "Noah completed 9 lessons" } },
        { inputs: ["Zion", "11", "5"], expected: { completed: 16, summary: "Zion completed 16 lessons" } }
      ],
      success: 'Mastery passed! 🏆 Your program handled every hidden learner and progress total.'
    }
  }
];
