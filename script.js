javascript: var regExp = /^0[0-9].*$/;
let disableBuildings = [];
let disableUnits = [];
let config;
let buildings = [
	'main',
	'barracks',
	'stable',
	'garage',
	'church',
	'church_f',
	'watchtower',
	'snob',
	'smith',
	'place',
	'statue',
	'market',
	'wood',
	'stone',
	'iron',
	'farm',
	'storage',
	'hide',
	'wall',
];
let units = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob', 'militia'];
let datas = [
	'max_level',
	'min_level',
	'wood',
	'stone',
	'iron',
	'pop',
	'wood_factor',
	'stone_factor',
	'iron_factor',
	'pop_factor',
	'build_time',
	'build_time_factor',
];
let dat = ['build_time', 'pop', 'speed', 'attack', 'defense', 'defense_cavalry', 'defense_archer', 'carry'];
let firstLevelPoint = [10, 16, 20, 24, 10, 10, 42, 512, 19, 0, 24, 10, 6, 6, 6, 5, 6, 5, 8];
let forumURL = 'https://forum.tribalwars.net/index.php?members/oreg.123551';
let gear = 'https://raw.githubusercontent.com/oreg-kh/Unit-and-building-simulator/master/gear.png';
let token = atob('ZjRiNDIzZWE4MzgxMDJmZmNkMTdmY2M4MDdmY2Y1MTkxZjlkN2I5Yw==');
const obj = { buildingsObj: {}, unitsObj: {}, world: {} };
let errorText = {
	buildings: 'Retrieving the building data from the server was unsuccessful! Try again later..',
	units: 'Querying the data of the units from the server was unsuccessful! Try again later.',
	unitsCost: 'Querying the raw material costs of the units from the server was unsuccessful! Try again later.',
	speed: 'Querying the server speed from the server was unsuccessful! Try again later.',
};
let prompts = {
	text: [
		`This code can be used when importing.`,
		`\n`,
		`\n`,
		`With its help, you can save your profile or send it to someone else.`,
		`\n`,
		`Copy to clipboard: CTRL+C.`,
	].join(''),
};
let helpTooltip = {
	resource: [
		`Raw material bonus:`,
		`<br/>`,
		`<br/>`,
		` :: Here you can specify by how many percentages the production of wood, clay and iron is increased.`,
	].join(''),
	pop: [
		`Population bonus:`,
		`<br/>`,
		`<br/>`,
		` :: Here you can specify by how many percentages the farm's capacity has been increased.`,
		` :: Bonus village, flag and inventory upgrade that can be installed separately.`,
	].join(''),
	haul: [
		`Load capacity bonus:`,
		`<br/>`,
		`<br/>`,
		` :: Here you can specify how many percentages the shipping capacity of the units has been increased.`,
		` :: Flag and inventory increase can be set separately.`,
	].join(''),
	recruit: [
		`Training bonus:`,
		`<br/>`,
		`<br/>`,
		` :: Here you can specify by how many percentages the training speed of the barracks, stables, workshop and academy is increased.`,
	].join(''),
	market: [
		`Market bonus:`,
		`<br/>`,
		`<br/>`,
		` :: Here you can enter the number of traders increased by how many percentages.`,
		` :: Bonus village and inventory upgrade can be installed separately.`,
	].join(''),
	storage: [
		`Warehouse bonus:`,
		`<br/>`,
		`<br/>`,
		` :: Here you can specify how many percentages the storage capacity has been increased.`,
		` :: Bonus village and inventory upgrade can be installed separately.`,
	].join(''),
};
let game = window.image_base;
let imageSrc = {
	main: game + 'buildings/mid/main3.png',
	barracks: game + 'buildings/mid/barracks3.png',
	stable: game + 'buildings/mid/stable3.png',
	garage: game + 'buildings/mid/garage3.png',
	church: game + 'buildings/mid/church3.png',
	church_f: game + 'buildings/mid/church1.png',
	watchtower: game + 'buildings/mid/watchtower3.png',
	academy: game + 'buildings/mid/snob1.png',
	smith: game + 'buildings/mid/smith3.png',
	place: game + 'buildings/mid/place1.png',
	statue: game + 'buildings/mid/statue1.png',
	market: game + 'buildings/mid/market3.png',
	timber_camp: game + 'buildings/mid/wood3.png',
	clay_pit: game + 'buildings/mid/stone3.png',
	iron_mine: game + 'buildings/mid/iron3.png',
	farm: game + 'buildings/mid/farm3.png',
	warehouse: game + 'buildings/mid/storage3.png',
	hide: game + 'buildings/mid/hide1.png',
	wall: game + 'buildings/mid/wall3.png',
	spear: game + 'unit/unit_spear.png',
	sword: game + 'unit/unit_sword.png',
	axe: game + 'unit/unit_axe.png',
	archer: game + 'unit/unit_archer.png',
	spy: game + 'unit/unit_spy.png',
	light: game + 'unit/unit_light.png',
	marcher: game + 'unit/unit_marcher.png',
	heavy: game + 'unit/unit_heavy.png',
	ram: game + 'unit/unit_ram.png',
	catapult: game + 'unit/unit_catapult.png',
	knight: game + 'unit/unit_knight.png',
	snob: game + 'unit/unit_snob.png',
	militia: game + 'unit/unit_militia.png',
	wood: game + 'holz.png',
	stone: game + 'lehm.png',
	iron: game + 'eisen.png',
	header: game + 'face.png',
	gold: game + 'gold.png',
	popFlag: game + 'flags/medium/6_5.png',
	haulFlag: game + 'flags/medium/8_5.png',
	inventory: game + 'icons/inventory.png',
	bonusVillage: game + '/map_new/b1.png',
	questionMark: game + 'questionmark.png',
	time: game + 'time.png',
};

content = `
    <div id="myTable">
        <div style="float: left;margin-right:10px">
            <table class="inlineTable modes">
		        <tbody>
			        <tr>
				        <th>Construction</th>
				        <th>Level</th>
				        <th>Wood</th>
				        <th>Clay</th>
				        <th>Iron</th>
				        <th>Population</th>
				        <th>Points</th>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.main}>Village Headquarters</td>
				        <td><input type="number" id="headquarters" class="building" maxlength="2" min="1" max="30" autofocus></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.barracks}>Barracks</td>
				        <td><input type="number" id="barracks" class="building" maxlength="2" min="0" max="25"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.stable}>Stable</td>
				        <td><input type="number" id="stable" class="building" maxlength="2" min="0" max="20"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
                    		</tr>
			        <tr>
				        <td><img src=${imageSrc.garage}>Workshop</td>
				        <td><input type="number" id="garage" class="building" maxlength="2" min="0" max="15"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.church}>Church</td>
				        <td><input type="number" id="church" class="building" maxlength="1" min="0" max="3"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.church_f}>First church</td>
				        <td><input type="number" id="church_f" class="building" maxlength="1" min="0" max="1"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.watchtower}>Watchtower</td>
				        <td><input type="number" id="watchtower" class="building" maxlength="2" min="0" max="20"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
                    		<tr>
				        <td><img src=${imageSrc.academy}>Academy</td>
				        <td><input type="number" id="academy" class="building" maxlength="1" min="0" max="1"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
                    		</tr>
			        <tr>
				        <td><img src=${imageSrc.smith}>Smithy</td>
				        <td><input type="number" id="smith" class="building" maxlength="2" min="0" max="20"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.place}>Rally point</td>
				        <td><input type="number" id="place" class="building" maxlength="1" min="0" max="1"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.statue}>Statue</td>
				        <td><input type="number" id="statue" class="building" maxlength="1" min="0" max="1"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.market}>Market</td>
				        <td><input type="number" id="market" class="building" maxlength="2" min="0" max="25"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.timber_camp}>Timber camp</td>
				        <td><input type="number" id="timber_camp" class="building" maxlength="2" min="0" max="30"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.clay_pit}>Clay pit</td>
				        <td><input type="number" id="clay_pit" class="building" maxlength="2" min="0" max="30"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.iron_mine}>Iron mine</td>
				        <td><input type="number" id="iron_mine" class="building" maxlength="2" min="0" max="30"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.farm}>Farm</td>
				        <td><input type="number" id="farm" class="building" maxlength="2" min="1" max="30"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.warehouse}>Warehouse</td>
				        <td><input type="number" id="warehouse" class="building" maxlength="2" min="1" max="30"</td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.hide}>Hiding place</td>
				        <td><input type="number" id="hide" class="building" maxlength="2" min="0" max="10"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.wall}>Wall</td>
				        <td><input type="number" id="wall" class="building" maxlength="2" min="0" max="20"></td>
				        <td class="woodCost">0</td>
				        <td class="stoneCost">0</td>
				        <td class="ironCost">0</td>
				        <td class="popCost">0</td>
				        <td class="points">0</td>
			        </tr>
			        <tr>
				        <td></td>
				        <td style="text-align:center">&#8679</td>
				        <td><img src=${imageSrc.wood}>&nbsp<span id="currentBuildingsWoodCost">0</span></td>
				        <td><img src=${imageSrc.stone}>&nbsp<span id="currentBuildingsStoneCost">0</span></td>
				        <td><img src=${imageSrc.iron}>&nbsp<span id="currentBuildingsIronCost">0</span></td>
				        <td class="crosshatchedright" colspan="2">&#x21E6; Costs of current levels</td>
			        </tr>
			        <tr>
				        <td class="crosshatchedleft">Minimum level:</td>
				        <td style="text-align:center"><input type="radio" id="minimum" onclick="minimum()" name="name"></td>
			        </tr>
			        <tr>
				        <td class="crosshatchedright">Maximum level:</td>
				        <td style="text-align:center"><input type="radio" id="maximum" onclick="maximum()" name="name"></td>
			        </tr>
		        </tbody>
	        </table>
        </div>
        <div style="float: left;margin-right:10px">
	        <table class="inlineTable">
		        <tbody>
			        <tr>
				        <th>Unity</th>
				        <th>Quantity</th>
				        <th>Training time</th>
				        <th>Per building</th>
				        <th>Transport capacity</th>
				        <th>Farm space</th>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.spear}>Spear fighter</td>
				        <td><input type="number" id="spear" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="sumbuildtime" rowspan="4">00:00:00:00</td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.sword}>Swordsman</td>
				        <td><input type="number" id="sword" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.axe}>Axeman</td>
				        <td><input type="number" id="axe" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.archer}>Archer</td>
				        <td><input type="number" id="archer" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.spy}>Scout</td>
				        <td><input type="number" id="spy" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
                        <td class="sumbuildtime" rowspan="4">00:00:00:00</td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.light}>Light cavalry</td>
				        <td><input type="number" id="light" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.marcher}>Mounted archer</td>
				        <td><input type="number" id="marcher" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.heavy}>Heavy cavalry</td>
				        <td><input type="number" id="heavy" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.ram}>Ram</td>
				        <td><input type="number" id="ram" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="sumbuildtime" rowspan="2">00:00:00:00</td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.catapult}>Catapult</td>
				        <td><input type="number" id="catapult" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.knight}>Paladin</td>
				        <td><input type="number" id="knight" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="crosshatchedright"></td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.snob}>Nobleman</td>
				        <td><input type="number" id="snob" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="crosshatchedright"></td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
			        <tr class="spaceUnder">
				        <td><img src=${imageSrc.militia}>Militia</td>
				        <td><input type="number" id="militia" class="unit" maxlength="5" min="0" max="32000"></td>
				        <td>
                            <span>
                                <span class="icon header time"></span>
                                <span class="build_time">00:00:00:00</span>
                            </span>
                        </td>
				        <td class="crosshatchedright"></td>
				        <td class="haul">0</td>
				        <td class="pop">0</td>
			        </tr>
                    <tr class="separator" />
		        </tbody>
            </table>
            <table class="inlineTable bonus">
                <tbody>
			        <tr>
                        <th colspan="3">Raw material bonus<img src=${imageSrc.questionMark} title="${helpTooltip.resource}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="3">Population bonus<img src=${imageSrc.questionMark} title="${helpTooltip.pop}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="2">Load capacity bonus<img src=${imageSrc.questionMark} title="${helpTooltip.haul}" class="tooltip"></th>
                    </tr>
			        <tr>
				        <td><img src=${imageSrc.timber_camp}><input class="bon" id="woodBonus" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.clay_pit}><input class="bon" id="stoneBonus" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.iron_mine}><input class="bon" id="ironBonus" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
				        <td><img src=${imageSrc.bonusVillage}><input class="bon" id="popBonusVillage" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.popFlag}><input class="bon" id="popFlag" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.inventory}><input class="bon" id="popInventory" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
				        <td><img src=${imageSrc.haulFlag}><input class="bon" id="haulFlag" type="number" min="0" max="300" value="0"></td>
				        <td><img src=${imageSrc.inventory}><input class="bon" id="haulInventory" type="number" min="0" max="500" value="0"></td>
                    </tr>
                    <tr class="separator" />
		        </tbody>
            </table>
            <table class="inlineTable bonus">
                <tbody>
                    <tr>
                        <th colspan="4">Training bonus<img src=${imageSrc.questionMark} title="${helpTooltip.recruit}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="2">Market bonus<img src=${imageSrc.questionMark} title="${helpTooltip.market}" class="tooltip"></th>
                        <th class="space"></th>
                        <th colspan="2">Warehouse bonus<img src=${imageSrc.questionMark} title="${helpTooltip.storage}" class="tooltip"></th>
                    </tr>
                    <tr>
				        <td><img src=${imageSrc.barracks}><input class="bon" id="barracksBonus" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.stable}><input class="bon" id="stableBonus" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.garage}><input class="bon" id="garageBonus" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.academy}><input class="bon" id="academyBonus" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
				        <td><img src=${imageSrc.bonusVillage}><input class="bon" id="merchantsBonusVillage" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.inventory}><input class="bon" id="merchantsInventory" type="number" min="0" max="500" value="0"></td>
                        <td class="space"></td>
				        <td><img src=${imageSrc.bonusVillage}><input class="bon" id="storageBonusVillage" type="number" min="0" max="500" value="0"></td>
				        <td><img src=${imageSrc.inventory}><input class="bon" id="storageInventory" type="number" min="0" max="500" value="0"></td>
			        </tr>
                    <tr class="separator" />
		        </tbody>
            </table>
            <table class="inlineTable border"">
                <tbody>
                    <tr>
                        <td>
                            <label for="sablon">Profilok: </label>
                            <select id="sablon">
                                <option selected hidden>opciÃ³k</option>
                            </select>
                            &nbsp;
                            <input type="button" value="Save" onclick="store()">
                            &nbsp;
                            <input type="button" value="Remove" onclick="removeOptions()">
                            &nbsp;
                            <input type="button" value="Export" onclick="exports()">
                            &nbsp;
                            <input type="button" value="Import" onclick="imports()">
                        </td>
                    </tr>
		        </tbody>
            </table>
        </div>
        <div style="float: left;margin-right:10px">
	        <table class="inlineTable modesb">
		        <tbody>
			        <tr>
				        <th colspan="2">Properties of buildings</th>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.header}>Farm capacity</td>
				        <td class="property" id="population" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.header}>Farm occupied</td>
				        <td class="property" id="locked" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.header}>Farm space remaining</td>
				        <td class="property" id="free" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.gold}>Points</td>
				        <td class="property" id="sumPoints" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.hide}>Hidden resources</td>
				        <td class="property" id="hiddenResources" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.market}>Trade merchants</td>
				        <td class="property" id="merchants" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.warehouse}>Warehouse capacity</td>
				        <td class="property" id="capacity" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.wall}>Wall defense bonus</td>
				        <td class="property" id="wallBonus" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.timber_camp}>Wood production</td>
				        <td class="property" id="woodProd" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.clay_pit}>Clay production</td>
				        <td class="property" id="stoneProd" style="width: 50%">0</td>
			        </tr>
			        <tr>
				        <td style="width: 50%"><img src=${imageSrc.iron_mine}>Iron production</td>
				        <td class="property" id="ironProd" style="width: 50%">0</td>
			        </tr>
                    <tr class="separator" />
		        </tbody>
	        </table>
            <table class="inlineTable modesc">
                <tbody>
			        <tr>
				        <th colspan="6">Costs</th>
			        </tr>
			        <tr>
				        <td>Units</td>
				        <td></td>
				        <td>Buildings</td>
				        <td></td>
				        <td>Total</td>
				        <td></td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.wood}></td>
				        <td id="unitsWoodCost">0</td>
				        <td><img src=${imageSrc.wood}></td>
				        <td id="buildingsWoodCost">0</td>
				        <td><img src=${imageSrc.wood}></td>
				        <td id="sumUnitsAndBuildingsWoodCost">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.stone}></td>
				        <td id="unitsStoneCost">0</td>
				        <td><img src=${imageSrc.stone}></td>
				        <td id="buildingsStoneCost">0</td>
				        <td><img src=${imageSrc.stone}></td>
				        <td id="sumUnitsAndBuildingsStoneCost">0</td>
			        </tr>
			        <tr>
				        <td><img src=${imageSrc.iron}></td>
				        <td id="unitsIronCost">0</td>
				        <td><img src=${imageSrc.iron}></td>
				        <td id="buildingsIronCost">0</td>
				        <td><img src=${imageSrc.iron}></td>
				        <td id="sumUnitsAndBuildingsIronCost">0</td>
			        </tr>
		        </tbody>
            </table>
        </div>
    </div>
`;

let player = game_data.player.name;
let world = game_data.world;
let script = {
	name: 'Unit and building simulator',
	version: 'v1.5',
};
let issue = {
	text: [
		'|Player|World|Script name|Script version|',
		'|---|---|---|---|',
		`|${player}|${world}|${script.name}|${script.version}|`,
		'',
		'Issue:',
	].join('\n'),
};

function sendMessage() {
	createIssue('Error messages', 'oreg-kh', 'error/observation', issue.text, token);
}

sideBarHTML = `
    <div class="gear" onclick="openNav()"><img src=${gear}></div>
    <div id="mySidenav" class="sidenav">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <textarea id="issueText" placeholder="Error message..." rows="10" cols="50"></textarea>
        <button id="sendIssue" type="button" onclick="sendMessage()">KÃ¼ldÃ©s</button>
        </br>
        <textarea id="imageURL" placeholder="Keep the link" rows="1" cols="50"></textarea>
        <button id="addURL" type="button" onclick="addURL()">Addition</button>
    </div>
`;

function addURL() {
	var issueText = $('#issueText');
	var imageURL = $('#imageURL').val();
	issueText.val(issueText.val() + addBBcodeToURL(imageURL));
	clearURL();
}

function clearURL() {
	$('#imageURL').val('');
}

function addBBcodeToURL(url) {
	return `![issue-image](${url})`;
}

function createIssue(repoName, repoOwner, issueTitle, issueBody, accessToken) {
	var url = 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/issues';
	var text = $('#issueText').val();
	$.ajax({
		url: url,
		type: 'POST',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', 'token ' + accessToken);
		},
		data: JSON.stringify({
			title: issueTitle,
			body: issueBody + '\n' + text,
		}),
		success: function (msg) {
			UI.SuccessMessage('Your message has been successfully forwarded!', 5000);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			UI.ErrorMessage('Something went wrong, the data could not be sent!', 5000);
		},
	});
}

function createSideBar() {
	$('body').append(sideBarHTML);
}

function openNav() {
	document.getElementById('mySidenav').style.width = '390px';
}

function closeNav() {
	spinMainIcon(500, 180);
	document.getElementById('mySidenav').style.width = '0px';
}

function createHTML() {
	Dialog.show('calculator', content, function () {
		byebye();
	}),
		createSideBar();
	buildingsInformation();
	unitsInformation();
	configInformation();
	loadSelectMenu();
}
createHTML();

function createObject() {
	for (const key of buildings) {
		obj.buildingsObj[key] = new Object();
	}
	for (const key of units) {
		obj.unitsObj[key] = new Object();
	}
	return true;
}

function getStorage(name) {
	return localStorage[`${name} ${game_data.world}`];
}

function setTimeInStorage(name) {
	localStorage.setItem(`${name} ${game_data.world}`, Date.now());
}

function setServerDataInStorage(name, value) {
	localStorage.setItem(`${name} ${game_data.world}`, JSON.stringify(value));
}

function parseData(name) {
	return new DOMParser().parseFromString(getStorage(name), 'text/html');
}

// Ã©pÃ¼letinformÃ¡ciÃ³k lekÃ©rdezÃ©se, Ã³rÃ¡nkÃ©nt max 1x
function getBuildingsInformation() {
	return setServerDataInStorage(
		'buildingsConfig',
		$.ajax({
			url: `https://${document.domain}/interface.php?func=get_building_info`,
			type: 'GET',
			async: false,
			success: function (xml) {},
			error: function (xhr, statusText, error) {
				$('.popup_box_container').remove();
				console.log(errorText.buildings + error);
				UI.ErrorMessage(errorText.buildings + error, 8000);
			},
		})
	);
}

async function buildingsInformation() {
	await createObject();
	if (!getStorage('buildingsTimeUpdate') || Date.now() > getStorage('buildingsTimeUpdate') + 3600 * 1000) {
		await getBuildingsInformation();
		setTimeInStorage('buildingsTimeUpdate');
	}

	for (var i = 0; i < buildings.length; i++) {
		for (var k = 0; k < datas.length; k++) {
			data = parseData('buildingsConfig');
			if ($(data).find(`config > ${buildings[i]}`).length > 0) {
				config = Number($(data).find(`config > ${buildings[i]} > ${datas[k]}`)[0].innerHTML);
				Object.defineProperty(obj.buildingsObj[buildings[i]], datas[k], { value: config });
				Object.defineProperty(obj.buildingsObj[buildings[i]], 'exist', { value: true });
			} else {
				disableBuilding(buildings[i]);
				Object.defineProperty(obj.buildingsObj[buildings[i]], 'exist', { value: false });
				if (buildings[i] == 'statue') {
					disableUnit('knight');
				}
			}
		}
	}
}

// egysÃ©g informÃ¡ciÃ³k lekÃ©rdezÃ©se
function getUnitsInformation() {
	return setServerDataInStorage(
		'unitsConfig',
		$.ajax({
			url: `https://${document.domain}/interface.php?func=get_unit_info`,
			type: 'GET',
			async: false,
			success: function (xml) {},
			error: function (xhr, statusText, error) {
				$('.popup_box_container').remove();
				console.log(errorText.units + error);
				UI.ErrorMessage(errorText.units + error, 8000);
			},
		})
	);
}

async function unitsInformation() {
	await createObject();
	if (!getStorage('unitsTimeUpdate') || Date.now() > getStorage('unitsTimeUpdate') + 3600 * 1000) {
		var xml = await getUnitsInformation();
		setTimeInStorage('unitsTimeUpdate');
	}

	for (var i = 0; i < units.length; i++) {
		for (var k = 0; k < dat.length; k++) {
			data = parseData('unitsConfig');
			if ($(data).find(`config > ${units[i]}`).length > 0) {
				config = Number($(data).find(`config > ${units[i]} > ${dat[k]}`)[0].innerHTML);
				Object.defineProperty(obj.unitsObj[units[i]], dat[k], { value: config });
				Object.defineProperty(obj.unitsObj[units[i]], 'exist', { value: true });
			} else {
				if (units[i].includes('archer')) {
					disableUnit(units[i]);
					Object.defineProperty(obj.unitsObj[units[i]], 'exist', { value: false });
				}
			}
		}
	}
	unitsResources();
	return true;
}

// szerver sebessÃ©g lekÃ©rdezÃ©se, Ã³rÃ¡nkÃ©nt max 1x
function getConfigInformation() {
	return setServerDataInStorage(
		'configConfig',
		$.ajax({
			url: `https://${document.domain}/interface.php?func=get_config`,
			type: 'GET',
			async: false,
			success: function (xml) {},
			error: function (xhr, statusText, error) {
				$('.popup_box_container').remove();
				console.log(errorText.speed + error);
				UI.ErrorMessage(errorText.speed + error, 8000);
			},
		})
	);
}

async function configInformation() {
	await createObject();
	if (!getStorage('configTimeUpdate') || Date.now() > getStorage('configTimeUpdate') + 3600 * 1000) {
		var xml = await getConfigInformation();
		setTimeInStorage('configTimeUpdate');
	}
	data = parseData('configConfig');
	config = Number($(data).find('config > speed').text());
	Object.defineProperty(obj.world, 'worldSpeed', { value: config });
}

// egysÃ©g kÃ¶ltsÃ©g lekÃ©rdezÃ©se
function getUnitsResources() {
	return new Promise(function (resolve, reject) {
		TribalWars.get('api', { ajax: 'data', screen: 'unit_info' }, resolve, reject);
	}).then(
		function (result) {
			setTimeInStorage('resourceTimeUpdate');
			setServerDataInStorage('resourceConfig', result);
		},
		function (error) {
			$('.popup_box_container').remove();
			console.log(errorText.unitsCost);
			UI.ErrorMessage(errorText.unitsCost, 8000);
		}
	);
}

async function unitsResources() {
	if (!getStorage('resourceTimeUpdate') || Date.now() > getStorage('resourceTimeUpdate') + 3600 * 1000) {
		var responseText = await getUnitsResources();
	}
	data = JSON.parse(getStorage('resourceConfig'));
	for (var i = 0; i < units.length; i++) {
		if (obj.unitsObj[units[i]].exist === true) {
			Object.defineProperty(obj.unitsObj[units[i]], 'wood', { value: data.unit_data[units[i]].wood });
			Object.defineProperty(obj.unitsObj[units[i]], 'stone', { value: data.unit_data[units[i]].stone });
			Object.defineProperty(obj.unitsObj[units[i]], 'iron', { value: data.unit_data[units[i]].iron });
		}
	}
}

// style hozzÃ¡adÃ¡sa a HTML-hez
function initCss(css) {
	$(`<style>${css}</style>`).appendTo('body');
}

initCss(`
    #popup_box_calculator {
        width: 1500px !important;
    }
    div#myTable {
        overflow-x: auto;
        max-width: 100%;
        display: flex;
        white-space: nowrap;
    }
    table.inlineTable {
        width: auto;
        vertical-align: top;
        border-collapse: collapse;
        border-spacing: 0px;
        margin: 0 10px;
    }
    table.inlineTable th {
        border: 1px solid black;
        padding: 3px;
        text-align: center;
    }
    table.inlineTable td {
        border: 1px solid black;
        padding: 3px;
        text-align: left;
    }
    table.modes img {
        vertical-align: bottom;
        height: 18px;
        width: 22px;
    }
    table.modesb img {
        vertical-align: bottom;
        height: 18px;
        width: 18px;
    }
    table.modesc img {
        vertical-align: bottom;
    }
    table.modes tr:nth-child(8) img {
        width: 18px !important;
    }
    table.modes tr:nth-child(12) img {
        width: 18px !important;
    }
    table.modes tr:nth-child(21) img {
        vertical-align: bottom;
        height: 16px !important;
        width: 18px !important;
    }
    table.bonus tr:first-child img {
        vertical-align: bottom;
        height: 13px;
        width: 13px;
    }
    table.bonus tr:nth-child(2) img {
        vertical-align: bottom;
        margin-right: 1px;
        height: 18px;
        width: 22px;
    }
    table.bonus tr:nth-child(2) input {
        width: 35px;
    }
    table.inlineTable tr:nth-child(even) {
        background-color: #fff5da;
    }
    input.building {
        width: 30px;
    }
    input.unit {
        width: 70px;
    }
    table.inlineTable tr:nth-child(odd) {
        background-color: #f0e2be;
    }
    table tr.separator {
        height: 20px;
    }
    .space {
        background: none !important;
        border: none !important;
        width: 5px;
    }
    .border td {
         border: none !important;
    }
    .crosshatchedright {
        background: repeating-linear-gradient(-45deg,rgba(0, 0, 0, 0.2),
                    rgba(0, 0, 0, 0.2) 5px,
                    rgba(0, 0, 0, 0.3) 5px,
                    rgba(0, 0, 0, 0.3) 8px),
                    url(http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/old_map_@2X.png);
    }
    .crosshatchedleft {
        background: repeating-linear-gradient(45deg,rgba(0, 0, 0, 0.2),
                    rgba(0, 0, 0, 0.2) 5px,
                    rgba(0, 0, 0, 0.3) 5px,
                    rgba(0, 0, 0, 0.3) 8px),
                    url(http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/old_map_@2X.png);
    }
    .sumbuildtime, .haul, .pop, .build_time, .woodCost, .stoneCost, .ironCost, .popCost, .points {
        text-align: center !important;
    }
    .property {
        text-align: right !important;
    }
    .sidenav {
        height: 100%;
        width: 0px;
        position: fixed;
        z-index: 19;
        top: 35px;
        left: 0px;
        background-color: #111;
        overflow-x: hidden;
        transition: 0.5s;
        padding-top: 60px;
    }

    .sidenav a {
        padding: 8px 8px 8px 32px;
        text-decoration: none;
        font-size: 25px;
        color: #818181;
        display: block;
        transition: 0.3s;
    }
    .sidenav a:hover {
        color: #f1f1f1;
    }
    .sidenav .closebtn {
        position: absolute;
        top: 0;
        right: 0px;
        font-size: 36px;
        margin-left: 50px;
    }
    @media screen and (max-height: 450px) {
        .sidenav {padding-top: 15px;}
        .sidenav a {font-size: 18px;}
    }
    .gear img {
        z-index: 12000;
        position: absolute;
        top: 3px;
        cursor: pointer;
	    width: 45px;
	    height: 45px;
    }
    textarea {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    button#sendIssue, button#addURL {
        display: block;
        margin-left: auto;
        margin-right: 6.5px; 
        cursor: pointer;
    }
`);

// Ãºj opciÃ³ hozzÃ¡adÃ¡sa a legÃ¶rdÃ¼lÅ‘ listÃ¡hoz
function createOption(option_name) {
	$('#sablon').append(`<option>${option_name}</option>`);
}

// eltÃ¡rolja az inputokat egy tÃ¶mbben
function getAllInputValue() {
	var array = [];
	for (var i = 0; i < 48; i++) {
		array.push($('#myTable').find('input').eq(i).val());
	}
	var name = prompt('KÃ©rlek add meg milyen nÃ©ven szeretnÃ©d menteni a beÃ¡llÃ­tÃ¡saidat!');
	return { array, name };
}

// eltÃ¡rolja az inputokat localStorage-ban, hozzÃ¡ad egy Ãºj opciÃ³t a profilokhoz
function store() {
	var pre = getAllInputValue();
	name = 'Ã¶regsaver_' + pre.name;
	var object = {
		inputs: pre.array,
	};
	localStorage.setItem(name, btoa(JSON.stringify(object)));
	createOption(pre.name);
}

// profilok betÃ¶ltÃ©se a legÃ¶rdÃ¼lÅ‘ listÃ¡ba
function loadSelectMenu() {
	for (var key in localStorage) {
		if (key.includes('Ã¶regsaver')) {
			createOption(key.split('_')[1]);
		}
	}
}

// a kivÃ¡lasztott elem eltÃ¡volÃ­tÃ¡sa a legÃ¶rdÃ¼lÅ‘ listÃ¡bÃ³l
function removeOptions() {
	var item = $('#sablon').find(':selected');
	var optionName = item.text();
	item.remove();
	for (var key in localStorage) {
		if (key == `Ã¶regsaver_${optionName}`) {
			localStorage.removeItem(key);
		}
	}
}

// a kivÃ¡lasztott profil exportÃ¡lÃ¡sa
function exports() {
	var item = $('#sablon').find(':selected');
	var optionName = item.text();
	if (optionName != 'opciÃ³k') {
		var val = localStorage.getItem(`Ã¶regsaver_${optionName}`);
		var key = optionName;
		prompt(prompts.text, key + ',' + val);
	}
}

// profil importÃ¡lÃ¡sa
function imports() {
	var importCode = prompt('Illeszd be az exportÃ¡lÃ¡skor kapott kÃ³dot:');
	var key = importCode.split(',')[0];
	var val = importCode.split(',')[1];
	localStorage.setItem(`Ã¶regsaver_${key}`, val);
	createOption(key);
}

// esemÃ©nykezelÅ‘ a profil kivÃ¡lasztÃ¡sakor
$('#sablon').on('click', function (event) {
	var item = $('#sablon').find(':selected');
	var optionName = item.text();
	if (optionName != 'opciÃ³k') {
		var val = localStorage.getItem(`Ã¶regsaver_${optionName}`);
		var inputs = JSON.parse(atob(val)).inputs;
		for (var i = 0; i < 48; i++) {
			$('#myTable').find('input').eq(i).val(inputs[i]);
		}
	}
	buildingsFunctions();
	unitsFunctions();
	buildingsAndUnitsFunctions();
});

// Ã¼zenet lÃ©trehozÃ¡sa
function createMessage(type, message, time) {
	UI[type](message, time);
}

// visszaadja, hogy teljesÃ¼lt-e az Ã©pÃ­tÃ©shez szÃ¼ksÃ©ges elÅ‘feltÃ©tel
function buildingsLevel(building, level) {
	return Number($('#' + building).val()) >= level;
}

// engedÃ©lyezi az egysÃ©get, ha a kÃ©pzÃ©shez szÃ¼ksÃ©ges elÅ‘feltÃ©telek teljesÃ¼ltek, amelyik egysÃ©g nem lÃ©tezik a szerveren, azt nem oldja fel
function enableUnit(unit) {
	if (obj.unitsObj[unit].exist === false) {
		return (document.getElementById(unit).disabled = true);
	} else {
		return (document.getElementById(unit).disabled = false);
	}
}

// engedÃ©lyezi az Ã©pÃ¼letet, ha az Ã©pÃ­tÃ©shez szÃ¼ksÃ©ges elÅ‘feltÃ©telek teljesÃ¼ltek, amelyik Ã©pÃ¼let nem lÃ©tezik a szerveren, azt nem oldja fel
function enableBuilding(building) {
	if (obj.buildingsObj[building].exist === false) {
		return (document.getElementById(building).disabled = true);
	} else {
		if (building == 'snob') {
			building = 'academy';
		}
		return (document.getElementById(building).disabled = false);
	}
}

// egysÃ©g letiltÃ¡sa
function disableUnit(unit) {
	return (document.getElementById(unit).disabled = true);
}

// Ã©pÃ¼let letiltÃ¡sa
function disableBuilding(building) {
	if (building == 'snob') {
		building = 'academy';
	}
	return (document.getElementById(building).disabled = true);
}

// letilt minden egysÃ©get, kivÃ©ve a lÃ¡ndzsÃ¡st Ã©s a kardost, mert azoknak nincs elÅ‘feltÃ©tele Ã©s minden szerveren lÃ©teznek
function resetUnit() {
	for (var i = 2; i < units.length - 1; i++) {
		disableUnit(units[i]);
	}
}
resetUnit();

// letilt minden Ã©pÃ¼letet, aminek van elÅ‘feltÃ©tele
function resetBuilding() {
	var building = ['barracks', 'stable', 'garage', 'church', 'watchtower', 'academy', 'smith', 'market', 'wall'];
	for (var i = 0; i < building.length; i++) {
		disableBuilding(building[i]);
	}
}
resetBuilding();

// az Ã©pÃ¼let szintek fa kÃ¶ltsÃ©gÃ©t szÃ¡molja
function woodCost() {
	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		wood = obj.buildingsObj[buildings[i]].wood;
		wood_factor = obj.buildingsObj[buildings[i]].wood_factor;
		if (building_level == 0 || building_level == '') {
			$('.woodCost').eq(i).text(0);
		} else {
			text = Math.round(Math.pow(wood_factor, building_level - 1) * wood);
			$('.woodCost').eq(i).text(numberWithCommas(text));
		}
	}
}

// az Ã©pÃ¼let szintek agyag kÃ¶ltsÃ©gÃ©t szÃ¡molja
function stoneCost() {
	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		stone = obj.buildingsObj[buildings[i]].stone;
		stone_factor = obj.buildingsObj[buildings[i]].stone_factor;
		if (building_level == 0 || building_level == '') {
			$('.stoneCost').eq(i).text(0);
		} else {
			text = Math.round(Math.pow(stone_factor, building_level - 1) * stone);
			$('.stoneCost').eq(i).text(numberWithCommas(text));
		}
	}
}

// az Ã©pÃ¼let szintek vas kÃ¶ltsÃ©gÃ©t szÃ¡molja
function ironCost() {
	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		iron = obj.buildingsObj[buildings[i]].iron;
		iron_factor = obj.buildingsObj[buildings[i]].iron_factor;
		if (building_level == 0 || building_level == '') {
			$('.ironCost').eq(i).text(0);
		} else {
			text = Math.round(Math.pow(iron_factor, building_level - 1) * iron);
			$('.ironCost').eq(i).text(numberWithCommas(text));
		}
	}
}

// az Ã©pÃ¼let szintek nÃ©pessÃ©g kÃ¶ltsÃ©gÃ©t szÃ¡molja
function popCost() {
	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		pop = obj.buildingsObj[buildings[i]].pop;
		pop_factor = obj.buildingsObj[buildings[i]].pop_factor;
		if (building_level == 0 || building_level == '') {
			$('.popCost').eq(i).text(0);
		} else {
			text = Math.round(Math.pow(pop_factor, building_level - 1) * pop);
			$('.popCost').eq(i).text(numberWithCommas(text));
		}
	}
	return true;
}

// az Ã©pÃ¼let szintek pontjÃ¡t szÃ¡molja
function points() {
	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		build_time_factor = obj.buildingsObj[buildings[i]].build_time_factor;
		if (building_level == 0 || building_level == '') {
			$('.points').eq(i).text(0);
		} else {
			text = Math.round(Math.pow(build_time_factor, building_level - 1) * firstLevelPoint[i]);
			$('.points').eq(i).text(numberWithCommas(text));
		}
	}
	return true;
}

// a falu pontszÃ¡mÃ¡t szÃ¡molja
async function sumPoints() {
	var result = await points();
	var sum = 0;
	for (var i = 0; i < buildings.length; i++) {
		point = Number($('.points').eq(i).text().replace('.', ''));
		sum += point;
	}
	$('#sumPoints').text(numberWithCommas(sum));
}

// a rejtekhely Ã¡ltal elrejtett nyersanyagokat szÃ¡molja
function hiddenResources() {
	hide_level = Number($('#hide').val());
	if (hide_level == 0 || hide_level == '') {
		$('#hiddenResources').text(0);
	} else {
		text = Math.pow(4 / 3, hide_level - 1) * 150;
		if (hide_level > 7) {
			$('#hiddenResources').text(numberWithCommas(roundToNearestFive(text)));
		} else {
			$('#hiddenResources').text(roundToNearestInteger(text));
		}
	}
}

// a kereskedÅ‘k szÃ¡mÃ¡t szÃ¡molja
function numberOfMerchants() {
	market_level = Number($('#market').val());
	if (market_level >= 10) {
		text = Math.pow(market_level - 10, 2) + 10;
	} else if (market_level == '') {
		text = 0;
	} else {
		text = market_level;
	}
	$('#merchants').text(text);
	return text;
}

// a raktÃ¡r mÃ©retÃ©t szÃ¡molja
function capacity() {
	warehouse_level = Number($('#warehouse').val());
	if (warehouse_level == 0 || warehouse_level == '') {
		$('#capacity').text(0);
	} else {
		text = Math.pow(1.2294934, warehouse_level - 1) * 1000;
		$('#capacity').text(numberWithCommas(roundToNearestInteger(text)));
	}
	return text;
}

// a fal bÃ³nuszt szÃ¡molja
function wallBonus() {
	wall_level = Number($('#wall').val());
	text = (Math.pow(1.037, wall_level) - 1) * 100;
	$('#wallBonus').text(roundToNearestInteger(text) + '%');
}

// a fa termelÃ©st szÃ¡molja
function woodProd() {
	wood_level = Number($('#timber_camp').val());
	if (wood_level == 0 || wood_level == '') {
		wood = 0;
	} else {
		wood = Math.pow(1.163118, wood_level - 1) * 30;
	}
	$('#woodProd').text(numberWithCommas(roundToNearestInteger(wood)));
	return { wood };
}

// a agyag termelÃ©st szÃ¡molja
function stoneProd() {
	stone_level = Number($('#clay_pit').val());
	if (stone_level == 0 || stone_level == '') {
		stone = 0;
	} else {
		stone = Math.pow(1.163118, stone_level - 1) * 30;
	}
	$('#stoneProd').text(numberWithCommas(roundToNearestInteger(stone)));
	return { stone };
}

// a vas termelÃ©st szÃ¡molja
function ironProd() {
	iron_level = Number($('#iron_mine').val());
	if (iron_level == 0 || iron_level == '') {
		iron = 0;
	} else {
		iron = Math.pow(1.163118, iron_level - 1) * 30;
	}
	$('#ironProd').text(numberWithCommas(roundToNearestInteger(iron)));
	return { iron };
}

// a tanyahelyet szÃ¡molja
function population() {
	pop_level = Number($('#farm').val());
	if (pop_level == 0 || pop_level == '') {
		text = 0;
	} else {
		text = Math.pow(1.172103, pop_level - 1) * 240;
	}
	$('#population').text(numberWithCommas(roundToNearestInteger(text)));
	return text;
}

// az egysÃ©gek kÃ©pzÃ©si idejÃ©t szÃ¡molja
function buildTimeOfUnit() {
	barracks_level = Number($('#barracks').val());
	stable_level = Number($('#stable').val());
	garage_level = Number($('#garage').val());
	statue_level = Number($('#statue').val());
	academy_level = Number($('#academy').val());

	for (var i = 0; i < units.length; i++) {
		build_time = obj.unitsObj[units[i]].build_time;
		piece = Number($('.unit').eq(i).val());
		if (i < 4) {
			if (!build_time || barracks_level == 0 || barracks_level == '') {
				$('.build_time').eq(i).text('00:00:00:00');
			} else {
				barracksTime = ((2 / 3) * build_time * Math.pow(1.06, -barracks_level) * piece) / recruitBonus().barracksBonus;
				text = secondsToDhms(roundUpToNearestInteger(barracksTime));
				$('.build_time').eq(i).text(text);
			}
		}
		if (3 < i && i < 8) {
			if (!build_time || stable_level == 0 || stable_level == '') {
				$('.build_time').eq(i).text('00:00:00:00');
			} else {
				stableTime = ((2 / 3) * build_time * Math.pow(1.06, -stable_level) * piece) / recruitBonus().stableBonus;
				text = secondsToDhms(roundUpToNearestInteger(stableTime));
				$('.build_time').eq(i).text(text);
			}
		}
		if (7 < i && i < 10) {
			if (!build_time || garage_level == 0 || garage_level == '') {
				$('.build_time').eq(i).text('00:00:00:00');
			} else {
				garageTime = ((2 / 3) * build_time * Math.pow(1.06, -garage_level) * piece) / recruitBonus().garageBonus;
				text = secondsToDhms(roundUpToNearestInteger(garageTime));
				$('.build_time').eq(i).text(text);
			}
		}
		if (i == 10) {
			if (!build_time || statue_level == 0 || statue_level == '') {
				$('.build_time').eq(i).text('00:00:00:00');
			} else {
				text = secondsToDhms(build_time * piece);
				$('.build_time').eq(i).text(text);
			}
		}
		if (i == 11) {
			if (!build_time || academy_level == 0 || academy_level == '') {
				$('.build_time').eq(i).text('00:00:00:00');
			} else {
				academyTime = ((2 / 3) * build_time * Math.pow(1.06, -academy_level) * piece) / recruitBonus().academyBonus;
				text = secondsToDhms(roundUpToNearestInteger(academyTime));
				$('.build_time').eq(i).text(text);
			}
		}
		if (i == 12) {
			$('.build_time').eq(i).text('00:00:00:00');
		}
	}
	return true;
}

// az egysÃ©gek teherbÃ­rÃ¡sÃ¡t szÃ¡molja
function unitsHaul() {
	barracks_level = Number($('#barracks').val());
	stable_level = Number($('#stable').val());
	garage_level = Number($('#garage').val());
	statue_level = Number($('#statue').val());
	academy_level = Number($('#academy').val());

	for (var i = 0; i < units.length; i++) {
		carry = Number(obj.unitsObj[units[i]].carry);
		if (i < 4) {
			if (!carry || barracks_level == 0 || barracks_level == '') {
				$('.haul').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = carry * piece;
				$('.haul').eq(i).text(numberWithCommas(text));
			}
		}
		if (3 < i && i < 8) {
			if (!carry || stable_level == 0 || stable_level == '') {
				$('.haul').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = carry * piece;
				$('.haul').eq(i).text(numberWithCommas(text));
			}
		}
		if (7 < i && i < 10) {
			if (!carry || garage_level == 0 || garage_level == '') {
				$('.haul').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = carry * piece;
				$('.haul').eq(i).text(numberWithCommas(text));
			}
		}
		if (i == 10) {
			if (!carry || statue_level == 0 || statue_level == '') {
				$('.haul').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = carry * piece;
				$('.haul').eq(i).text(numberWithCommas(text));
			}
		}
		if (i == 11) {
			if (!carry || academy_level == 0 || academy_level == '') {
				$('.haul').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = carry * piece;
				$('.haul').eq(i).text(numberWithCommas(text));
			}
		}
		if (i == 12) {
			$('.haul').eq(i).text(0);
		}
	}
}

// az egysÃ©gek Ã¡ltal lefoglalt tanyahelyet szÃ¡molja
function unitsPop() {
	barracks_level = Number($('#barracks').val());
	stable_level = Number($('#stable').val());
	garage_level = Number($('#garage').val());
	statue_level = Number($('#statue').val());
	academy_level = Number($('#academy').val());

	for (var i = 0; i < units.length; i++) {
		pop = Number(obj.unitsObj[units[i]].pop);
		if (i < 4) {
			if (!pop || barracks_level == 0 || barracks_level == '') {
				$('.pop').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = pop * piece;
				$('.pop').eq(i).text(numberWithCommas(text));
			}
		}
		if (3 < i && i < 8) {
			if (!pop || stable_level == 0 || stable_level == '') {
				$('.pop').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = pop * piece;
				$('.pop').eq(i).text(numberWithCommas(text));
			}
		}
		if (7 < i && i < 10) {
			if (!pop || garage_level == 0 || garage_level == '') {
				$('.pop').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = pop * piece;
				$('.pop').eq(i).text(numberWithCommas(text));
			}
		}
		if (i == 10) {
			if (!pop || statue_level == 0 || statue_level == '') {
				$('.pop').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = pop * piece;
				$('.pop').eq(i).text(numberWithCommas(text));
			}
		}
		if (i == 11) {
			if (!pop || academy_level == 0 || academy_level == '') {
				$('.pop').eq(i).text(0);
			} else {
				piece = Number($('.unit').eq(i).val());
				text = pop * piece;
				$('.pop').eq(i).text(numberWithCommas(text));
			}
		}
		if (i == 12) {
			$('.pop').eq(i).text(0);
		}
	}
	return true;
}

// Ã©pÃ¼letenkÃ©nt Ã¶sszegzi az egysÃ©gek kÃ©pzÃ©si idejÃ©t
async function sumBuildTimeOfUnit() {
	var result = await buildTimeOfUnit();
	var seconds = 0;
	var $seconds = 0;
	var $$seconds = 0;
	for (var i = 0; i < units.length; i++) {
		if (i < 4) {
			time = $('.build_time').eq(i).text().split(':');
			seconds += Number(time[0]) * 86400 + Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]);
			text = secondsToDhms(seconds);
			$('.sumbuildtime').eq(0).text(text);
		}
		if (3 < i && i < 8) {
			time = $('.build_time').eq(i).text().split(':');
			$seconds += Number(time[0]) * 86400 + Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]);
			text = secondsToDhms($seconds);
			$('.sumbuildtime').eq(1).text(text);
		}
		if (7 < i && i < 10) {
			time = $('.build_time').eq(i).text().split(':');
			$$seconds += Number(time[0]) * 86400 + Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]);
			text = secondsToDhms($$seconds);
			$('.sumbuildtime').eq(2).text(text);
		}
	}
}

// a foglalt tanyahelyet szÃ¡molja
async function lockedPop() {
	var lockedsum = 0;
	buildingpop = $('.popCost');
	unitpop = $('.pop');

	var res = await popCost();
	for (var i = 0; i < buildingpop.length; i++) {
		lockedsum += Number(buildingpop.eq(i).text().replace('.', ''));
	}

	var result = await unitsPop();
	for (var i = 0; i < unitpop.length; i++) {
		lockedsum += Number(unitpop.eq(i).text().replace('.', ''));
	}
	$('#locked').text(numberWithCommas(lockedsum));
	return lockedsum;
}

// a szabad tanyahelyet szÃ¡molja
async function freePop() {
	var res = await popBonus();
	var result = await lockedPop();
	redClass();
	pop = roundDownToNearestInteger(res);

	locked = result;

	free = pop - locked;
	$('#free').text(numberWithCommas(free));
}

// ha a foglalt tanyahely nagyobb, mint a nÃ©pessÃ©g, akkor a foglalt Ã©s a szabad tanyahely szÃ¡ma pirosra vÃ¡lt
function redClass() {
	var pop = Number($('#population').text().replace('.', ''));
	var locked = Number($('#locked').text().replace('.', ''));
	if (locked > pop) {
		$('#locked').addClass('red');
		$('#free').addClass('red');
	} else {
		$('#locked').removeClass('red');
		$('#free').removeClass('red');
	}
}

// kereskedÅ‘ bÃ³nuszt szÃ¡molja
async function marketBonus() {
	var merchants = await numberOfMerchants();
	var merchantsBonusVillage = Number($('#merchantsBonusVillage').val());
	var merchantsInventory = Number($('#merchantsInventory').val());
	var bonusMerchants = (merchants * (merchantsBonusVillage + merchantsInventory)) / 100 + merchants;
	$('#merchants').text(roundToNearestInteger(bonusMerchants));
}

// raktÃ¡rkapacitÃ¡s bÃ³nuszt szÃ¡molja
async function storageBonus() {
	var storage = await capacity();
	var storageBonusVillage = Number($('#storageBonusVillage').val());
	var storageInventory = Number($('#storageInventory').val());
	var bonusStorage = (storage * (storageBonusVillage + storageInventory)) / 100 + storage;
	$('#capacity').text(numberWithCommas(roundToNearestInteger(bonusStorage)));
}

// fosztogatÃ¡s bÃ³nuszt szÃ¡molja
async function haulBonus() {
	var result = await unitsHaul();
	var haul = $('.haul');
	var haulFlag = Number($('#haulFlag').val());
	var haulInventory = Number($('#haulInventory').val());
	for (var i = 0; i < haul.length; i++) {
		oldHaul = Number(haul.eq(i).text().replace('.', ''));
		newHaul = oldHaul * (1 + haulFlag / 100) * (1 + haulInventory / 100);
		haul.eq(i).text(numberWithCommas(roundToNearestInteger(newHaul)));
	}
}

// nÃ©pessÃ©g bÃ³nuszt szÃ¡molja
async function popBonus() {
	var result = await population();
	var popBonusVillage = Number($('#popBonusVillage').val());
	var popFlag = Number($('#popFlag').val());
	var popInventory = Number($('#popInventory').val());
	var oldPop = result;
	var newPop = oldPop * (1 + popBonusVillage / 100) * (1 + popFlag / 100) * (1 + popInventory / 100);
	$('#population').text(numberWithCommas(roundDownToNearestInteger(newPop)));
	return newPop;
}

// kÃ©pzÃ©si bÃ³nuszt szÃ¡molja
function recruitBonus() {
	var barracksBonus = 1 + Number($('#barracksBonus').val()) / 100;
	var stableBonus = 1 + Number($('#stableBonus').val()) / 100;
	var garageBonus = 1 + Number($('#garageBonus').val()) / 100;
	var academyBonus = 1 + Number($('#academyBonus').val()) / 100;
	return { barracksBonus, stableBonus, garageBonus, academyBonus };
}

// termelÃ©s bÃ³nuszt szÃ¡molja
async function resourceBonus() {
	var woodBaseProd = await woodProd();
	var stoneBaseProd = await stoneProd();
	var ironBaseProd = await ironProd();

	worldSpeed = obj.world.worldSpeed;
	var wood = woodBaseProd.wood * worldSpeed;
	var stone = stoneBaseProd.stone * worldSpeed;
	var iron = ironBaseProd.iron * worldSpeed;

	var woodBonus = Number($('#woodBonus').val());
	var stoneBonus = Number($('#stoneBonus').val());
	var ironBonus = Number($('#ironBonus').val());

	var bonusWoodProduction = wood * (1 + woodBonus / 100);
	var bonusStoneProduction = stone * (1 + stoneBonus / 100);
	var bonusIronProduction = iron * (1 + ironBonus / 100);

	$('#woodProd').text(numberWithCommas(roundToNearestInteger(bonusWoodProduction)));
	$('#stoneProd').text(numberWithCommas(roundToNearestInteger(bonusStoneProduction)));
	$('#ironProd').text(numberWithCommas(roundToNearestInteger(bonusIronProduction)));
}

// az egysÃ©gek kÃ¶ltsÃ©gÃ©t szÃ¡molja
function unitsCost() {
	var wood = 0;
	var stone = 0;
	var iron = 0;
	for (var i = 0; i < units.length; i++) {
		if (obj.unitsObj[units[i]].exist === true) {
			piece = Number($('.unit').eq(i).val());
			wood += Number(obj.unitsObj[units[i]].wood) * piece;
			stone += Number(obj.unitsObj[units[i]].stone) * piece;
			iron += Number(obj.unitsObj[units[i]].iron) * piece;
		}
	}
	$('#unitsWoodCost').text(numberWithCommas(wood));
	$('#unitsStoneCost').text(numberWithCommas(stone));
	$('#unitsIronCost').text(numberWithCommas(iron));
	return { wood, stone, iron };
}

// az Ã©pÃ¼letek kÃ¶ltsÃ©gÃ©t szÃ¡molja
function buildingsCost() {
	var wood = 0;
	var stone = 0;
	var iron = 0;
	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		for (var k = 1; k < building_level + 1; k++) {
			$wood = obj.buildingsObj[buildings[i]].wood;
			wood_factor = obj.buildingsObj[buildings[i]].wood_factor;
			if (building_level == 0 || building_level == '') {
				wood += 0;
			} else {
				wood += Math.pow(wood_factor, k - 1) * $wood;
			}
		}
	}
	$('#buildingsWoodCost').text(numberWithCommas(Math.round(wood)));

	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		for (var k = 1; k < building_level + 1; k++) {
			$stone = obj.buildingsObj[buildings[i]].stone;
			stone_factor = obj.buildingsObj[buildings[i]].stone_factor;
			if (building_level == 0 || building_level == '') {
				stone += 0;
			} else {
				stone += Math.pow(stone_factor, k - 1) * $stone;
			}
		}
	}
	$('#buildingsStoneCost').text(numberWithCommas(Math.round(stone)));

	for (var i = 0; i < buildings.length; i++) {
		building_level = Number($('.building').eq(i).val());
		for (var k = 1; k < building_level + 1; k++) {
			$iron = obj.buildingsObj[buildings[i]].iron;
			iron_factor = obj.buildingsObj[buildings[i]].iron_factor;
			if (building_level == 0 || building_level == '') {
				iron += 0;
			} else {
				iron += Math.pow(iron_factor, k - 1) * $iron;
			}
		}
	}
	$('#buildingsIronCost').text(numberWithCommas(Math.round(iron)));
	return { wood, stone, iron };
}

// az Ã©pÃ¼letek Ã©s az egysÃ©gek kÃ¶ltsÃ©gÃ©t Ã¶sszegzi
async function sumUnitsAndBuildingsCost() {
	var buildings = await buildingsCost();
	currentBuildingsCost();
	var units = await unitsCost();
	var wood = units.wood + buildings.wood;
	var stone = units.stone + buildings.stone;
	var iron = units.iron + buildings.iron;

	$('#sumUnitsAndBuildingsWoodCost').text(numberWithCommas(Math.round(wood)));
	$('#sumUnitsAndBuildingsStoneCost').text(numberWithCommas(Math.round(stone)));
	$('#sumUnitsAndBuildingsIronCost').text(numberWithCommas(Math.round(iron)));
}

// aktuÃ¡lis Ã©pÃ¼let szintek kÃ¶ltsÃ©gei
function currentBuildingsCost() {
	var woodCost = $('.woodCost');
	var stoneCost = $('.stoneCost');
	var ironCost = $('.ironCost');
	var wood = 0;
	var stone = 0;
	var iron = 0;
	for (var i = 0; i < woodCost.length; i++) {
		wood += Number(woodCost.eq(i).text().replace('.', ''));
		stone += Number(stoneCost.eq(i).text().replace('.', ''));
		iron += Number(ironCost.eq(i).text().replace('.', ''));
	}
	$('#currentBuildingsWoodCost').text(numberWithCommas(wood));
	$('#currentBuildingsStoneCost').text(numberWithCommas(stone));
	$('#currentBuildingsIronCost').text(numberWithCommas(iron));
}

// ss Ã¡tvÃ¡ltÃ¡sa nn:Ã³Ã³:pp:ss
function secondsToDhms(seconds) {
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor((seconds % (3600 * 24)) / 3600);
	var m = Math.floor((seconds % 3600) / 60);
	var s = Math.floor(seconds % 60);

	var dDisplay = d < 10 ? '0' + d + ':' : d + ':';
	var hDisplay = h < 10 ? '0' + h + ':' : h + ':';
	var mDisplay = m < 10 ? '0' + m + ':' : m + ':';
	var sDisplay = s < 10 ? '0' + s : s;
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

function roundToNearestFive(number) {
	return Math.ceil(number / 5) * 5;
}

function roundToNearestInteger(number) {
	return Math.round(number);
}

function roundDownToNearestInteger(number) {
	return Math.floor(number);
}

function roundUpToNearestInteger(number) {
	return Math.ceil(number);
}

// szÃ¡mok tagolÃ¡sa "."-tal
function numberWithCommas(x) {
	var parts = x.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return parts.join('.');
}

function byebye() {
	createMessage('SuccessMessage', 'ViszlÃ¡t legkÃ¶zelebb!', 2000);
}

function buildingsFunctions() {
	select(); // OK
	woodCost(); // OK
	stoneCost(); // OK
	ironCost(); // OK
	popCost(); // OK
	sumPoints(); // OK
	hiddenResources(); // OK
	wallBonus(); // OK
	marketBonus(); // OK
	storageBonus(); // OK
	resourceBonus(); // OK
}

function unitsFunctions() {
	unitsPop(); // OK
	sumBuildTimeOfUnit(); // OK
	haulBonus(); // OK
}

function buildingsAndUnitsFunctions() {
	freePop(); // OK
	sumUnitsAndBuildingsCost(); // OK
}

function spinMainIcon(durationMs, deg) {
	$({ deg: 0 }).animate(
		{ deg: deg },
		{
			duration: durationMs,
			step: (angle) => {
				$('.gear img').css({
					transform: 'rotate(' + angle + 'deg)',
				});
			},
		}
	);
}

$('.gear')
	.find('img')
	.on('click', function (event) {
		spinMainIcon(500, -180);
	});

// Ã©pÃ¼let szint esemÃ©nykezelÅ‘
$('.building, .unit, .bon').on('keyup input', function (event) {
	var classname = event.target.className;
	var value = event.target.valueAsNumber;
	var min = Number(event.target.min);
	var max = Number(event.target.max);
	var val = event.target.value;
	var id = event.target.id;
	var keyCode = event.keyCode;

	if (
		regExp.test(val) ||
		value > max ||
		value < min ||
		((keyCode < 7 || keyCode > 9) && (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105))
	) {
		event.target.value = '';
		if (classname == 'building') {
			createMessage('ErrorMessage', `Az Ã©pÃ¼letnek nincs ilyen szintje! Minimum: ${min}, Maximum: ${max}`, 1500);
		}
		if (classname == 'unit') {
			createMessage('ErrorMessage', `HibÃ¡s darabszÃ¡mot adtÃ¡l meg! Minimum: ${min}, Maximum: ${max}`, 1500);
		}
		if (classname == 'bon') {
			createMessage('ErrorMessage', `HibÃ¡s Ã©rtÃ©ket adtÃ¡l meg! Minimum: ${min}, Maximum: ${max}`, 1500);
		}
	} else {
		if (classname == 'building') {
			buildingsFunctions();
			unitsFunctions();
			buildingsAndUnitsFunctions();
		}
		if (classname == 'unit') {
			unitsFunctions();
			buildingsAndUnitsFunctions();
		}
		if (classname == 'bon') {
			buildingsFunctions();
			unitsFunctions();
			buildingsAndUnitsFunctions();
		}
	}
});

// minimum rÃ¡diÃ³gomb esemÃ©nykezelÅ‘
function minimum() {
	for (var i = 0; i < buildings.length; i++) {
		min_level = obj.buildingsObj[buildings[i]].min_level;
		$('.building').eq(i).val(min_level);
	}
	buildingsFunctions();
	unitsFunctions();
	buildingsAndUnitsFunctions();
}

// maximum rÃ¡diÃ³gomb esemÃ©nykezelÅ‘
function maximum() {
	for (var i = 0; i < buildings.length; i++) {
		max_level = obj.buildingsObj[buildings[i]].max_level;
		$('.building').eq(i).val(max_level);
	}
	buildingsFunctions();
	unitsFunctions();
	buildingsAndUnitsFunctions();
}

// Ã©pÃ¼letek Ã©s egysÃ©gek elÅ‘feltÃ©teleinek vizsgÃ¡lata
function select() {
	if (buildingsLevel('headquarters', 3)) {
		enableBuilding('barracks');
	} else {
		disableBuilding('barracks');
	}
	if (buildingsLevel('headquarters', 10) && buildingsLevel('barracks', 5) && buildingsLevel('smith', 5)) {
		enableBuilding('stable');
	} else {
		disableBuilding('stable');
	}
	if (buildingsLevel('headquarters', 10) && buildingsLevel('smith', 10)) {
		enableBuilding('garage');
	} else {
		disableBuilding('garage');
	}
	if (buildingsLevel('headquarters', 5) && buildingsLevel('farm', 5)) {
		enableBuilding('church');
	} else {
		disableBuilding('church');
	}
	if (buildingsLevel('headquarters', 20) && buildingsLevel('smith', 20) && buildingsLevel('market', 10)) {
		enableBuilding('snob');
	} else {
		disableBuilding('snob');
	}
	if (buildingsLevel('headquarters', 5) && buildingsLevel('barracks', 1)) {
		enableBuilding('smith');
	} else {
		disableBuilding('smith');
	}
	if (buildingsLevel('headquarters', 3) && buildingsLevel('warehouse', 2)) {
		enableBuilding('market');
	} else {
		disableBuilding('market');
	}
	if (buildingsLevel('barracks', 1)) {
		enableBuilding('wall');
	} else {
		disableBuilding('wall');
	}
	if (buildingsLevel('headquarters', 5) && buildingsLevel('farm', 5)) {
		enableBuilding('watchtower');
	} else {
		disableBuilding('watchtower');
	}
	if (buildingsLevel('smith', 2)) {
		enableUnit('axe');
	} else {
		disableUnit('axe');
	}
	if (buildingsLevel('barracks', 5) && buildingsLevel('smith', 5)) {
		enableUnit('archer');
	} else {
		disableUnit('archer');
	}
	if (buildingsLevel('stable', 1)) {
		enableUnit('spy');
	} else {
		disableUnit('spy');
	}
	if (buildingsLevel('stable', 3)) {
		enableUnit('light');
	} else {
		disableUnit('light');
	}
	if (buildingsLevel('stable', 5)) {
		enableUnit('marcher');
	} else {
		disableUnit('marcher');
	}
	if (buildingsLevel('stable', 10) && buildingsLevel('smith', 15)) {
		enableUnit('heavy');
	} else {
		disableUnit('heavy');
	}
	if (buildingsLevel('garage', 1)) {
		enableUnit('ram');
	} else {
		disableUnit('ram');
	}
	if (buildingsLevel('garage', 2) && buildingsLevel('smith', 12)) {
		enableUnit('catapult');
	} else {
		disableUnit('catapult');
	}
	if (buildingsLevel('statue', 1)) {
		enableUnit('knight');
	} else {
		disableUnit('knight');
	}
	if (buildingsLevel('academy', 1) && buildingsLevel('headquarters', 20) && buildingsLevel('smith', 20) && buildingsLevel('market', 10)) {
		enableUnit('snob');
	} else {
		disableUnit('snob');
	}
}
void 0;
