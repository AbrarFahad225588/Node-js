const fs = require("node:fs");
function LogFile(filename) {
    return (req, res, next) => {
        log = `${Date.now()}:${req?.url} new request received \n`;
        fs.appendFile(filename, log, (err, data) => {
            next();
        })
    }
}


module.exports = LogFile;   