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
import { GET_DB_MAPS } 				    from '../../cache/queries';
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

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS, mutationOptions);
	const [sortTodoItems] 		= useMutation(mutations.SORT_ITEMS, mutationOptions);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD, mutationOptions);
	const [UpdateMapField] 			= useMutation(mutations.UPDATE_MAP_FIELD, mutationOptions);
	const [DeleteRegion] 			= useMutation(mutations.DELETE_REGION, mutationOptions);
	const [AddRegion] 			= useMutation(mutations.ADD_REGION, mutationOptions);
	const [DeleteMap] 			= useMutation(mutations.DELETE_MAP);

	
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
			landmarks: [],
			subregions: [],
		} :
		{
			_id: '',
			parentid: activeids[activeids.length - 1],
			name: 'No Name',
			capital: 'No Capital',
			leader: 'No One',
			landmarks: [],
			subregions: [],
		}
		let opcode = 1;
		let regionID = newRegion._id;
		let mapID = activeMap._id;
		const { data } = await AddRegion({variables: {region:  newRegion, location: activeids, _id: mapID, index: -1}})
	};

	const deleteRegion = async (_id) => {
	const { data } = await DeleteRegion({variables: {regionid: _id, location: activeids, _id: activeMap._id}})
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeMap._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeMap._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const deleteMap = async (_id) => {
		DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		loadMap({});
	};


	const updateMapField = async (_id, field, value) => {
		const { data } = await UpdateMapField({ variables: { _id: _id, field: field, value: value}});
		return data;
	};

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
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDeleteMap(false);
		toggleShowUpdate(false);
		toggleShowNameMap(false);
		toggleRegionView(!showRegionView)
	}

	const sort = (criteria) => {
		let prevSortRule = sortRule;
		setSortRule(criteria);
		let transaction = new SortItems_Transaction(activeMap._id, criteria, prevSortRule, sortTodoItems);
		console.log(transaction)
		props.tps.addTransaction(transaction);
		tpsRedo();
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
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							reloadTodos={refetch} 			setActiveMap={loadMap}
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
				<RegionViewerContents getRegion = {region} activeMap = {activeMap} activeRegions = {activeRegions} setShowRegionView = {setShowRegionView}
				activeRegions = {activeRegions}></RegionViewerContents>
				:
				<RegionContents 
				 	activeMap = {activeMap} addRegion = {addRegion} setShowRegionView = {setShowRegionView} loadNewSubregion = {loadNewSubregion}
					 setShowDeleteRegion = {setShowDeleteRegion} activeSubregion = {activeSubregion} setShowRegionView = {setShowRegionView} 
					 loadNewSubregion = {loadNewSubregion} activeRegions = {activeRegions}> 
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