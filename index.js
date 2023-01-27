const fs = require("fs");
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");

// Array of questions for user input
askQuestions = async () => {
    const question = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your GitHub username?'
        },
        {
            type: 'input',
            name: 'email',
            message: 'What is your email address?'
        },
        {
            type: 'input',
            name: 'title',
            message: "What is your project's name?"
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please write a short description of your project.'
        },
        {
            type: 'input',
            name: 'url',
            message: 'If your project is deployed, what is the URL of the deployed application?',
            default: 'none'
        },
        {
            type: 'input',
            name: 'imgUrl',
            message: 'If your project has images, what are the URLs of the images (separate with a space)?',
            default: 'none'
        },
        {
            type: 'list',
            name: 'license',
            message: 'What kind of license should your project have?',
            choices: ['MIT', 'APACHE 2.0', 'GPL 3.0', 'BSD 3', 'none'],
            default: 'none'
        },
        {
            type: 'input',
            name: 'install',
            message: 'What command should be run to install dependencies?',
            default: 'npm i'
        },
        {
            type: 'input',
            name: 'tests',
            message: 'What command should be entered to run tests?',
            default: 'npm test'
        },
        {
            type: 'input',
            name: 'contributors',
            message: 'Who has contributed to the repo?'
        }
    ]);
    question.usageSteps = await askMultiStepQuestion(
        'What is the first step the user should take to use the repo?',
        'What is the next step the user should take to use the repo? (leave blank if there are no more steps)');
    question.contributeSteps = await askMultiStepQuestion(
        'What is the first step the user should take to contribute to the repo?',
        'What is the next step the user should take to contribute to the repo (leave blank if there are no more steps)?');
    return question;
};

askMultiStepQuestion = async (firstTimeQuestion, followingQuestion) => {
    const question = [];
    let firstTime = true;
    while (true) {
        const message = firstTime ? firstTimeQuestion : followingQuestion;

        const answer = await inquirer.prompt([

            {
                type: 'input',
                name: 'value',
                message
            }
        ]);
        firstTime = false;
        if (!answer.value) {
            break;
        }
        question.push(answer.value);
    };
    return question;
};


// Function to initialize app
const init = () => {
    askQuestions().then((answers) => {
        try {
            const md = generateMarkdown(answers);
            fs.writeFileSync('newReadme.md', md);
            console.log('You successfully wrote a readme.md');
        } catch (error) {
            console.log(error);
        }
    });
};


init();
