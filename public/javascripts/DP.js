var testCtr = ["CSC", "MMC", "RSD", "RVC", "SVC", "SRS"];
var testAlyzr = ["APS", "COR", "DEM", "HIS", "MIO", "ORD", "REC", "SYN", "TRF"];
var fInterval = false;
var pInterval = false;
var vInterval = 1000;
var dataTest;
var testState = 0;
var sysTabNum = 2;
var pageData;

// Network
var valIP, valPort;

function initPage(){
	if (localStorage.pageData) {
		pageData=localStorage.getItem("pageData");
	} else {
		pageData=[{name:"System1",ip:"127.0.0.1",port:"8732"}];
		localStorage.setItem("pageData", pageData);
	};
	valIP = $("#valIP").val();
	valPort = $("#valPort").val();
};

function startInterval(){
	fInterval = setInterval(function () {
		$.post("/api/statusTest", {valIP: valIP, valPort: valPort}, function(data,status){
			dataTest = data;
			updateLayout();
			updateTest();
		});
	},vInterval);
};

function addSystem(){
	"<li class='nav-item'><a class='nav-link' id='tab-Sys" + sysTabNum + "' data-toggle='tab' href='#systemTab" + sysTabNum + "' role='tab' aria-controls='systemTab"+ sysTabNum + "' aria-selected='false'>System"+sysTabNum+"</a></li>"
}

function updateLayout(){
	if (testState!=0) {
		//declare vars
		data = dataTest;
		var txtInit = txtCont = txtEnd = "";

		// Populate tabs
		if (testState==1) {
			for (var i = 0; i < data.MeasStatus.length; i++) {
				if (i == 0) { // First tab is active
					$("#testTab").append(
						"<li class='nav-item'><a class='nav-link active show' id='tab-Meas" + i + "' data-toggle='tab' href='#Meas" + i + "' role='tab' aria-controls='Meas"+ i + "' aria-selected='true'>" + data.MeasStatus[i].Type + "</a></li>"
					);
				} else { // Following tabs are deactive
					$("#testTab").append(
						"<li class='nav-item'><a class='nav-link' id='tab-Meas" + i + "' data-toggle='tab' href='#Meas" + i + "' role='tab' aria-controls='Meas"+ i + "' aria-selected='false'>" + data.MeasStatus[i].Type + "</a></li>"
					);
				};
			}; //for tabs
			testState = 0;
		}; //if testState==1

		// Populate content
		if (testState==2) {
			for (var i = 0; i < data.MeasStatus.length; i++) {
				txtInit = txtCont = txtEnd = "";
				if (i == 0) { // First tab is active
					txtInit = "<div class='tab-pane fade active show' id='Meas" + i + "' role='tabpanel' aria-labelledby='nav-Meas" + i +"'>";
				} else { // Following tabs are deactive
					txtInit = "<div class='tab-pane fade' id='Meas" + i + "' role='tabpanel' aria-labelledby='nav-Meas" + i +"'>";
				};
				txtInit += "<table class='table-sm table-borderless table-hover'><tbody>";

				if (data.MeasStatus[i].RunStatus != null) {
					// get meas data
					dataMeas = eval("data.MeasStatus["+ i +"].RunStatus." + data.MeasStatus[i].Type + "_Status");

					for (var k = 0; k < Object.keys(dataMeas).length; k++) {
						switch (Object.keys(dataMeas)[k]) {
							case "Avg":
								txtCont += "<tr><td>Averages: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
								break;
							case "Frames":
								txtCont += "<tr><td>Frames: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
								break;
							case "Time":
								// txtCont += "<p><b>" + "Frames: " + "</b>" + Object.values(d)[k].Display + "</p>";
								txtCont += "<tr><td>Frames: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
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
				}; //if
			}; //for content
			testState = 0;
		}; //if testState==2
	}; //if testState!=0
}; //function

function updateTest(){
	data = dataTest;
	for (var i = 0; i < data.MeasStatus.length; i++) {
		if (data.MeasStatus[i].RunStatus != null) {
			// get meas data
			dataMeas = eval("data.MeasStatus["+ i +"].RunStatus." + data.MeasStatus[i].Type + "_Status");
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
};

function deleteTest(){
	$("#testTab").empty();
	$("#testTabContent").empty();
}

function btnState(vState){
	// 0: None
	// 1: Initalized
	// 2: Running
	// 3: Stopped
	// 4: End
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
}; //function btnState

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

$(document).ready(function(){



	valIP = $("#valIP").val();
	valPort = $("#valPort").val();
	// Initalize
	$("#btnInit").click( function(){
		$.post("/api/initTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		testState = 1;
		startInterval();
		btnState(1);
	});
	// Start
	$("#btnStart").click( function(){
		$.post("/api/startTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
		testState = 2;
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
		clearInterval(fInterval);
		fInterval = false;
		deleteTest();
		btnState(4);
	});
	//
	$("#btnAddTab").click( function(){
		$("#btnAddTab").before(
			"<li class='nav-item'><a class='nav-link' id='tab-Sys" + sysTabNum + "' data-toggle='tab' href='#systemTab" + sysTabNum + "' role='tab' aria-controls='systemTab"+ sysTabNum + "' aria-selected='false'>System"+sysTabNum+"</a></li>"
		);
		sysTabNum++;
	});
	$("#btnDelTab").click( function(){
		$("#btnAddTab").before(

		);
		sysTabNum++;
	});
	// Refresh Button
	$("#btnRefresh").click( function(){
		$.post("/api/statusTest", {valIP: valIP, valPort: valPort}, function(data,status){
			console.log(data);
			dataTest = data;
			updateLayout();
			updateTest();
		});
	});
	// Refresh Value
	$('#valRefresh').change( function() {
		if (vInterval !== $(this).val()*1000) {
			vInterval = $(this).val()*1000;
			console.log(vInterval);
			if (fInterval) {
				clearInterval(fInterval);
				startInterval();
			};
		};
	});
	// Network
	// IP
	$('#valIP').change( function() {
		valIP = $("#valIP").val();
	});
	// Port
	$('#valPort').change( function() {
		valPort = $("#valPort").val();
	});
});
