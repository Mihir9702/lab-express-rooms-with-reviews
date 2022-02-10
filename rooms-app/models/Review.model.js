const { Schema, model, Types } = require('mongoose');

const reviewSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User' },
    comment: { type: String, maxlength: 200 }
});

const Review = model('Review', reviewSchema);

module.exports = Review;