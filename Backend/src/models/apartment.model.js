const mongoose = require('mongoose');

const COLLECTION = 'apartments';
const DOCUMENT = 'Apartment';

const userSchema = new mongoose.Schema(
    {
        title: { type: String, require: true },
        slug: { type: String, require: true, unique: true },
        location: {
            coordinate: { type: String, require: true },
            province: { type: String, require: true },
            district: { type: String, require: true },
            street: { type: String, require: true },
        },
        createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rooms: [
            {
                services: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Service',
                    },
                ],
                description: { type: String },
                size: { type: Number, require: true },
                price: { type: Number, require: true },
                image: [{ type: String, require: true }],
                availability: { type: Boolean, require: true },
                roomType: { type: String, require: true },
                numberOfGuest: { type: Number, require: true },
                reviews: [
                    {
                        star: { type: Number, require: true },
                        comment: { type: Number, require: true },
                        postedBy: { type: mongoose.Schema.Types.ObjectId, require: true },
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(DOCUMENT, userSchema, COLLECTION);