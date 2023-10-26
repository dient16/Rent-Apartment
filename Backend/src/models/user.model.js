const mongoose = require('mongoose');

const COLLECTION = 'users';
const DOCUMENT = 'User';

const userSchema = new mongoose.Schema(
    {
        email: { type: String, require: true, unique: true },
        firstname: { type: String },
        lastname: { type: String },
        password: { type: String, require: true },
        avatar: {
            type: String,
            default: 'https://www.drupal.org/files/issues/default-avatar.png',
        },
        phone: {
            type: String,
            require: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
        },
        aboutMe: {
            type: String,
        },
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Apartment',
            },
        ],
        createApartments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Apartment',
            },
        ],
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model(DOCUMENT, userSchema, COLLECTION);