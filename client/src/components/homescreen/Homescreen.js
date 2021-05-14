import Logo 							from '../navbar/Logo';
import EarthPic							from '../Pictures/earth.jpg'
import Login 							from '../modals/Login';
import DeleteMapModal					from '../modals/DeleteMap'
import DeleteRegionModal				from '../modals/DeleteRegion';
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
import { UpdateListField_Transaction, 
	SortItems_Transaction,
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction } 				from '../../utils/jsTPS';

const Homescreen = (props) => {

	const keyCombination = (e, callback) => {
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
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate] 	= useState(false);
	const [showNameMap, toggleShowNameMap]	= useState(false);
	const [showRegionView, toggleRegionView] = useState(false);
	const [selectedMap, setSelectedMap]		= useState("");
	const [selectedRegion, setSelectedRegion] = useState("");
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
	const [DeleteMap] 			= useMutation(mutations.DELETE_MAP);
	const [UpdateRegionParent] 	= useMutation(mutations.UPDATE_REGION_PARENT);

	
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
		const { data } = await AddRegion({variables: {region:  newRegion, location: activeids, _id: mapID, index: -1}})
	};

	const deleteRegion = async (_id) => {
		const { data } = await DeleteRegion({variables: {regionid: _id, _id: activeMap._id}})
	};

	const editRegion = async (regionid, field, value) => {
		const { data } = await UpdateRegion({variables: {regionid: regionid, _id: activeMap._id, field: field, value: value}})
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
		setSortRule(criteria);
		let parentid = activeids[activeids.length - 1];
		const { data } = await SortRegions({ variables: {_id: activeMap._id, criteria: criteria, parentid: parentid}})
 	}

	const updateRegionParent = async (currid, newparent) =>{
		const { data } = await UpdateRegionParent({ variables: {_id: activeMap._id, regionid: currid, newparent: newparent}, refetchQueries: [{ query: GET_DB_MAPS }]})
		let name = data.updateRegionParent;
		if(name === "not found")
			alert("Parent not found.")
	}

	const goToNextSibling = (nextSibling) =>{
		setRegion(nextSibling);
		let regions = MapData[0].regions;
		setSubregions(regions.filter(regionelem => regionelem.parentid === nextSibling._id))
	}

	const goToPrevSibling = (prevSibling) =>{
		setRegion(prevSibling)
		let regions = MapData[0].regions;
		setSubregions(regions.filter(regionelem => regionelem.parentid === prevSibling._id))
	}

	const handleSetActive = (_id) => {
		const selectedList = maps.find(map => map._id === _id);
		loadMap(selectedList);
	};

	const setMapToDelete = (_id) =>{
		setSelectedMap(_id)
	}

	const setRegionToDelete = (_id) =>{
		setSelectedRegion(_id);
	}

	const setInactive = () =>{
		setActiveMap("")
		setActiveSubregion("");
		toggleRegionView(false)
		setActiveRegions([])
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

	const setShowDeleteRegion = (id) => {
		setRegionToDelete(id)
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleShowDeleteMap(false);
		toggleShowDeleteRegion(!showDeleteRegion);
	};

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
		setRegion(data);
		let regions = MapData[0].regions;
		let mapid = activeMap._id;
		if(data !== undefined){
			setSubregions(regions.filter(regionelem => regionelem.parentid === data._id))
			if(activeRegions.length === 1)
				setListSubregions(regions.filter(regionelem => mapid === regionelem.parentid))
			else
				setListSubregions(regions.filter(regionelem => regionelem._id === data.parentid));
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
							setActiveMap = {setActiveMap} setActiveSubregion = {setActiveSubregion}/>
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
				updateRegionParent = {updateRegionParent} goToNextSibling = {goToNextSibling} goToPrevSibling = {goToPrevSibling} listSubregions = {listSubregions}></RegionViewerContents>
				:
				<RegionContents 
				 	activeMap = {activeMap} addRegion = {addRegion} setShowRegionView = {setShowRegionView} loadNewSubregion = {loadNewSubregion}
					 setShowDeleteRegion = {setShowDeleteRegion} activeSubregion = {activeSubregion} setShowRegionView = {setShowRegionView} 
					 loadNewSubregion = {loadNewSubregion} activeRegions = {activeRegions} editRegion = {editRegion} sort = {sort}>  
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
					activeid = {selectedRegion} deleteRegion = {deleteRegion}></DeleteRegionModal>)
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