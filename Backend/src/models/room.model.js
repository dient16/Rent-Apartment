const mongoose = require("mongoose");

const COLLECTION = "rooms";
const DOCUMENT = "room";

const roomSchema = new mongoose.Schema({
	services: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Service", require: true },
	],
	description: { type: String, require: true },
	size: { type: Number, require: true },
	price: { type: Number, require: true },
	images: [{ type: String, require: true }],
	unavailableDateRanges: [{ startDay: { type: Date }, endDay: { type: Date } }],
	roomType: { type: String, require: true },
	numberOfGuest: { type: Number, require: true },
	reviews: [
		{
			score: { type: Number },
			comment: { type: String },
			postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		},
	],
	quantity: { type: Number, require: true },
});

module.exports = mongoose.model(DOCUMENT, roomSchema, COLLECTION);
