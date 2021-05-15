import Logo 							from '../navbar/Logo';
import EarthPic							from '../Pictures/earth.jpg'
import Login 							from '../modals/Login';
import DeleteMapModal					from '../modals/DeleteMap'
import DeleteRegionModal				from '../modals/DeleteRegion';
import DeleteLandmarkModal				from '../modals/DeleteLandmark';
import CreateAccount 					from '../modals/CreateAccount';
import UpdateAccount					from '../modals/UpdateAccount';
import NameMap							from '../modals/NameMap';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MapContents						from '../map/MapContents'
import RegionContents					from '../region/RegionContents';
import RegionViewerContents				from '../region/RegionViewerContents';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_MAPS} 	from '../../cache/queries';
import React, { useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide, WButton} from 'wt-frontend';
import {  SortRegion_Transaction,
	UpdateRegion_Transaction, 
	EditRegion_Transaction,
    ChangeParent_Transaction,
	UpdateLandmark_Transaction, 
	EditLandmark_Transaction} 			from '../../utils/jsTPS';

const Homescreen = (props) => {

	const keyCombination = (e) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

	const auth = props.user === null ? false : true;
	const userName = props.user !== null ? props.user.firstName + " " + props.user.lastName : "";
	const userid = props.user !== null ? props.user._id : "";
	let maps 	= [];
	let MapData = [];
	const [sortRule, setSortRule] = useState('unsorted'); // 1 is ascending, -1 desc
	const [subregions, setSubregions] 		= useState([]);
	const [listSubregions, setListSubregions]	= useState([]);
	const [region, setRegion]				= useState(null);
	const [activeMap, setActiveMap] 		= useState({});
	const [activeSubregion, setActiveSubregion] = useState({});
	const [activeRegions, setActiveRegions] = useState([])
	const [activeids, setActiveids]			= useState([])
	const [showDeleteMap, toggleShowDeleteMap] 	= useState(false);
	const [showDeleteRegion, toggleShowDeleteRegion] = useState(false);
	const [showDeleteLandmark, toggleShowDeleteLandmark] = useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showNameMap, toggleShowNameMap]	= useState(false);
	const [showRegionView, toggleRegionView] = useState(false);
	const [selectedMap, setSelectedMap]		= useState("");
	const [selectedRegion, setSelectedRegion] = useState([]);
	const [selectedLandmark, setSelectedLandmark] = useState([])
	const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());
	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	const isMapActive = activeMap._id === undefined ? false : true;

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		maps = data.getAllMaps;
		MapData = maps;
	}

	// NOTE: might not need to be async
	const reloadMaps = async () => {
		if (activeMap._id) {
			let tempID = activeMap._id;
			let map = maps.find(map => map._id === tempID);
			setActiveMap(map);
		}
	}

	const loadMap = (map) => {
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setActiveMap(map);
	}

	const mutationOptions = {
		refetchQueries: [{ query: GET_DB_MAPS }], 
		awaitRefetchQueries: true,
		onCompleted: () => reloadMaps()
	}

	const [SortRegions] 		= useMutation(mutations.SORT_REGIONS, mutationOptions);
	const [UpdateRegion] 	= useMutation(mutations.UPDATE_REGION, mutationOptions);
	const [UpdateMapField] 			= useMutation(mutations.UPDATE_MAP_FIELD, mutationOptions);
	const [DeleteRegion] 			= useMutation(mutations.DELETE_REGION, mutationOptions);
	const [AddRegion] 			= useMutation(mutations.ADD_REGION, mutationOptions);
	const [DeleteMap] 			= useMutation(mutations.DELETE_MAP, mutationOptions);
	const [UpdateRegionParent] 	= useMutation(mutations.UPDATE_REGION_PARENT, mutationOptions);
	const [AddRegionLandmark]	= useMutation(mutations.ADD_REGION_LANDMARK, mutationOptions);
	const [DeleteRegionLandmark] = useMutation(mutations.DELETE_REGION_LANDMARK, mutationOptions);
	const [UpdateRegionLandmark] = useMutation(mutations.UPDATE_REGION_LANDMARK, mutationOptions);

	
	const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const loadNewSubregion = (subregion) =>{
		setActiveSubregion(subregion);
		activeids.push(subregion._id);
		activeRegions.push(subregion);
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
	}

	const setAncestorRegion = (regionData) => {
		activeids.push(regionData._id);
		activeRegions.push(regionData)
	}

	const addRegion = async () => {
		let map = activeMap;
		const region = map.regions
		const newRegion = activeRegions.length === 1 ? {
			_id: '',
			parentid: map._id,
			name: 'No Name',
			capital: 'No Capital',
			leader: 'No One',
			landmarks: []
		} :
		{
			_id: '',
			parentid: activeids[activeids.length - 1],
			name: 'No Name',
			capital: 'No Capital',
			leader: 'No One',
			landmarks: []
		}
		let opcode = 1;
		let mapID = activeMap._id;
		let regionID = newRegion._id;
		let transaction = new UpdateRegion_Transaction(mapID, regionID, activeids, newRegion, opcode, AddRegion, DeleteRegion)
		props.tps.addTransaction(transaction)
		tpsRedo();
	};

	const deleteRegion = async () => {
		let mapID = activeMap._id;
		let regionID = selectedRegion[0];
		let index = selectedRegion[1];
		let opcode = 0;
		let delregion = selectedRegion[2];
		let regionToDelete = {
			_id: delregion._id,
			parentid: delregion.parentid,
			name: delregion.name,
			capital: delregion.capital,
			leader: delregion.leader,
			landmarks: delregion.landmarks
		}
		let transaction = new UpdateRegion_Transaction(mapID, regionID, activeids, regionToDelete, opcode, AddRegion, DeleteRegion, index)
		props.tps.addTransaction(transaction)
		tpsRedo();
	};

	const editRegion = async (regionid, field, newvalue, oldvalue) => {
		let transaction = new EditRegion_Transaction(activeMap._id, regionid, field, newvalue, oldvalue, UpdateRegion)
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteMap = async (_id) => {
		console.log(_id);
		DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		loadMap({});
	};


	const updateMapField = async (_id, field, value) => {
		const { data } = await UpdateMapField({ variables: { _id: _id, field: field, value: value}});
		return data;
	};

	const sort = async (criteria) =>{
		let prevSortRule = sortRule;
		setSortRule(criteria);
		let parentid = activeids[activeids.length - 1];
		let transaction = new SortRegion_Transaction(activeMap._id, criteria, prevSortRule, parentid, SortRegions);
		console.log(transaction);
		props.tps.addTransaction(transaction);
		tpsRedo();
 	}

	const updateRegionParent = async (currid, newparent) =>{
		const { data } = await UpdateRegionParent({ variables: {_id: activeMap._id, regionid: currid, newparent: newparent}, refetchQueries: [{ query: GET_DB_MAPS }]})
		let name = data.updateRegionParent;
		if(name === "not found")
			alert("Parent not found.")
	}

	const addNewLandmark = async(landmark, regionid) =>{
		let opcode = 1
		let regions = MapData[0].regions;
		const field = "landmarks";
		let error = "";
		regions.map(region => {
				let tempLandmark = region[field];
				for(let landmarkelem of tempLandmark){
					if(landmarkelem.toLowerCase() === landmark.toLowerCase())
						error = "found";
				}
		});
		if(error !== "found"){
			let transaction = new UpdateLandmark_Transaction(activeMap._id, regionid._id, landmark, opcode, AddRegionLandmark, DeleteRegionLandmark);
			props.tps.addTransaction(transaction);
			tpsRedo();
		}
		else
			alert("Landmark Already Exists.");
	}

	const deleteLandmark = async() =>{
		let opcode = 0;
		let regionid = selectedLandmark[0];
		let landmark = selectedLandmark[1];
		let index = selectedLandmark[2];
		let transaction = new UpdateLandmark_Transaction(activeMap._id, regionid, landmark, opcode, AddRegionLandmark, DeleteRegionLandmark, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
		const { data } = await DeleteRegionLandmark({ variables: {_id: activeMap._id, regionid: regionid, landmark: landmark}})
	}

	const updateLandmark = async(oldlandmark, newlandmark, regionid) =>{
		const field = "landmarks";
		let regions = MapData[0].regions;
		let error = "";
		regions.map(region => {
				let tempLandmark = region[field];
				for(let landmarkelem of tempLandmark){
					if(landmarkelem.toLowerCase() === newlandmark.toLowerCase())
						error = "found";
				}
		});
		if(error !== "found"){
			let transaction = new EditLandmark_Transaction(activeMap._id, regionid, field, oldlandmark, newlandmark, UpdateRegionLandmark)
			props.tps.addTransaction(transaction);
			tpsRedo();
		}
		else
			alert("Landmark Already Exists");
	}

	const goToNextSibling = (nextSibling) =>{
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setRegion(nextSibling);
		let regions = MapData[0].regions;
		setSubregions(regions.filter(regionelem => regionelem.parentid === nextSibling._id))
	}

	const goToPrevSibling = (prevSibling) =>{
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setRegion(prevSibling)
		let regions = MapData[0].regions;
		setSubregions(regions.filter(regionelem => regionelem.parentid === prevSibling._id))
	}

	const resetActiveRegions = () =>{
		activeRegions.length = 2;
		activeids.length = 2;
	}

	const goToParent = (parent) =>{
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		if(parent._id === activeMap._id){
			activeRegions.length = 1;
			activeids.length = 1;
			setActiveSubregion({})
		}
		else{
			for(let i = 0; i < activeRegions.length; i++){
				if(activeRegions[i]._id === parent._id){
					activeRegions.length = i + 1;
					activeids.length = i + 1;
					setActiveSubregion(parent);
				}
			}
		}
	}

	const handleSetActive = (_id) => {
		const selectedList = maps.find(map => map._id === _id);
		loadMap(selectedList);
	};

	const setMapToDelete = (_id) =>{
		setSelectedMap(_id)
	}

	const setRegionToDelete = (_id, index, region) =>{
		selectedRegion.length = 0;
		selectedRegion.push(_id);
		selectedRegion.push(index);
		selectedRegion.push(region);
	}

	const setLandmarkToDelete = (_id, landmark, index) =>{
		selectedLandmark.length = 0;
		selectedLandmark.push(_id);
		selectedLandmark.push(landmark)
		selectedLandmark.push(index);
	}

	const setInactive = () =>{
		setActiveMap("")
		setActiveSubregion("");
		setActiveids([]);
		toggleRegionView(false)
		setRegion({})
		setListSubregions([])
		setActiveRegions([])
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
	}

	const setShowLogin = () => {
		toggleShowDeleteMap(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDeleteMap(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDeleteMap = (id) => {
		setMapToDelete(id)
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleShowDeleteMap(!showDeleteMap)
	};

	const setShowDeleteRegion = (id, index, region) => {
		setRegionToDelete(id, index, region)
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleShowDeleteMap(false);
		toggleShowDeleteRegion(!showDeleteRegion);
	};

	const setShowDeleteLandmark = (id, landmark, index) =>{
		setLandmarkToDelete(id, landmark, index);
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleShowDeleteMap(false);
		toggleShowDeleteRegion(false);
		toggleShowDeleteLandmark(!showDeleteLandmark)
	}

	const setShowUpdate = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDeleteMap(false);
		toggleShowNameMap(false);
		toggleShowUpdate(!showUpdate)
	}

	const setShowNameMap = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDeleteMap(false);
		toggleShowUpdate(false);
		toggleShowNameMap(!showNameMap);
	}

	const setShowRegionView = (data) =>{
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setRegion(data);
		let regions = MapData[0].regions;
		let mapid = activeMap._id;
		if(data !== undefined){
			setSubregions(regions.filter(regionelem => regionelem.parentid === data._id))
			if(activeRegions.length === 1)
				setListSubregions(regions.filter(regionelem => mapid === regionelem.parentid))
			else
				setListSubregions(regions.filter(regionelem => regionelem.parentid === data.parentid));
		}
		else
			setInactive();
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDeleteMap(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleRegionView(!showRegionView)
	}

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' setInactive = {setInactive} activeMap = {activeMap._id} activeRegions = {activeRegions}
							setActiveMap = {setActiveMap} setActiveSubregion = {setActiveSubregion} goToParent = {goToParent} toggleRegionView = {toggleRegionView}/>
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}	setActiveMap={loadMap}
							getUser = {userName}			setShowUpdate = {setShowUpdate}

						/>
					</ul>
				</WNavbar>
			</WLHeader>
			
			<WLMain style = {{backgroundColor: "#32599c"}}>
			{
				auth ? 
				isMapActive ?
				showRegionView?
				<RegionViewerContents getRegion = {region} subregions = {subregions} activeMap = {activeMap} activeRegions = {activeRegions} setShowRegionView = {setShowRegionView}
				updateRegionParent = {updateRegionParent} goToNextSibling = {goToNextSibling} goToPrevSibling = {goToPrevSibling} listSubregions = {listSubregions}
				addNewLandmark = {addNewLandmark} MapData = {MapData} deleteLandmark = {deleteLandmark} setShowDeleteLandmark = {setShowDeleteLandmark}
				updateLandmark = {updateLandmark} resetActiveRegions = {resetActiveRegions}
				tpsUndo = {tpsUndo} tpsRedo = {tpsRedo} canUndo = {canUndo} canRedo = {canRedo}></RegionViewerContents>
				:
				<RegionContents 
				 	activeMap = {activeMap} addRegion = {addRegion} setShowRegionView = {setShowRegionView} loadNewSubregion = {loadNewSubregion}
					 setShowDeleteRegion = {setShowDeleteRegion} activeSubregion = {activeSubregion} setShowRegionView = {setShowRegionView} 
					 loadNewSubregion = {loadNewSubregion} activeRegions = {activeRegions} editRegion = {editRegion} sort = {sort} 
					 tpsUndo = {tpsUndo} tpsRedo = {tpsRedo} canUndo = {canUndo} canRedo = {canRedo}>  
				</RegionContents>
				:
				<MapContents
					mapIDs = {MapData}	activeMap = {activeMap._id} 
					handleSetActive = {handleSetActive} key = {activeMap._id}
					updateMapField = {updateMapField} setShowDeleteMap = {setShowDeleteMap}
					setShowNameMap = {setShowNameMap} setAncestorRegion = {setAncestorRegion}
				></MapContents>
				:
				<div className = "welcome-text">
					<p>Welcome to The World Data Mapper.</p>
					<img src = {EarthPic}  alt = "Earth" style = {{width: "400px", height: "400px"}}></img>
				</div>
			}
			</WLMain>

			{
				showDeleteMap && (<DeleteMapModal deleteMap={deleteMap} activeid={selectedMap} setShowDeleteMap={setShowDeleteMap}/>)
			}

			{
				showDeleteRegion && (<DeleteRegionModal setShowDeleteRegion={setShowDeleteRegion} setShowDeletRegion = {setShowDeleteRegion} 
				deleteRegion = {deleteRegion}></DeleteRegionModal>)
			}

			{
				showDeleteLandmark && (<DeleteLandmarkModal deleteLandmark = {deleteLandmark} setShowDeleteLandmark = {setShowDeleteLandmark}
				selectedLandmark = {selectedLandmark}></DeleteLandmarkModal>)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} reloadTodos={refetch}setShowLogin={setShowLogin} />)
			}

			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} _id = {props.user._id}/>)
			}

			{
				showNameMap && (<NameMap setShowNameMap={setShowNameMap} user = {props.user} loadMap = {loadMap} setAncestorRegion = {setAncestorRegion}></NameMap>)
			}
		</WLayout>
	);
};

export default Homescreen;