const { model, Schema, ObjectId } = require('mongoose');
const region = require('./region-model').schema;

const mapSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},

		name: {
			type: String,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		regions: [region],
		sortRule: {
			type: String, 
			required: true
		},
		sortDirection: {
			type: Number, 
			required: true
		}
	},
	{ timestamps: true }
);

const Map = model('Map', mapSchema);
module.exports = Map;