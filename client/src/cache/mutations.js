import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			firstName
			lastName
			password
			initials
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $firstName: String!, $lastName: String!, $_id: String!) {
		update(email: $email, password: $password, firstName: $firstName, lastName: $lastName, _id: $_id) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_REGION= gql`
	mutation AddRegion($region: RegionInput!, $location: [String!]!, $_id: String!, $index: Int!) {
		addRegion(region: $region, location: $location, _id: $_id, index: $index)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($regionid: String!, $_id: String!) {
		deleteRegion(regionid: $regionid, _id: $_id) {
			_id
			parentid
			name
			capital
			leader 
			landmarks
			subregions
		}
	} 
`;

export const UPDATE_REGION= gql`
	mutation UpdateRegion($_id: String!, $regionid: String!, $field: String!, $value: String!) {
		updateRegion(_id: $_id, regionid: $regionid, field: $field, value: $value) {
			_id
			parentid
			name
			capital
			leader 
			landmarks
			subregions
		}
	}
`;

export const REORDER_ITEMS = gql`
	mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
		reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
			_id
			description
			due_date
			assigned_to
			completed
		}
	}
`;

export const SORT_REGIONS= gql`
	mutation SortRegions($_id: String!, $criteria: String!, $parentid: String!) {
		sortRegions(_id: $_id, criteria: $criteria, parentid: $parentid) {
			_id
			parentid
			name
			capital
			leader 
			landmarks
			subregions
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) {
			_id
			name
			owner
			regions {
				_id
				name
				capital
				leader
				landmarks
				subregions
			}
			sortRule
			sortDirection
		}
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!) {
		updateMapField(_id: $_id, field: $field, value: $value)
	}
`;
