var express = require('express');
var router = express.Router();
var bookshelf = require('../db/bookshelf');
var Dash = require('../lib/dashlogic');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('FBindex');
});

// probably place all routes above /:username route, no other route files

//Julie's code starts here
//this route needs to
//for now redirect to / because we will need cookies set through the facebook oauth first
//this is a created route for the main, home page
router.get('/splashpage', function(req, res, next){
  res.render('../views/splashpage')
})
//this is a created route for the loadpage
router.get('/loadpage', function(req, res, next){
  res.render('../views/loadpage')
})
//
router.post('/addgametype',function(req,res,next){
  Dash.createGameType().then(function(){
    res.redirect('/')
  })
})

//Julie's code ends here


// Ricky's work below
router.get('/:username', function(req, res, next){
  Dash.readUser(req.params.username).then(function(user){
    Dash.readGameTypes(user.rows[0].id).then(function(gametypes){
      console.log("************GAME TYPES**********");
      console.log(gametypes.rows);
    //   res.render('testdash', {
    //     userInfo: user.rows[0],
    //     games: gametypes.rows
    // })
    // for each game type, we need to get:
    // 1) Player data
    // 2) Game Records
    // 3) Standings
      Dash.readGameStats(user.rows[0].id).then(function(all){
        // console.log("************GAME STATS**********");
        // console.log(all.rows);
        Dash.readGameRecords(user.rows[0].id).then(function(records){
          console.log("************GAME RECORDS**********");
          console.log(records.rows);
            res.render('testdash', {
              userInfo: user.rows[0],
              gameTypes: gametypes.rows,
              gameStats: all.rows,
              gameRecords: records.rows
          })
        })
      })
});
})});

router.post('/addrecord', function(req, res, next){
  console.log(">>>>>>>>>>>> req body <<<<<<<<<<<<");
  console.log(req.body);
  Dash.createGameRecord(
    req.body.game_id, req.body.user1_id, req.body.user2_id, req.body.user1_score, req.body.user2_score
  ).then(function(){
    res.redirect('/')
  })
})

module.exports = router;
