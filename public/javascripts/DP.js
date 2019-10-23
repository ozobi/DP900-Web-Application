var testCtrlr = ["CSC", "MMC", "RSD", "RVC", "SVC", "SRS"];
var testAnlyzr = ["APS", "COR", "DEM", "HIS", "MIO", "ORD", "REC", "SYN", "TRF"];
var fInterval = false;
var vInterval = 1;
var valIP, valPort;

var dataTest;
var testState = layoutState = panelTestState = panelLayoutState = 0;
var measState = [];
var curTest = "";
var curTestIndex = curTestType = 0;

function startInterval(){
	fInterval = setInterval(function () {
		$.post("/api/statusTest", {valIP: valIP, valPort: valPort}, function(data,status){
			dataTest = data;
			updatePage();
		});
	},vInterval*1000);
};

function checkState(){
	// Panel Layout State:
	// 0: Empty
	// 1: Full

	// Panel Data State:
	// 0: Same
	// 1: Empty
	// 2: Different

	// PANEL STATE
	switch ($("#testTab a.active").text()) {
		case curTest:
			panelTestState = 0;
			break;
		case "":
			panelTestState = 1;
			break;
		default:
			panelTestState = 2;
			break;
	};
	curTest = $("#testTab a.active").text();
	curTestIndex = $("#testTab a.active").index();

	// Test Type:
	// 0: Empty
	// 1: Controller
	// 2: Analyzer

	if (curTest == "") {
		curTestType = 0;
	} else {
		if (testCtrlr.includes(curTest)) {
			curTestType = 1;
		} else if (testAnlyzr.includes(curTest)) {
			curTestType = 2;
		} else {
			console.log("Error: Unknown test type! - "+ curTest);
		};
	};

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

	// TEST & MEASUREMENT STATE
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
	};
};

function updatePanel(){
	// get meas data
	for (var i = 0; i < dataTest.MeasStatus.length; i++) {
		if (curTest == dataTest.MeasStatus[i].Type) {
			dataMeas = eval("dataTest.MeasStatus["+ i +"].RunStatus." + dataTest.MeasStatus[i].Type + "_Status");
		};
	};
	switch (curTest) {
		// Analyzer
		case "APS":
		case "COR":
		case "DEM":
		case "HIS":
		case "MIO":
		case "ORD":
		case "REC":
		case "SYN":
		case "TRF":
			for (var k = 0; k < Object.keys(dataMeas).length; k++) {
				switch (Object.keys(dataMeas)[k]) {
					case "Time":
					eval("$('#dPanel"+ k + "').text('" + Object.values(dataMeas)[k].Display + "')");
					break;
					case "RecSize_Bytes":
					eval("$('#dPanel"+ k + "').text('" + formatBytes(Object.values(dataMeas)[k]) + "')");
					break;
					case "WaitForTrig":
					// toggleTrig("tab-Meas"+ i);
					default:
					eval("$('#dPanel"+ k +"').text("+ Object.values(dataMeas)[k] +")");
					break;
				};
			};
			break;

		// Controller
		case "RVC":
		case "MMC":
			// Panel 1
			$('#panel1Val1').text(dataMeas.TimeRemaining.Display);
			$('#panel1Val2').text(dataMeas.TimeAtLevel.Display);
			$('#panel1Val3').text(dataMeas.TotalTime.Display);
			// Panel 2
			$('#panel2Val1').text(dataMeas.Level_dB.toPrecision(2) + " dB");
			$('#panel2Val2').text(dataMeas.Ref.toPrecision(2) + " " + dataMeas.RefEU);
			$('#panel2Val3').text(dataMeas.Control.toPrecision(4) + " " + dataMeas.ControlEU);
			$('#panel2Val4').text(dataMeas.Drive.toPrecision(4) + " " + dataMeas.DriveEU);
			// ProgressBar
			$('#progressbar').attr("style","width: "+(dataMeas.Stage/dataMeas.TotalStages).toPrecision(2)*100+"%");
			break;

		case "SVC":
		case "RSD":
			// Panel 1
			$('#panel1Val1').text(dataMeas.SweepsRemaining);
			$('#panel1Val2').text(dataMeas.SweepsElapsed);
			$('#panel1Val3').text(dataMeas.TotalTime.Display);
			// Panel 2
			$('#panel2Val1').text(dataMeas.Freq_Hz.toPrecision(2) + " Hz");
			$('#panel2Val2').text(dataMeas.Control.toPrecision(4) + " " + dataMeas.ControlEU);
			$('#panel2Val3').text(dataMeas.Disp.toPrecision(4) + " " + dataMeas.DispEU);
			$('#panel2Val4').text(dataMeas.Drive.toPrecision(4) + " " + dataMeas.DriveEU);
			// ProgressBar
			$('#progressbar').attr("style","width: "+(dataMeas.Stage/dataMeas.TotalStages).toPrecision(2)*100+"%");
			break;

		case "CSC":
		case "SRS":
			// Panel 1
			$('#panel1Val1').text(dataMeas.Remaining);
			$('#panel1Val2').text(dataMeas.AtLevel);
			$('#panel1Val3').text(dataMeas.Total);
			// Panel 2
			$('#panel2Val1').text(dataMeas.Level_dB.toPrecision(2) + " dB");
			$('#panel2Val2').text(dataMeas.Ref.toPrecision(2) + " " + dataMeas.RefEU);
			$('#panel2Val3').text(dataMeas.Control.toPrecision(4) + " " + dataMeas.ControlEU);
			$('#panel2Val4').text(dataMeas.Drive.toPrecision(4) + " " + dataMeas.DriveEU);
			// ProgressBar
			$('#progressbar').attr("style","width: "+(dataMeas.Stage/dataMeas.TotalStages).toPrecision(2)*100+"%");
			break;

		default:
			console.log("Error: Unknown test type! - "+ curTest);
			break;
	};
};

function updatePanelDisp(){
	switch (measState[curTestIndex]) {
		case 0:
		case 1:
		case 2:
			$(".panelController").hide("slow");
			$(".panelAnalyzer").hide("slow");
			$(".panelProgress").hide("slow");
			break;
		case 3:
		case 4:
		case 5:
			switch (curTestType) {
				case 0:
					$(".panelController").hide("slow");
					$(".panelAnalyzer").hide("slow");
					$(".panelProgress").hide("slow");
					break;
				case 1:
					$(".panelController").show("slow");
					$(".panelAnalyzer").hide("slow");
					$(".panelProgress").show("slow");
					break;
				case 2:
					$(".panelController").hide("slow");
					$(".panelAnalyzer").show("slow");
					$(".panelProgress").hide("slow");
					break;
				default:
					console.log("Error: Unknown test type! - "+ curTestType);
					break;
			};
			break;
	};
};

function updatePage(){
	// Layout State:
	// 0: None
	// 1: Tabs
	// 2: Measurements
	checkState();

	// TEST
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
					console.log("Error: testState="+testState+", layoutState="+layoutState)
					break;
			};
			switch (panelLayoutState) {
				case 0: // 0: Empty
					break;
				case 1:	// 1: Full
					deletePanel();
					break;
				default:
					deletePanel();
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
					console.log("Error: testState="+testState+", layoutState="+layoutState)
					break;
			};
			switch (panelLayoutState) {
				case 0: // 0: Empty
					break;
				case 1:	// 1: Full
					deletePanel();
					break;
				default:
					deletePanel();
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
					console.log("Error: testState="+testState+", layoutState="+layoutState)
					break;
			};
			switch (panelLayoutState) {
				case 0: // 0: Empty
					break;
				case 1:	// 1: Full
					deletePanel();
					break;
				default:
					deletePanel();
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
					console.log("Error: testState="+testState+", layoutState="+layoutState)
					break;
			};
			switch (panelLayoutState) {
				case 0: // 0: Empty
					createPanel();
					updatePanel();
					break;
				case 1:	// 1: Full
					switch (panelTestState) {
						case 0: // 0: Same
							updatePanel();
							break;
						case 1: // 1: Empty
							deletePanel();
							break;
						case 2: // 2: Different
							deletePanel();
							createPanel();
							break;
						default:
							console.log("Error: testState="+testState+", panelTestState="+panelTestState);
							break;
					};
					break;
				default:
					deletePanel();
					break;
			};
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
					console.log("Error: testState="+testState+", layoutState="+layoutState)
					break;
			};
			switch (panelLayoutState) {
				case 0: // 0: Empty
					createPanel();
					updatePanel();
					break;
				case 1:	// 1: Full
					switch (panelTestState) {
						case 0: // 0: Same
							updatePanel();
							break;
						case 1: // 1: Empty
							deletePanel();
							break;
						case 2: // 2: Different
							deletePanel();
							createPanel();
							break;
						default:
							console.log("Error: testState="+testState+", panelTestState="+panelTestState);
							break;
					};
					break;
				default:
					deletePanel();
					break;
			};
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
					console.log("Error: testState="+testState+", layoutState="+layoutState)
					break;
			};
			switch (panelLayoutState) {
				case 0: // 0: Empty
					createPanel();
					updatePanel();
					break;
				case 1:	// 1: Full
					switch (panelTestState) {
						case 0: // 0: Same
							updatePanel();
							break;
						case 1: // 1: Empty
							deletePanel();
							break;
						case 2: // 2: Different
							deletePanel();
							createPanel();
							break;
						default:
							console.log("Error: testState="+testState+", panelTestState="+panelTestState);
							break;
					};
					break;
				default:
					deletePanel();
					break;
			};
			btnState(3);
			break;

		default:
			console.log("Error: testState="+testState)
			break;
		};
	updatePanelDisp();
};

function updateDataTest(){
	for (var i = 0; i < dataTest.MeasStatus.length; i++) {
		// get meas data
		dataMeas = eval("dataTest.MeasStatus["+ i +"].RunStatus." + dataTest.MeasStatus[i].Type + "_Status");
		// Populate content
		for (var k = 0; k < Object.keys(dataMeas).length; k++) {
			switch (Object.keys(dataMeas)[k]) {
				// =--Analyzer--=
				case "Time":
					eval("$('#dMeas" + i + k + "').text('" + Object.values(dataMeas)[k].Display + "')");
					break;
				case "RecSize_Bytes":
					eval("$('#dMeas" + i + k + "').text('" + formatBytes(Object.values(dataMeas)[k]) + "')");
					break;
				case "WaitForTrig":
				// toggleTrig("tab-Meas"+ i);
				// =--Controller--=
				case "Control":
				case "Drive":
					eval("$('#dMeas" + i + k + "').text(" + Object.values(dataMeas)[k].toPrecision(4) + ")");
					break;
				case "Level_dB":
				case "Ref":
				case "Freq_Hz":
				case "Disp":
					eval("$('#dMeas" + i + k + "').text(" + Object.values(dataMeas)[k].toPrecision(2) + ")");
					break;
				case "ControlEU":
				case "DriveEU":
				case "RefEU":
				case "DispEU":
					eval("$('#dMeas" + i + k + "').text(' " + Object.values(dataMeas)[k] + "')");
					break;
				case "TimeAtLevel":
				case "TimeRemaining":
				case "TotalTime":
				case "TimeElapsed":
					eval("$('#dMeas" + i + k + "').text('" + Object.values(dataMeas)[k].Display + "')");
					break;
				default:
					eval("$('#dMeas"+ i + k +"').text("+ Object.values(dataMeas)[k] +")");
					break;
			};
		};
	};
};

function createPanel(){
	txtPanelTxt = txtPanelVal = "";
	switch (curTest) {
		// Analyzer
		case "APS":
		case "COR":
		case "DEM":
		case "HIS":
		case "MIO":
		case "ORD":
		case "REC":
		case "SYN":
		case "TRF":
			// get meas data
			for (var i = 0; i < dataTest.MeasStatus.length; i++) {
				if (curTest == dataTest.MeasStatus[i].Type) {
					dataMeas = eval("dataTest.MeasStatus["+ i +"].RunStatus." + dataTest.MeasStatus[i].Type + "_Status");
					for (var k = 0; k < Object.keys(dataMeas).length; k++){
						switch (Object.keys(dataMeas)[k]) {
							case "Avg":
								txtPanelTxt += "<div class='my-1'>Averages:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							case "Frames":
								txtPanelTxt += "<div class='my-1'>Frames:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							case "Time":
								txtPanelTxt += "<div class='my-1'>Time:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							case "TotalSaves":
								txtPanelTxt += "<div class='my-1'>Total Saves:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							case "WFRecs":
								txtPanelTxt += "<div class='my-1'>Waterfall Records:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							case "WaitForTrig":
								txtPanelTxt += "<div class='my-1'>Trigger State:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							case "RecSize_Bytes":
								txtPanelTxt += "<div class='my-1'>Record Size:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
							default:
								txtPanelTxt += "<div class='my-1'>!Unknown Value!:</div>";
								txtPanelVal += "<div class='my-1' id='"+ "dPanel"+ k +"'>-</div>";
								break;
						};
					};
				};
			};
			break;
		case "RVC":
		case "MMC":
				// Panel 1 - Text
				$("#panel1Txt1").text("Remaining:")
				$("#panel1Txt2").text("At Level:")
				$("#panel1Txt3").text("Total Time:")
				// Panel 2 - Text
				$("#panel2Txt1").text("Level:")
				$("#panel2Txt2").text("Reference:")
				$("#panel2Txt3").text("Control:")
				$("#panel2Txt4").text("Drive:")
			break;
		case "SVC":
		case "RSD":
				// Panel 1 - Text
				$("#panel1Txt1").text("Remaining:")
				$("#panel1Txt2").text("Elapsed:")
				$("#panel1Txt3").text("Total Time:")
				// Panel 2 - Text
				$("#panel2Txt1").text("Frequency:")
				$("#panel2Txt2").text("Control:")
				$("#panel2Txt3").text("Displ. (pk-pk):")
				$("#panel2Txt4").text("Drive:")
			break;
		case "CSC":
		case "SRS":
				// Panel 1 - Text
				$("#panel1Txt1").text("Remaining:")
				$("#panel1Txt2").text("At Level:")
				$("#panel1Txt3").text("Total:")
				// Panel 2 - Text
				$("#panel2Txt1").text("Level:")
				$("#panel2Txt2").text("Reference:")
				$("#panel2Txt3").text("Control:")
				$("#panel2Txt4").text("Drive:")
			break;
		default:
				$("#panel1Txt1").text("!Unknown!:")
				$("#panel1Txt2").text("!Unknown!:")
				$("#panel1Txt3").text("!Unknown!:")
				$("#panel2Txt1").text("!Unknown!:")
				$("#panel2Txt2").text("!Unknown!:")
				$("#panel2Txt3").text("!Unknown!:")
				$("#panel2Txt4").text("!Unknown!:")
			break;
	};

	if (testAnlyzr.includes(curTest)){
		$("#panelATxt").append(txtPanelTxt);
		$("#panelAVal").append(txtPanelVal);
	} else if (testCtrlr.includes(curTest)) {
		// Panel 1 - Values
		$("#panel1Val1").text("")
		$("#panel1Val2").text("")
		$("#panel1Val3").text("")
		// Panel 2 - Values
		$("#panel2Val1").text("")
		$("#panel2Val2").text("")
		$("#panel2Val3").text("")
		$("#panel2Val4").text("")
	} else {
		console.log("Error: Unknown test!:"+curTest+" - can't fill / udpate panel");
	};
	panelLayoutState = 1;
};

function deletePanel(){
	$("#panelATxt").empty();
	$("#panelAVal").empty();
	panelLayoutState = 0;
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
					// =--Analyzer--=
					case "Avg":
						txtCont += "<tr><td>Averages: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "Frames":
						txtCont += "<tr><td>Frames: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					case "Time":
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
						break;
					case "RecSize_Bytes":
						txtCont += "<tr><td>Record Size: </td><td id='"+ "dMeas"+ i + k +"'></td></tr>";
						break;
					// =--Controller--=
					// RVC // MMC
					case "Control":
						txtCont += "<tr><td>Control: </td><td id='"+ "dMeas"+ i + k +"' ></td>";
						break;
					case "ControlEU":
						txtCont += "<td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Drive":
						txtCont += "<tr><td>Drive: </td><td id='"+ "dMeas"+ i + k +"' ></td>";
						break;
					case "DriveEU":
						txtCont += "<td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Level_dB":
						txtCont += "<tr><td>Level: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Ref":
						txtCont += "<tr><td>Reference: </td><td id='"+ "dMeas"+ i + k +"' ></td>";
						break;
					case "RefEU":
						txtCont += "<td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Stage":
						txtCont += "<tr><td>Stage: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "TimeAtLevel":
						txtCont += "<tr><td>At Level: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "TimeRemaining":
						txtCont += "<tr><td>Remaining Time: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "TotalStages":
						txtCont += "<tr><td>Total Stages: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "TotalTime":
						txtCont += "<tr><td>Total Time: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					// SVC	// RSD
					case "CyclesElapsed":
						txtCont += "<tr><td>Cycles Elapsed: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "CyclesRemaining":
						txtCont += "<tr><td>Cycles Remaining: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Disp":
						txtCont += "<tr><td>Displacement: </td><td id='"+ "dMeas"+ i + k +"' ></td>";
						break;
					case "DispEU":
						txtCont += "<td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Freq_Hz":
						txtCont += "<tr><td>Frequency: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "SweepsElapsed":
						txtCont += "<tr><td>Sweeps Elapsed: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "SweepsRemaining":
						txtCont += "<tr><td>Sweeps Remaining: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "TimeElapsed":
						txtCont += "<tr><td>Elapsed Time: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					// CSC	// SRS
					case "AtLevel":
						txtCont += "<tr><td>At Level: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Remaining":
						txtCont += "<tr><td>Remaining: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
						break;
					case "Total":
						txtCont += "<tr><td>Total: </td><td id='"+ "dMeas"+ i + k +"' ></td></tr>";
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
	$('#valRefresh').change( function(){
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
		deleteLayoutTest();
	});
	$("#btnClose").click( function(){
		$.post("/api/closeTest", {valIP: valIP, valPort: valPort}, function(data,status){
			$("#cmdStatus").text(data);
		});
	});
	// Network
	// IP
	$('#valIP').change( function(){
		valIP = $("#valIP").val();
		localStorage.valIP = $("#valIP").val();
	});
	// Port
	$('#valPort').change( function(){
		valPort = $("#valPort").val();
		localStorage.valPort = $("#valPort").val();
	});
});
