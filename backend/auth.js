const jwt = require('jsonwebtoken');
const JWT_SECRET = "shubhJwtViru5"

const auth = (req , res , next) => {
    const token = req.headers.token;
    const decodedData = jwt.verify(token , JWT_SECRET);

    if (decodedData) { // If user (id) found
        req.userId = decodedData.id;
        next();
    }
    else {
        res.status(403).json({
            msg: 'INCORRECT CREDENTIALS!, Cannot LogIN'
        })
    }

}

module.exports = {
    auth,
    JWT_SECRET
}