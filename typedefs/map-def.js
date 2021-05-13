const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		name: String!
		owner: String!
		regions: [Region]
		sortRule: String!
		sortDirection: Int!
	}
	type Region {
		_id: String!
		parentid: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String!]!
		subregions: [String!]!
	}

	extend type Query {
		getAllMaps: [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): Map
		updateMapField(_id: String!, field: String!, value: String!): String
		deleteMap(_id: String!): Boolean
		addRegion(region: RegionInput!, location: [String!]!, _id: String!, index: Int!): String
		deleteRegion(regionid: String!, _id: String!): [Region]
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
		regions: [RegionInput]
		sortRule: String!
		sortDirection: Int!
	}
	input RegionInput {
		_id: String!
		parentid: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String!]!
		subregions: [String!]!
	}
`;

module.exports = { typeDefs: typeDefs }