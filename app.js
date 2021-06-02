//gettting HTML Table from index.html
let table = document.getElementById('mainTable');

//default value is current day + 1 day i.e. next day
let dateOfAvailability = `${new Date().getDate() + 1}-${new Date().getUTCMonth() + 1}-${new Date().getFullYear()}`;
//default value is 392(THANE) 395(MUMBAI)
let inputDistrictCodes = [392, 395];


//Setting API Call Counter
let countAPICalls = 0;
//This function has limit of 100 hits per 5 min interval.This amounts it an average of 1 API call per 3 seconds.
async function getVaccineAvailablity(districtID, dateForCheckingAvailability) {
    console.log(`Checking for ${districtID} as on  ${dateForCheckingAvailability}`);

    const API_URL_GET_BY_DISCTRICT_ID = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtID}&date=${dateForCheckingAvailability}`;
    const response = await fetch(API_URL_GET_BY_DISCTRICT_ID);

    //converting API Response into JSON
    let data = await response.json();


    console.log(data);
    for (i = 0; i < data.sessions.length; i++) {
        if (data.sessions[i].available_capacity_dose1 > 0 && data.sessions[i].min_age_limit < 45) {
            //insert row
            let districtName = "";
            if (districtID == 395) {
                districtName = "Mumbai"
            }
            if (districtID == 392) {
                districtName = "Thane"
            }
            let newRow = table.insertRow();
            let newCell = newRow.insertCell();
            newCell.innerHTML = districtID;
            newCell = newRow.insertCell();
            newCell.innerHTML = districtName;
            newCell = newRow.insertCell();
            newCell.innerHTML = "Yes";
            newCell = newRow.insertCell();
            newCell.innerHTML = data.sessions[i].name;
            newCell = newRow.insertCell();
            newCell.innerHTML = data.sessions[i].pincode;
            newCell = newRow.insertCell();
            newCell.innerHTML = data.sessions[i].available_capacity_dose1;
        }
    }

}
function search() {
    //populating updated values from user input form into dateOfAvailability and inputDistrictCodes;
    dateOfAvailability = document.getElementById('dateForCheckingAvailability').value;
    inputDistrictCodes = document.getElementById('disctrictCodes').value;
    console.log(dateOfAvailability);
    console.log(inputDistrictCodes);
    inputDistrictCodes = inputDistrictCodes.split(",");
    document.getElementById('refreshTimerText').innerText = `Auto Refreshes every ${inputDistrictCodes.length * 3} seconds`;
    //clear existing records
    if (table.rows.length > 1) {
        console.log(table.rows.length);
        for (i = 1; i <= table.rows.length; i++) {
            table.deleteRow(1);
        }
    }

    for (j = 0; j < inputDistrictCodes.length; j++) {
        getVaccineAvailablity(inputDistrictCodes[j], dateOfAvailability);
        countAPICalls += 1;
    }
    document.getElementById('API_CALL_Count').innerText = `API Call Count: ${countAPICalls}`;

}

//setting up default values
document.getElementById('dateForCheckingAvailability').value = dateOfAvailability;
document.getElementById('disctrictCodes').value = inputDistrictCodes;
search();
//run search on pressing enter
document.onkeydown = function (event) {
    if (event.key !== undefined) {
        code = event.key;
    } else if (event.keyIdentifier !== undefined) {
        code = event.keyIdentifier;
    } else if (event.keyCode !== undefined) {
        code = event.keyCode;
    }
    if (event.keyCode == 13) {
        search();
    }
}

//auto refreshing every (3 * number of disctricts) seconds. If there are 2 district codes, then the code will auto run every 6 seconds
setInterval(search, inputDistrictCodes.length * 3 * 1000);
