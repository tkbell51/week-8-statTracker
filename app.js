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

passport.use(new BasicStrategy(
  function(username, password, done){
    User.findONe({username: username, password: password}).then(user=>{
      if(!user){
        return done(null, false);
      } else{
        return done(null, user);
      }
    })
  }
));

app.get('/user',(req, res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.post('/user', (req, res)=>{

})
//GET	/activities	Show a list of all activities I am tracking, and links to their individual pages
app.get('api/activity/', (req, res)=>{
  Activity.findAll({}).then(activity=>{
    res.json(activity);
  })

})

//POST	/activities	Create a new activity for me to track.
app.post('api/activity/', (req, res)=>{
  const activity = new Activity(req.body).save().then(activity=>{
    res.json(activity)
  })
  Activity.create({})
})

//GET	/activities/{id}	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
app.get('api/activity/:id', (req, res)=>{
  Activity.findOne({_id: req.params.id}).then(activity=>{
    res.json(activity);
  })

})

//PUT	/activities/{id}	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
app.put('api/activity/:id', (req, res)=>{
  Activity.findOne({_id: req.params.id}).then(activity=>{
    activity.name = req.body.name,
    activity.save();
    res.json(activity);
  })

})

//DELETE	/activities/{id}	Delete one activity I am tracking. This should remove tracked data for that activity as well.
app.remove('api/activity/:id', (req, res)=>{
Activity.deleteOne({_id: req.params.id}).then(()=>{
  res.json();
})

})

//POST	/activities/{id}/stats	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
app.post('api/activity/:id/stats', (req, res)=>{
Activity.updateOne({date: req.body.date}).then(activity=>{
  activity.date = req.body.date,
  activity.name = req.body.name,
  activity.trackedStats = req.body.trackedStats
  activity.save();
  res.json(activity);
})

})

//DELETE	/stats/{id}	Remove tracked data for a day.
app.delete('api/stats/:id', (req, res)=>{
Activity.remove({date: req.body.date}).then(()=>{
  res.json();
})

})





app.listen(3000);
