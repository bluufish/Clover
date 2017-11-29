const router = require('express').Router()
var MsTranslator = require('mstranslator');
var googleTTS = require('google-tts-api');

require('../../secrets')

const client = new MsTranslator({
    api_key: process.env.api_key
}, true);

router.post('/', (req, res, next) => {
    const text = req.body.text
    const params = {
        text
        , from: req.query.from
        , to: req.query.to
    };

    client.translate(params, function (err, data) {
        if (err) console.error(err)
        res.send(data)
    });

})

router.post('/speech', (req,res,next) => {
    return googleTTS(req.body.text, req.body.language, 1)   // speed normal = 1 (default), slow = 0.24
    .then(url => res.send(url))
    .catch(err => console.error(err))
})

module.exports = router