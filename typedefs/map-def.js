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
		updateRegion(regionid: String!, _id: String!, field: String!, value: String!): [Region]
		sortRegions(_id: String!, criteria: String!, parentid: String!): [Region]
		updateRegionParent(_id: String!, regionid: String!, newparent: String!): String
		addRegionLandmark(_id: String!, regionid: String!, landmark: String!, index: Int!): String
		deleteRegionLandmark(_id: String!, regionid: String!, landmark: String!): Boolean
		updateRegionLandmark(_id: String!, regionid: String!, newlandmark: String!, oldlandmark: String!): String
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
	}
`;

module.exports = { typeDefs: typeDefs }