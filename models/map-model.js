const { model, Schema, ObjectId } = require('mongoose');
const Subregion = require('./subregion-model').schema;

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
		subregions: [Subregion],
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