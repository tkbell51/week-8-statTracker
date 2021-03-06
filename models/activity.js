const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {type: String, require: true},
  date: { type : Date, require: true, default: Date.now },
  trackedStats: {type: Number, require: true}
});

 const Activity = mongoose.model("Activity", activitySchema);

 module.exports = Activity;
