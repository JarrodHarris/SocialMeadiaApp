const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
},
//timestamps for when a user is created or updated
{timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema);