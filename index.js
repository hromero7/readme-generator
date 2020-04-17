const fs = require("fs");
const util = require("util");
const axios = require("axios");
const inquirer = require("inquirer");

const writeFileAsync = util.promisify(fs.writeFile);

const questions = [
      {
    type: "input",
    message: "Enter your GitHub username",
    name: "username"
  },
  {
      type: "input",
      message: "What is your project's name?",
      name: "title"
  },
  {
      type: "input",
      message: "Please write a short description of your project.",
      name: "description"
  },
  {
      type: "input",
      message: "What kind of license should your project have?",
      name: "license",
      default: "MIT"
  },
  {
      type: "input",
      message: "What command should be run to install dependencies?",
      name: "installation",
      default: "npm install"
  },
  {
      type: "input",
      message: "What command should be run to run tests?",
      name: "test",
      default: "test"
  },
  {
      type: "input",
      message: "What does the user need to know about using the repo?",
      name: "usage"
  },
  {
      type: "input",
      message: "What does the user need to know about contributing to the repo?",
      name: "contribution"

  }

]


let userPrompt = () => {
    return inquirer.prompt(questions);
}
const avatar = [];
const email = [];

let api = (answers) => {
    const queryUrl = `https://api.github.com/users/${answers.username}`
   return axios
    .get(queryUrl)
    .then(function(res){
        // console.log(res.data.avatar_url)
        avatar.push(res.data.avatar_url);
        email.push(res.data.email);
    })
}

let generateReadME = (answers, avatar, email) => {
return `# ${answers.title}

## Description

${answers.description}

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#tests)
* [Questions](#questions)

## Installation

To install necessary dependancies, run the following command: 

---
${answers.installation}
---

## Usage

${answers.usage}

## License

This project is licensed under the ${answers.license} license.

## Contributing

${answers.contribution}

## Tests

To run tests run the following command :

---
${answers.test}
---

## Questions
<img src='${avatar[0]}'` + " alt='avatar' style='border-radius: 16px' width='30px'/>" +
`<br>Any questions email me at ${email[0]}`
}


async function init() {
    try {
        const answers = await userPrompt();
        const data = await api(answers);
        const template = generateReadME(answers, avatar, email);
        await writeFileAsync("README.md", template);
        console.log("Success");
    } catch (err) {
        console.log(err);
    }
}

init();