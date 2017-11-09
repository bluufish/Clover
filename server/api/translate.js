const router = require('express').Router()
var MsTranslator = require('mstranslator');
require('../../secrets')

const client = new MsTranslator({
  api_key: process.env.api_key
}, true);


router.post('/', (req,res,next) => {
    const text = req.body.text
    const params = {
        text
      , from: req.query.from
      , to: req.query.to
    };  

    client.translate(params, function(err, data) {
        if(err) console.error(err)
        res.send(data)
    });
    
})

module.exports= router