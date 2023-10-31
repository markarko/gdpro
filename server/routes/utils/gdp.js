function containsOnlyLetters(str) {
    let regex = /^[a-zA-Z]+$/;
    return regex.test(str);
}

function sendError(res, status, error) {
    res.status(status).send({ error: error });
}

function sendData(res, status, data) {
    res.status(status).send({ data: data });
}

module.exports = {
    sendData,
    sendError,
    containsOnlyLetters
}
