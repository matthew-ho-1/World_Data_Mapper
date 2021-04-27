const { model, Schema, ObjectId } = require('mongoose');

const subregionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: true
		},
		leader: {
			type: String,
			required: true
		},
		landmarks: [String]
	}
);

const Subregion = model('subregion', subregionSchema);
module.exports = Subregion;