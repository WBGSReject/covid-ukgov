
function getRegionFilters() {
  var filters = [
    "areaType=nhsRegion",
    "areaType=nation;areaName=northern ireland",
    "areaType=nation;areaName=wales",
    "areaType=nation;areaName=scotland"
  ];
  return filters;
}

function getDailyVaccineData () {
  const num_days_reqd = 60;
  const days_before_now = 0;
  const sheetname = "Daily Vaccinations";
  const region = getRegionFilters();
  const day_in_ms = 1000 * 60 * 60 * 24;
  const now = new Date();
  var tgt = new Date(now - days_before_now * day_in_ms); //go back n days from today
  const end_tgt = new Date(tgt - num_days_reqd * day_in_ms);
  var yy = tgt.getFullYear();
  var mm = tgt.getMonth();
  var dd = tgt.getDate();
  var data_grid = [], columns =[], columns_set = false;
  while (tgt > end_tgt) {
    var mm_txt = twoDigitText(mm + 1);
    var dd_txt = twoDigitText(dd);
    Logger.log("getting data for " + yy + mm_txt + dd_txt);
    var aUrl = "https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;date="+ yy + "-" + mm_txt + "-" + dd_txt + "&structure={%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22newPeopleReceivingFirstDose%22:%22newPeopleReceivingFirstDose%22,%22newPeopleReceivingSecondDose%22:%22newPeopleReceivingSecondDose%22}";
    var data = getJSON(aUrl);
    if (data.length > 0) {        
      for (var d in data) {
        var data_row = [];
        var cols = data[d];
        for (var j in cols) {   
          if (!columns_set) {
            columns.push(j);
          }
          data_row.push(cols[j]);
        }
        columns_set = true;
        data_grid.push(data_row);
      }
    }
    //subtract a day
    tgt = new Date(tgt - day_in_ms);
    yy = tgt.getFullYear();
    mm = tgt.getMonth();
    dd = tgt.getDate(); 
    
    //help!
    if (yy < 2020) break;
  } //end of while loop
  writeDataGridToSheet(data_grid, columns, sheetname);  
}

function getNHSTrustData() {
  const days_before_now = 0;
  const sheetname = "NHS Trust Data";
  const region = "areaType=nhsTrust";
  const day_in_ms = 1000 * 60 * 60 * 24;
  const now = new Date();
  var tgt = new Date(now - days_before_now * day_in_ms); //go back n days from today
  var yy = tgt.getFullYear();
  var mm = tgt.getMonth();
  var dd = tgt.getDate();
  var data_grid = [], columns =[], columns_set = false;
  while (true) {
    var mm_txt = twoDigitText(mm + 1);
    var dd_txt = twoDigitText(dd);
    Logger.log("getting data for " + yy + mm_txt + dd_txt + " filter=" + region);
    var aUrl = "https://api.coronavirus.data.gov.uk/v1/data?filters=" + region + ";date="+ yy + "-" + mm_txt + "-" + dd_txt + 
      "&structure={%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22hospitalCases%22:%22hospitalCases%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22}";
    var data = getJSON(aUrl);
    if (data.length > 0) {
      for (var d in data) {
        var data_row = [];
        var cols = data[d];
        for (var j in cols) {   
          if (!columns_set) {
            columns.push(j);
          }
          data_row.push(cols[j]);
        }
        columns_set = true;
        data_grid.push(data_row);
      }
      break;
    }
    //subtract a day
    tgt = new Date(tgt - day_in_ms);
    yy = tgt.getFullYear();
    mm = tgt.getMonth();
    dd = tgt.getDate(); 
    
    //just in case
    if (yy < 2020) break;
  } //end of while loop
  writeDataGridToSheet(data_grid, columns, sheetname);
}


function getDailyData() {
  const num_days_reqd = 33;
  const days_before_now = 0;
  const sheetname = "Daily Hospital Cases";
  const region = getRegionFilters();
  const day_in_ms = 1000 * 60 * 60 * 24;
  const now = new Date();
  var tgt = new Date(now - days_before_now * day_in_ms); //go back n days from today
  const end_tgt = new Date(tgt - num_days_reqd * day_in_ms);
  var yy = tgt.getFullYear();
  var mm = tgt.getMonth();
  var dd = tgt.getDate();
  var data_grid = [], columns =[], columns_set = false;
  while (tgt > end_tgt) {
    var mm_txt = twoDigitText(mm + 1);
    var dd_txt = twoDigitText(dd);
    for (var r in region) {
      Logger.log("getting data for " + yy + mm_txt + dd_txt + " filter=" + region[r]);
      var aUrl = "https://api.coronavirus.data.gov.uk/v1/data?filters=" + region[r] + ";date="+ yy + "-" + mm_txt + "-" + dd_txt + "&structure={%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22hospitalCases%22:%22hospitalCases%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22}";
      var data = getJSON(aUrl);
      if (data.length > 0) {        
        for (var d in data) {
          var data_row = [];
          var cols = data[d];
          for (var j in cols) {   
            if (!columns_set) {
              columns.push(j);
            }
            data_row.push(cols[j]);
          }
          columns_set = true;
          data_grid.push(data_row);
        }
      }
    }
    //subtract a day
    tgt = new Date(tgt - day_in_ms);
    yy = tgt.getFullYear();
    mm = tgt.getMonth();
    dd = tgt.getDate(); 
    
    //help!
    if (yy < 2020) break;
  } //end of while loop
  writeDataGridToSheet(data_grid, columns, sheetname);
}

//get monthly data
//unusual in that it has a fixed end point ie April 2020
function getMonthlyData() {
  var mm_txt, dd_txt;
  const long_months = [1,3,5,7,8,10,12];
  const end_month = 2;
  const end_year = 2020;
  const days_before_now = 0;
  const region = getRegionFilters();
  const sheetname = "Monthly Hospital Cases";
  const day_in_ms = 1000 * 60 * 60 * 24;
  const now = new Date();
  var tgt = new Date(now - days_before_now * day_in_ms); //go back n days from today
  var yy = tgt.getFullYear();
  var mm = tgt.getMonth();
  var dd = tgt.getDate();
  var first_date_check = true;
  var data_grid = [], columns =[], columns_set = false;
  while (!(yy == end_year && mm == end_month)) {
    mm_txt = twoDigitText(mm+1);
    if (mm == 1 && dd > 28) dd_txt = "28"; //leap years?
    else if (long_months.indexOf(mm+1) == -1 && dd == 31) dd_txt = "30";
    else dd_txt = twoDigitText(dd);
    for (var r in region) {
      while (true) {        
        Logger.log("getting data for " + yy + mm_txt + dd_txt + " filter=" + region[r]);
        var aUrl = "https://api.coronavirus.data.gov.uk/v1/data?filters=" + region[r] + ";date="+ yy + "-" + mm_txt + "-" + dd_txt + "&structure={%22date%22:%22date%22,%22areaName%22:%22areaName%22,%22hospitalCases%22:%22hospitalCases%22,%22covidOccupiedMVBeds%22:%22covidOccupiedMVBeds%22}";
        var data = getJSON(aUrl);
        if (data.length > 0) {
          for (var d in data) {
            var data_row = [];
            var cols = data[d];
            for (var j in cols) {   
              if (!columns_set) {
                columns.push(j);
              }
              data_row.push(cols[j]);
            }
            columns_set = true;
            data_grid.push(data_row);
          }
          first_date_check = false;
          break;
        }
        else {
          if (!first_date_check) break;
          //subtract a day
          tgt = new Date(tgt - day_in_ms);
          yy = tgt.getFullYear();
          mm = tgt.getMonth();
          dd = tgt.getDate();           
          mm_txt = twoDigitText(mm+1);
          dd_txt = twoDigitText(dd);
        }
        if (yy < 2020) break; //just in case
      }
    }
    //subtract a month
    if (mm - 1 < 0) {
     mm = 11;
     yy = yy - 1;
    }
    else {
     mm = mm - 1;
    }
    if (yy < 2020) break; //just for emergencies
  }
  writeDataGridToSheet(data_grid, columns, sheetname);
}

function writeDataGridToSheet(data_grid, columns, sheet_name) {
  Logger.log("writing " + data_grid.length + " rows"); 
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  sheet = doc.getSheetByName(sheet_name) ? doc.getSheetByName(sheet_name) : doc.insertSheet(sheet_name);
  sheet.clear();
  writeHeader(sheet, columns); 
  var row_num = 2, range;
  range = sheet.getRange(row_num, 1, data_grid.length, columns.length);
  range.setValues(data_grid);
}

function twoDigitText(n) {
  var txt = Number(n).toString();
  if (txt.length < 2) txt = "0" + txt;  
  return txt;
}

//fetch the data
function getJSON(aUrl) {
  var aUrl_encoded = encodeURI(aUrl);
  var response = UrlFetchApp.fetch(aUrl_encoded); // get feed
  try {
    var dataAll = JSON.parse(response.getContentText());
    var data = dataAll.data;
    return data;
  }
  catch (err) {
    return [];
  }
}

//write header
function writeHeader(sheet, data) {
  var cell, col_num=1;
  for (var d in data) {    
    cell = sheet.getRange(1,col_num++);
    cell.setValue(data[d]);
  }
}
