# RepoGeek

RepoGeek is a full-stack application built with **Next.js** (frontend) and **Express.js** (backend) that lets users log in via Google or GitHub, access their repositories, view the file structure, and analyze the code using a locally hosted LLM via **Ollama**.

## Features

- **Authentication**: Log in via Google or GitHub.
- **Repository Access**: Access your repositories and view the file structure.
- **Code Analysis**: Analyze repository code using an LLM running locally.
- **Local Development**: Powered by Ollama to run the LLM locally.

## Project Structure

The project is divided into two main folders:

1. `backend`: Contains the Express.js server.
2. `repo-geek`: Contains the Next.js frontend application.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v14+)
- npm (v6+)
- Ollama (to run the LLM locally)
- MongoDB (if needed for authentication/session handling)
- Google/GitHub OAuth Credentials

## Setup

Follow these steps to get the project up and running:

### 1. Clone the Repository

```bash
git clone https://github.com/Karanxidhu/RepoGeek.git
cd repo-geek
```

### 2. Setting up the Backend

- Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
- Install the dependencies:
    ```bash
    npm install
    ```
- Rename `example.env` to `.env` and fill in the necessary environment variables:
    ```bash
    cp example.env .env
    ```
- Update `.env` with your Google and GitHub OAuth credentials:
    ```bash
    PORT=4000
    MONGO_URI=your_mongo_connection_string
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    ```
- Start the backend server:
    ```bash
    npm start
    ```

### 3. Setting up the Frontend (Next.js)
- Install Next.js and dependencies:
    ```bash
    npm i
    ```
- Create a .env file in the repo-geek folder with the following content:
    ```bash
    NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
    ```
- Start the frontend server
    ```bash
    npm run dev
    ```

### 4. Running the LLM Locally with Ollama
- Install Ollama:  

   [ollama](https://ollama.com/download)


- Run the following command to download the model:
    ```bash
    ollama download qwen2:1.5b
    ```
- Create custom model using `model.modelfile`:
    ```bash
    touch model.modelfile
    ```
- Copy this in the model.modelfile:
    ```
    FROM qwen2:1.5b

    PARAMETER temperature 0.7
    PARAMETER top_p 0.9
    PARAMETER frequency_penalty 0.2
    PARAMETER presence_penalty 0.3

    SYSTEM """
    You are RepoGeek, an expert coding assistant with years of experience in software development. 
    You analyze code like a senior developer, pointing out key strengths, potential issues, and offering optimized versions or completely new code if needed. 
    Your responses must be detailed, clear, and include explanations for any refactoring or improvements you suggest.

    Here’s how you should respond to a typical user request:

    USER: Analyze the following JavaScript function and provide feedback:
    function fetchData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error));
    }

    ASSISTANT: 
    Code Strengths:
    - Simple and concise function for fetching data from an API.
    - Promises are used correctly to handle asynchronous requests.

    Weaknesses:
    - No error handling for network failures.
    - Does not handle HTTP status codes other than 200 (e.g., 404, 500).
    - Lacks async/await syntax, which could make the code cleaner.

    Suggestions:
    - Implement better error handling for HTTP status codes and network errors.
    - Consider using async/await for improved readability.

    Optimized Code:
    javascript
    async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
    }

    Additional Comments:

    You might want to introduce a timeout mechanism for better user experience in case the request hangs.
    Consider logging errors more comprehensively for debugging purposes.
    """


    ```
- Run the following command to create custom the LLM:
    ```bash
    ollama create RepoGeek --file model.modelfile 
    ```
- Run the following command to start the LLM:
    ```bash
    ollama run RepoGeek
    ```

## How It Works

- Login with Google or GitHub.
- Access your GitHub repositories after authentication.
- Browse through the repository file structure.
- Analyze the code using the LLM, which provides insights and suggestions for improving the code quality.
