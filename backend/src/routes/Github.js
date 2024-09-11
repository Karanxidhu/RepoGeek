require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../model/User')
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/middleware');
const crypto = require('crypto');

const algorithm = process.env.CRYPTO_ALGO;
const secretKey = process.env.CRYPTO_SECRET; 


function buildNestedTree(tree) {
    let idCounter = 0;

    const root = {
        id: (++idCounter).toString(),
        isSelectable: true,
        name: 'root',
        actualPath: '', 
        children: [],
    };

    tree.forEach(item => {
        const pathParts = item.path.split('/');
        let currentLevel = root;
        let currentPath = '';

        pathParts.forEach((part, index) => {
            currentPath += (index > 0 ? '/' : '') + part;

            let existingPath = currentLevel.children.find(child => child.name === part);

            if (!existingPath) {
                existingPath = {
                    id: (++idCounter).toString(),
                    isSelectable: true,
                    name: part,
                    actualPath: currentPath, 
                    children: [],
                };
                currentLevel.children.push(existingPath);
            }

            currentLevel = existingPath;
        });

        
        if (item.type === 'blob') {
            delete currentLevel.children;
            currentLevel.isSelectable = true; 
        }
    });

    return root.children;
}

const decrypt = (hash) => {
    const [iv, encryptedText] = hash.split(':');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);

    return decrypted.toString();
};

router.get('/repos', fetchuser, async (req, res) => {
    console.log(req.user.id)
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(500).send('Failed to find user');
        }
        try {
            const accessToken = decrypt(user.accessToken)
            console.log("req hit", accessToken)
            const response = await fetch('https://api.github.com/user/repos?per_page=100', {
                headers: {
                    Authorization: `token ${accessToken}`,
                    'User-Agent': 'Node.js'
                }
            });
            const repos = await response.json();
            return res.json(repos);
        } catch (error) {
            console.log(error)
            return res.status(500).send('Failed to fetch repositories');
        }
    } catch (error) {
        return res.status(500).send('Failed to find user');
    }
    
})

router.post('/urltree', fetchuser, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    
    // Extract owner and repo name from the URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return res.status(400).send('Invalid GitHub repository URL');
    }
    
    const owner = match[1];
    const repo = match[2];

    // Fetch default branch (usually 'main' or 'master')
    const repoInfoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoInfoResponse.ok) {
      throw new Error(`Error fetching repository info: ${repoInfoResponse.statusText}`);
    }

    const repoInfo = await repoInfoResponse.json();
    const defaultBranch = repoInfo.default_branch;

    // Get the SHA of the default branch
    const refResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!refResponse.ok) {
      throw new Error(`Error fetching branch SHA: ${refResponse.statusText}`);
    }

    const refData = await refResponse.json();
    const treeSha = refData.object.sha;

    // Get the repository tree recursively
    const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!treeResponse.ok) {
      throw new Error(`Error fetching repository tree: ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();
    const tree = treeData.tree;
    const newTree = buildNestedTree(tree);
    
    return res.json(newTree);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).send('Failed to fetch repository tree');
  }
});

router.post('/tree', fetchuser, async (req, res) => {
    
  try {
    const {repo, branch} = req.body;
    console.log(repo, branch)
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(500).send('Failed to find user');
      }
    const accessToken = decrypt(user.accessToken);
    // Get the SHA of the branch
    const refResponse = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${branch}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!refResponse.ok) {
      throw new Error(`Error fetching branch SHA: ${refResponse.statusText}`);
    }

    const refData = await refResponse.json();
    console.log(refData)
    var treeSha = ""
    if(Array.isArray(refData)){
      treeSha = refData[0].object.sha
    }
    else{
      treeSha = refData.object.sha
    }
    // Get the repository tree
    const treeResponse = await fetch(`https://api.github.com/repos/${repo}/git/trees/${treeSha}?recursive=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!treeResponse.ok) {
      throw new Error(`Error fetching repository tree: ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();
    const tree = treeData.tree;
    newtree = buildNestedTree(tree);
    return res.json(newtree);
    // return res.json(tree);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).send('Failed to fetch repository tree');
  }
})

router.post('/content', fetchuser, async (req, res) => {
    try {
        const {path, repo} = req.body;
        const user = await User.findById(req.user.id);
        const owner = user.githubUsername;
        const ref = 'main';
        if (!user) {
          return res.status(500).send('Failed to find user');
        }
        try {
            const accessToken = decrypt(user.accessToken)
            const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${ref}`, {
                headers: {
                    Authorization: `token ${accessToken}`,
                    'User-Agent': 'Node.js',
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });
            const content = await response.text();
            return res.json({content});
        } catch (error) {
            console.log(error)
            return res.status(500).send('Failed to fetch repositories');
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Failed to fetch repository tree');
    }
})

module.exports = router