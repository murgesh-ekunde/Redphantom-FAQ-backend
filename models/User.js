const mongoose = require('mongoose')
const {Schema,model} = mongoose;

const UserSchema = new Schema({
    name:String,
    email:String,
    question:String,
    message:String,
    answer:String
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;