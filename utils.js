const validateToken = (req, res, next) => {
    req.headers.validate == 'numen1234' ? next() : res.json({error_message: "Invalid API token"})
}

module.exports = validateToken;