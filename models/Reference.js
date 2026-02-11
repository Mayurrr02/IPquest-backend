const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Patent", "Trademark", "Copyright", "General"],
        default: "General"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reference", referenceSchema);
