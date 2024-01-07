const express = require('express');
const {
  exec
} = require('child_process');
const fs = require('fs');
const util = require('util');
const app = express();
const port = 3000;

const interpretClass = require('./Classes/Interpreter');
const path = require('path');
const Interpreter = new interpretClass()

app.get('/', (req, res) => {
  res.send("Please navigate to /clone?url=[github repo url]")
})

// Endpoint to handle the /grab API
app.get('/clone', async (req, res) => {
  // Extract the GitHub repository URL from the query parameters
  const repoUrl = req.query.url;

  // Check if the URL parameter is provided
  if (!repoUrl) {
    return res.status(400).json({
      error: 'GitHub repository URL is required.'
    });
  }

  // Generate a unique folder name based on the repository name
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const destinationFolder = `./${repoName}`;

  // Check if the repository folder already exists
  if (fs.existsSync(destinationFolder)) {
    // If it exists, delete it before cloning
    await exec(`rm -rf ${destinationFolder}`);
  }

  // Construct the git clone command
  const gitCloneCommand = `git clone ${repoUrl} ${destinationFolder}`;

  // Execute the git clone command
  try {
    const {
      stdout,
      stderr
    } = await exec(gitCloneCommand);
    const response = {
      message: 'Repository cloned successfully.',
      repoName: repoName,
      output: stdout,
      errors: stderr,
    };
    res.send(JSON.stringify(response));

  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.get('/get', async (req, res) => {
  const githubName = req.query.repoName
  if (fs.existsSync(githubName)) {
    const responseObject = await Interpreter.process(path.join(__dirname, githubName))
    console.log(responseObject)
    res.send(JSON.stringify(responseObject))
  }
})

// Start the Express server
app.listen(port, () => {
  console.log(`Hermes Webserver is currently running on port ${port}`);
});