const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({ //defines new schema(structure of mongodb doc), like a blueprint
    name: {
        type: String,
        required: true,
        trim: true //remove extra spaces from start and end of name
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true //convert lowercase before saving to db, ensures email is stored in consistent format
    },
    password:{
        type: String,
        required: true //later password will be hashed before saving to db, so we store the hashed version of the password
    },
    role:{
        type: String,
        enum: ["student", "cook"], //restricts values, prevent invalid data
        default: "student"
    }

},
{
    timestamps: true //auto adds createdat, updatedat fields to the schema, useful for tracking when user was created and last updated
}
);
const User = mongoose.model("User", userSchema); //create mongodb model, gives methods like .find(), .create(), .findById(), .findOne()
module.exports = User; //export model