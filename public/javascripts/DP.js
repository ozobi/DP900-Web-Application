var testCtr = ["CSC", "MMC", "RSD", "RVC", "SVC", "SRS"];
var testAlyzr = ["APS", "COR", "DEM", "HIS", "MIO", "ORD", "REC", "SYN", "TRF"];
var fInterval = false;
var vInterval = 1;
var valIP, valPort;

var dataTest;
var testState, layoutState = 0;
var measState = [];

function startInterval(){
	fInterval = setInterval(function () {
		$.post("/api/statusTest", {valIP: valIP, valPort: valPort}, function(data,status){
			dataTest = data;
			updatePage();
		});
	},vInterval*1000);
};

function checkState(){
	// REST Data:
	// -1: No test / test open
	// 0: Initalized
	// 1: Pretest
	// 2: Running
	// 3: Stopped

	// Test State:
	// 0: None
	// 1: Open
	// 2: Initalized
	// 3: Pretest
	// 4: Running
	// 5: Stopped
	// 1: End

	// test not loaded
	if (dataTest | dataTest.MeasStatus.length==0 ) {
		measState = [0];
		testState = 0;
	} else {
		var k;
		for (var i = 0; i < dataTest.MeasStatus.length; i++) {
			switch (dataTest.MeasStatus[i].State) {
				case -1: // Test opened
					k=1;
					break;
				case 0: // Initalized
					k=2;
					break;
				case 1: // Pretest
					k=3;
					break;
				case 2: // Running
					k=4;
					break;
				case 3: // Stopped
					k=5;
					break;
				default:
					console.log("Error: MeasStatus["+i+"]");
					break;
			}
			measState[i] = k;
		};
		testState = measState.sort()[0];
	} // if test not loaded
};

function updatePage(){
	// Layout State:
	// 0: None
	// 1: Tabs
	// 2: Measurements
	checkState();

	switch (testState) {
		case 0:	// 0: None
			switch (layoutState) {
				case 0: // 0: None
					break;
				case 1: // 1: Tabs
				case 2: // 2: Measurements
					deleteLayoutTest();
					break;
				default:
					console.log("Error: testState=0, layoutState=?")
					break;
			};
			btnState(0);
			break;

		case 1: // 1: Open
			switch (layoutState) {
				case 0: // 0: None
					createLayoutTabs();
					break;
				case 1: // 1: Tabs
					break;
				case 2: // 2: Measurements
					deleteLayoutTest();
					createLayoutTabs();
					break;
				default:
					console.log("Error: testState=1, layoutState=?")
					break;
			};
			btnState(4);
			break;

		case 2: // 2: Initalized
			switch (layoutState) {
				case 0: // 0: None
					createLayoutTabs();
					break;
				case 1: // 1: Tabs
					break;
				case 2: // 2: Measurements
					deleteLayoutTest();
					createLayoutTabs();
					break;
				default:
					console.log("Error: testState=2, layoutState=?")
					break;
			};
			btnState(1);
			break;

		case 3: // 3: Pretest
			switch (layoutState) {
				case 0: // 0: None
					createLayoutTabs();
					createLayoutMeas();
					updateDataTest();
					break;
				case 1: // 1: Tabs
					createLayoutMeas();
					updateDataTest();
					break;
				case 2: // 2: Measurements
					updateDataTest();
					break;
				default:
					console.log("Error: testState=3, layoutState=?")
					break;
			}
			btnState(2);
			break;

		case 4: // 4: Running
			switch (layoutState) {
				case 0: // 0: None
					createLayoutTabs();
					createLayoutMeas();
					updateDataTest();
					break;
				case 1: // 1: Tabs
					createLayoutMeas();
					updateDataTest();
					break;
				case 2: // 2: Measurements
					updateDataTest();
					break;
				default:
					console.log("Error: testState=4, layoutState=?")
					break;
			}
			btnState(2);
			break;

		case 5: // 5: Stopped
			switch (layoutState) {
				case 0: // 0: None
					createLayoutTabs();
					createLayoutMeas();
					updateDataTest();
					break;
				case 1: // 1: Tabs
					createLayoutMeas();
					updateDataTest();
					break;
				case 2: // 2: Measurements
					updateDataTest();
					break;
				default:
					console.log("Error: testState=5, layoutState=?")
					break;
			}
			btnState(3);
			break;

		default:
			console.log("Error: testState=?")
			break;
		};
};

function updateDataTest(){
	for (var i = 0; i < dataTest.MeasStatus.length; i++) {
		// get meas data
		dataMeas = eval("dataTest.MeasStatus["+ i +"].RunStatus." + dataTest.MeasStatus[i].Type + "_Status");
		// Populate content
		for (var k = 0; k < Object.keys(dataMeas).length; k++) {
			switch (Object.keys(dataMeas)[k]) {
				case "Time":
					eval("$('#dMeas" + i + k + "').text('" + Object.values(dataMeas)[k].Display + "')");
					break;
				case "RecSize_Bytes":
					eval("$('#dMeas" + i + k + "').text('" + formatBytes(Object.values(dataMeas)[k]) + "')");
					break;
				case "WaitForTrig":
				// toggleTrig("tab-Meas"+ i);
				default:
					eval("$('#dMeas"+ i + k +"').text("+ Object.values(dataMeas)[k] +")");
					break;
			};
		};
	};
};

function createLayoutTabs(){
	for (var i = 0; i < dataTest.MeasStatus.length; i++) {
		if (i == 0) { // First tab is active
			$("#testTab").append(
				"<li class='nav-item'><a class='nav-link active show' id='tab-Meas" + i + "' data-toggle='tab' href='#Meas" + i + "' role='tab' aria-controls='Meas"+ i + "' aria-selected='true'>" + dataTest.MeasStatus[i].Type + "</a></li>"
			);
		} else { // Following tabs are deactive
			$("#testTab").append(
				"<li class='nav-item'><a class='nav-link' id='tab-Meas" + i + "' data-toggle='tab' href='#Meas" + i + "' role='tab' aria-controls='Meas"+ i + "' aria-selected='false'>" + dataTest.MeasStatus[i].Type + "</a></li>"
			);
		};
	};
	layoutState = 1;
};

function createLayoutMeas(){
	for (var i = 0; i < dataTest.MeasStatus.length; i++) {
		txtInit = txtCont = txtEnd = "";
		if (i == 0) { // First tab is active
			txtInit = "<div class='tab-pane fade active show' id='Meas" + i + "' role='tabpanel' aria-labelledby='nav-Meas" + i +"'>";
		} else { // Following tabs are deactive
			txtInit = "<div class='tab-pane fade' id='Meas" + i + "' role='tabpanel' aria-labelledby='nav-Meas" + i +"'>";
		};
		txtInit += "<table class='table-sm table-borderless table-hover'><tbody>";

		if (dataTest.MeasStatus[i].RunStatus != null) {
			// get meas data
			dataMeas = eval("dataTest.MeasStatus["+ i +"].RunStatus." + dataTest.MeasStatus[i].Type + "_Status");

			for (var k = 0; k < Object.keys(dataMeas).length; k++) {
				switch (Object.keys(dataMeas)[k]) {
					case "Avg":
						txtCont += "<tr><td>Averages: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "Frames":
						txtCont += "<tr><td>Frames: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "Time":
						// txtCont += "<p><b>" + "Time: " + "</b>" + Object.values(d)[k].Display + "</p>";
						txtCont += "<tr><td>Time: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "TotalSaves":
						txtCont += "<tr><td>Total Saves: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "WFRecs":
						txtCont += "<tr><td>Waterfall Records: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "WaitForTrig":
						txtCont += "<tr><td>Trigger State: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						// toggleTrig("tab-Meas"+ i);
						break;
					case "RecSize_Bytes":
						txtCont += "<tr><td>Record Size: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					default:
						txtCont += "<tr><td>!Unknown Value!: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
				}; //switch
			}; //for
			txtEnd = "</table></tbody></div>";
			$("#testTabContent").append(txtInit+txtCont+txtEnd);
		}; // if
	}; // for - main
	layoutState = 2;
};

function deleteLayoutTest(){
	$("#testTab").empty();
	$("#testTabContent").empty();
	layoutState = 0;
};

function btnState(vState){
	// 0: None
	// 1: Initalized
	// 2: Running
	// 3: Stopped
	// 4: End, Test Open
	switch (vState) {
		case 0: // None
		$(function(){
			$("#btnInit").attr("disabled",true);
			$("#btnStart").attr("disabled",true);
			$("#btnStop").attr("hidden",false);
			$("#btnStop").attr("disabled",true);
			$("#btnResume").attr("hidden",true);
			$("#btnResume").attr("disabled",true);
			$("#btnEnd").attr("disabled",true);
		});
			break;
		case 1: // Initalized
		$(function(){
			$("#btnInit").attr("disabled",true);
			$("#btnStart").attr("disabled",false);
			$("#btnStop").attr("hidden",false);
			$("#btnStop").attr("disabled",true);
			$("#btnResume").attr("hidden",true);
			$("#btnResume").attr("disabled",true);
			$("#btnEnd").attr("disabled",false);
		});
			break;
		case 2: // Running
		$(function(){
			$("#btnInit").attr("disabled",true);
			$("#btnStart").attr("disabled",true);
			$("#btnStop").attr("hidden",false);
			$("#btnStop").attr("disabled",false);
			$("#btnResume").attr("hidden",true);
			$("#btnResume").attr("disabled",true);
			$("#btnEnd").attr("disabled",true);
		});
			break;
		case 3: // Stopped
		$(function(){
			$("#btnInit").attr("disabled",true);
			$("#btnStart").attr("disabled",true);
			$("#btnStop").attr("hidden",true);
			$("#btnStop").attr("disabled",true);
			$("#btnResume").attr("hidden",false);
			$("#btnResume").attr("disabled",false);
			$("#btnEnd").attr("disabled",false);
		});
			break;
		case 4: // End
		$(function(){
			$("#btnInit").attr("disabled",false);
			$("#btnStart").attr("disabled",true);
			$("#btnStop").attr("hidden",false);
			$("#btnStop").attr("disabled",true);
			$("#btnResume").attr("hidden",true);
			$("#btnResume").attr("disabled",true);
			$("#btnEnd").attr("disabled",true);
		});
			break;
		default:
		$(function(){
			$("#btnInit").attr("disabled",true);
			$("#btnStart").attr("disabled",true);
			$("#btnStop").attr("hidden",false);
			$("#btnStop").attr("disabled",true);
			$("#btnResume").attr("hidden",true);
			$("#btnResume").attr("disabled",true);
			$("#btnEnd").attr("disabled",true);
		});
	}; //switch
};

function initConfig(){
	// Network
	if (localStorage.valIP) {
		$("#valIP").val(localStorage.valIP);
	}
	if (localStorage.valPort) {
		$("#valPort").val(localStorage.valPort);
	}
	valIP = $("#valIP").val();
	valPort = $("#valPort").val();

	// Refresh
	if (localStorage.vInterval) {
		$("#valRefresh").val(localStorage.vInterval);
	}
	vInterval = $("#valRefresh").val();
	$("#div-valRefresh").addClass("is-filled");

	// Test Name
	if (localStorage.nameTest) {
		$("#nameTest").val(localStorage.nameTest);
	}
	$("#div-nameTest").addClass("is-filled");
};

function formatBytes(bytes, decimals = 2){
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

$(document).ready(function(){
	initConfig();
	startInterval();
	// Initalize
	$("#btnInit").click( function(){
		$.post("/api/initTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		btnState(1);
	});
	// Start
	$("#btnStart").click( function(){
		$.post("/api/startTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		btnState(2);
	});
	// Resume
	$("#btnResume").click( function(){
		$.post("/api/resumeTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		btnState(2);
	});
	// Stop
	$("#btnStop").click( function(){
		$.post("/api/stopTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		btnState(3);
	});
	// End
	$("#btnEnd").click( function(){
		$.post("/api/endTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		btnState(4);
	});
	// Refresh
	$("#btnRefresh").click( function(){
		$.post("/api/statusTest", {valIP: valIP, valPort: valPort}, function(data,status){
			console.log(data);
			dataTest = data;
			updatePage();
		});
	});
	// Refresh Value
	$('#valRefresh').change( function() {
		if (vInterval !== $(this).val()) {
			vInterval = $(this).val();
			localStorage.vInterval = $(this).val();
			//console.log(vInterval);
			if (fInterval) {
				clearInterval(fInterval);
				startInterval();
			};
		};
	});
	// Open / Close
	$("#btnOpen").click( function(){
		$.post("/api/openTest", {valIP: valIP, valPort: valPort, name:$("#nameTest").val()}, function(data,status){
			$("#cmdStatus").text(data);
		});
		localStorage.nameTest = $("#nameTest").val();
	});
	$("#btnClose").click( function(){
		$.post("/api/closeTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
	});
	// Network
	// IP
	$('#valIP').change( function() {
		valIP = $("#valIP").val();
		localStorage.valIP = $("#valIP").val();
	});
	// Port
	$('#valPort').change( function() {
		valPort = $("#valPort").val();
		localStorage.valPort = $("#valPort").val();
	});
});
