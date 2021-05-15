const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Sorting = require('../utils/sorting')

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		/** 
		 	@param 	 {object} req - the request object containing a user id
			@returns {array} an array of map objects on success, and an empty array on failure
		**/
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id}).sort({updatedAt: 'descending'});
			if(maps) {
				return (maps);
			} 
		},
	},
	Mutation: {
		/** 
		 	@param 	 {object} args - an empty map object
			@returns {string} the objectID of the map or an error message
		**/
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { id, name, owner, regions , sortRule, sortDirection} = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				regions: regions,
				sortRule: sortRule,
				sortDirection: sortDirection,
			});
			const updated = await newMap.save();
			if(updated) {
				console.log(newMap)
				return newMap;
			}
		},

		/** 
		 	@param 	 {object} args - a map objectID, field, and the update value
			@returns {boolean} true on successful update, false on failure
		**/
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},

		/** 
		 	@param 	 {object} args - a map objectID 
			@returns {boolean} true on successful delete, false on failure
		**/
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},

		/** 
		 	@param 	 {object} args - a map id and an region object
			@returns {string} the objectID of the region or an error message
		**/
		addRegion: async(_, args) => {
			const { _id, location, region , index } = args;
			const listId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: listId});
			if(!found) return ('region not found');
			if(region._id === '') region._id = objectId;
			const listRegions = found.regions;
			if(location.length === 1){
				if(index < 0) listRegions.push(region);
				else listRegions.splice(index, 0, region);
			}
			else{
				listRegions.push(region);
			}
			const updated = await Map.updateOne({_id: listId}, {regions: listRegions});
			if(updated) return (region._id)
			else return ('Could not add region');
		},
		/** 
		 	@param 	 {object} args - a map objectID and region objectID
			@returns {array} the updated regions array on success or the initial 
							 array on failure
		**/
		deleteRegion: async (_, args) => {
			const  { _id, regionid } = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			listRegions= listRegions.filter(region => region._id.toString() !== regionid);
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions})
			if(updated) return (listRegions);
			else return (found.regions);
		},
		/** 
			@param	 {object} args - a map objectID, an region objectID, field, and
									 update value. 
			@returns {array} the updated region array on success, or the initial region array on failure
		**/
		updateRegion: async (_, args) => {
			const { _id, regionid, field,  flag } = args;
			let { value } = args
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			listRegions.map(region => {
				if(region._id.toString() === regionid) {	
					region[field] = value;
				}
			});
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions})
			if(updated) return (listRegions);
			else return (found.regions);
		},

		sortRegions: async (_, args) => {
			const { _id, criteria, parentid} = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let newDirection = found.sortDirection === 1 ? -1 : 1;
			console.log(newDirection, found.sortDirection);
			let listRegions = found.regions;
			let arrayOfIndex = [];
			let targetRegions = [];
			for(let i = 0; i < listRegions.length; i++){
				if(listRegions[i].parentid === parentid){
					targetRegions.push(listRegions[i]);
					arrayOfIndex.push(i);
				}
			}
			let sortedRegions;
			switch(criteria){
				case "name": 
				sortedRegions = Sorting.byName(targetRegions, newDirection);
				break;
				case "capital": 
				sortedRegions = Sorting.byCapital(targetRegions, newDirection);
				break;
				case "leader":
				sortedRegions = Sorting.byLeader(targetRegions, newDirection); 
				break;
				default:
					return found.regions;
			}
			for(let i = 0; i < sortedRegions.length; i++){
				listRegions[arrayOfIndex[i]] = sortedRegions[i];
			} 
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions, sortRule: criteria, sortDirection: newDirection })
			if(updated) return (sortedRegions);
		},
		/** 
			@param	 {object} args - a map objectID, an old parent objectID, and a new parent objectID
			@returns {array} the updated region array on success, or the initial region array on failure
		**/
		updateRegionParent: async (_, args) => {
			const { _id, regionid, newparent } = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			let mapName = found.name;
			let mapid = found._id;
			let newid = -1;
			let newparentname;
			if(mapName === newparent){
				newid = mapid;
			}
			else{
				for(let region of listRegions){
					if(region.name.toLowerCase() === newparent.toLowerCase()){
						newid = region._id;
						newparentname = region.name;
					}
				}
			}
			if(newid === -1) return ("not found");
			for(let i = 0; i < listRegions.length; i++){
				if(listRegions[i]._id == regionid){
					listRegions[i].parentid = newid;
				}
			}
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions})
			if(updated) return (newparentname);
		},
		/** 
		 	@param 	 {object} args - a map id, an region object, and landmark
			@returns {string} the objectID of the region or an error message
		**/
		addRegionLandmark: async(_, args) => {
			const { _id, regionid , landmark} = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			const field = "landmarks";
			let listLandmarks = [];
			let error = "";
			listRegions.map(region => {
					let tempLandmark = region[field];
					for(let landmarkelem of tempLandmark){
						if(landmarkelem.toLowerCase() === landmark.toLowerCase())
							error = "found";
					}
			});
			if(error === "found"){ return "error"}
			let baseid;
			let regionname;
			listRegions.map(region => {
				if(region._id.toString() === regionid) {	
					listLandmarks = region[field];
					listLandmarks.push(landmark)
					region[field] = listLandmarks;
					baseid = region.parentid;
					regionname = region.name;
				}
			});
			while(baseid !== _id){
				listRegions.map(region => {
					if(region._id.toString() === baseid) {	
						listLandmarks = region[field];
						listLandmarks.push(landmark + " - " + regionname)
						region[field] = listLandmarks;
						baseid = region.parentid;
					}
				});
			}
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions})
			if(updated) return (landmark);
		},
		/** 
		 	@param 	 {object} args - a map id, an region object, and landmark
			@returns {boolean} successful remove or not
		**/
		deleteRegionLandmark: async(_, args) => {
			const { _id, regionid , landmark} = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			const field = "landmarks";
			let listLandmarks = [];
			let newLandmarks = [];
			let baseid;
			let regionname;
			listRegions.map(region => {
				if(region._id.toString() === regionid) {	
					listLandmarks = region[field];
					baseid = regionid;
					regionname = region.name;
					for(let landmarkelem of listLandmarks){
						if(landmark !== landmarkelem)
							newLandmarks.push(landmarkelem);
					}
					region[field] = newLandmarks;
				}
			});
			regionname = landmark + " - " + regionname;
			while(baseid !== _id){
				newLandmarks = [];
				listRegions.map(region => {
					if(region._id.toString() === baseid) {	
						listLandmarks = region[field];
						for(let landmarkelem of listLandmarks){
							if(regionname!== landmarkelem)
								newLandmarks.push(landmarkelem);
						}
						region[field] = newLandmarks;
						baseid = region.parentid;
					}
				});
			}
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions})
			if(updated) return (true);
			return false
		},
			/** 
		 	@param 	 {object} args - a map id, an region object, and landmark
			@returns {string} the objectID of the region or an error message
		**/
		updateRegionLandmark: async(_, args) => {
			const { _id, regionid , newlandmark, oldlandmark} = args;
			const listId = new ObjectId(_id);
			const found = await Map.findOne({_id: listId});
			let listRegions = found.regions;
			const field = "landmarks";
			let listLandmarks = [];
			let error = "";
			let baseid;
			let regionname;
			listRegions.map(region => {
					let tempLandmark = region[field];
					for(let landmarkelem of tempLandmark){
						if(landmarkelem.toLowerCase() === newlandmark.toLowerCase())
							error = "found";
					}
			});
			if(error === "found"){ return "error"}
			listRegions.map(region => {
				if(region._id.toString() === regionid) {	
					listLandmarks = region[field];
					baseid = regionid;
					regionname = region.name;
					for(let i = 0; i < listLandmarks.length; i++){
						if(listLandmarks[i] === oldlandmark)
							listLandmarks[i] = newlandmark;
					}
					region[field] = listLandmarks;
				}
			});
			while(baseid !== _id){
				listRegions.map(region => {
					if(region._id.toString() === baseid) {	
						listLandmarks = region[field];
						for(let i = 0; i < listLandmarks.length; i++){
							if(listLandmarks[i] === oldlandmark + " - " + regionname)
								listLandmarks[i] = newlandmark + " - " + regionname;
						}
						region[field] = listLandmarks;
						baseid = region.parentid;
					}
				});
			}
			const updated = await Map.updateOne({_id: listId}, { regions: listRegions})
			if(updated) return (newlandmark);
		},
	}
}