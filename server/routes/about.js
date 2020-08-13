const express = require('express');
const router = express.Router();

// router.get('/about', function(req, res){
//     console.log("어바웃 겟");
//     return res.json({username:'bryan~~~'});
// });
router.post('/', function(req, res){
    console.log("어바웃 포스트");
    return res.json({username:'bryan~~~'});
});
module.exports = router;