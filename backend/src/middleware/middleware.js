require('dotenv').config()
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        console.log(token)
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(data)
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchuser;