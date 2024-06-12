const mongoose = require("mongoose");

const COLLECTION = "apartments";
const DOCUMENT = "Apartment";

const apartmentsSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		location: {
			longitude: { type: Number, required: true },
			latitude: { type: Number, required: true },
			province: { type: String, required: true },
			district: { type: String, required: true },
			ward: { type: String },
			street: { type: String, required: true },
		},
		createBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
		images: [{ type: String, required: true }],
	},
	{
		timestamps: true,
	},
);

apartmentsSchema.index({
	"location.province": "text",
	"location.district": "text",
	"location.ward": "text",
	"location.street": "text",
});

module.exports = mongoose.model(DOCUMENT, apartmentsSchema, COLLECTION);
