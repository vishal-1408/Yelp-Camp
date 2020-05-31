var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
  name:String,
  iUrl:String,
  desc:String,
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  price:String
})

var Camp = mongoose.model("Camp",campSchema);

module.exports = Camp;
