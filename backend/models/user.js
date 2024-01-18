const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String
		},
		middleName: {
			type: String
		},
		lastName: {
			type: String
		},
		useremail: {
			type: String,
			required: true,
			unique: true
		},
		hashedEmail: {
			type: String
		},
		ign: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
		},
		confirmed: {
			type: Boolean,
			default: false
		},
		emailSecret: {
			type: String,
		},
		moves_nivel_1: {
			type: Number,
			default: 0
		},
		moves_nivel_2: {
			type: Number,
			default: 0
		},
		moves_nivel_3: {
			type: Number,
			default: 0
		},
		moves_nivel_4: {
			type: Number,
			default: 0
		},
		moves_nivel_5: {
			type: Number,
			default: 0
		},
		time_nivel_1: {
			type: Number,
			default: 0
		},
		time_nivel_2: {
			type: Number,
			default: 0
		},
		time_nivel_3: {
			type: Number,
			default: 0
		},
		time_nivel_4: {
			type: Number,
			default: 0
		},
		time_nivel_5: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)