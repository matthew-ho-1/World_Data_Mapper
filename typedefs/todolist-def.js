const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		owner: String!
		subregions: [Subregion]
		sortRule: String!
		sortDirection: Int!
	}
	type Subregion {
		_id: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String!]!
	}
	extend type Query {
		getAllMaps: [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): Map
		updateMapField(_id: String!, field: String!, value: String!): String
		deleteMap(_id: String!): Boolean
	}

	input FieldInput {
		_id: String
		field: String
		value: String
	}
	
	input MapInput {
		_id: String!
		name: String!
		owner: String!
		subregions: [SubregionInput]
		sortRule: String!
		sortDirection: Int!
	}
	input SubregionInput {
		_id: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String!]!
	}
`;

module.exports = { typeDefs: typeDefs }