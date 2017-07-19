const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const BasicStrategy = require('passport-http').BasicStrategy;
const app = express();
const Activity = require('./models/Activity');
const User = require('./models/user');
mongoose.Promise = require('bluebird');

mongoose.connect("mongodb://localhost:27017/activity_db");

app.use(bodyParser.json());

// const user1 = new User({
//   username: 'quinton',
//   password: 123456
// })
// user1.save();
// const user2 = new User({
//   username: 'user',
//   password: 'password'
// })
// user2.save();
//--------Activity----
// const activity = new Activity({
//   name: "Piano Practice",
//   trackedStats: '30',
// })
// activity.save();
passport.use(new BasicStrategy(
  function(username, password, done){

    User.findOne({username: username, password: password}).then(user=>{
      if(!user){
        return done(null, false);
      } else{
        return done(null, user);
      }
    })
  }
));
app.use((req, res, next) => {
  passport.authenticate('basic', {session: false});
  next();
});


//GET	/activities	Show a list of all activities I am tracking, and links to their individual pages
app.get('/api/activity/', passport.authenticate('basic', {session: false}),(req, res)=>{
  Activity.find({}).then(activity=>{
    res.json(activity);
  })

})

//POST	/activities	Create a new activity for me to track.
app.post('/api/activity/',passport.authenticate('basic', {session: false}), (req, res)=>{
  const activity = new Activity({
    name: req.body.name,
    trackedStats: req.body.trackedStats,
  }).save().then(activity=>{
    res.json(activity)
  })
  Activity.create({})
})

//GET	/activities/{id}	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
app.get('/api/activity/:id',passport.authenticate('basic', {session: false}), (req, res)=>{
  Activity.findOne({_id: req.params.id}).then(activity=>{
    res.json(activity);
  })

})

//PUT	/activities/{id}	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
app.put('/api/activity/:id',passport.authenticate('basic', {session: false}), (req, res)=>{
  Activity.findOne({_id: req.params.id}).then(activity=>{
    activity.name = req.body.name,
    activity.save();
    res.json(activity);
  })

})

//DELETE	/activities/{id}	Delete one activity I am tracking. This should remove tracked data for that activity as well.
app.delete('/api/activity/:id',passport.authenticate('basic', {session: false}), (req, res)=>{
Activity.deleteOne({_id: req.params.id}).then(()=>{
  res.json();
})

})

//POST	/activities/{id}/stats	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
app.post('/api/activity/:id/stats',passport.authenticate('basic', {session: false}), (req, res)=>{
Activity.updateOne({date: req.body.date}).then(activity=>{
  activity.date = req.body.date,
  activity.name = req.body.name,
  activity.trackedStats = req.body.trackedStats,
  
  res.json(activity);
})

})

//DELETE	/stats/{id}	Remove tracked data for a day.
app.delete('/api/stats/:id',passport.authenticate('basic', {session: false}), (req, res)=>{
Activity.remove({date: req.body.date}).then(()=>{
  res.json();
})

})





app.listen(3000);
