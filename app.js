//gettting HTML Table from index.html
let table = document.getElementById('mainTable');

//default value is current day + 1 day i.e. next day
let dateOfAvailability = `${new Date().getDate() + 1}-${new Date().getUTCMonth() + 1}-${new Date().getFullYear()}`;
//default value is 392(THANE) 395(MUMBAI)
let inputDistrictCodes = [392, 395];

//This function has limit of 100 hits per 5 min interval.This amounts it an average of 1 API call per 3 seconds.
async function getVaccineAvailablity(districtID, dateForCheckingAvailability) {
    console.log(`Checking for ${districtID} as on  ${dateForCheckingAvailability}`);

    const API_URL_GET_BY_DISCTRICT_ID = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtID}&date=${dateForCheckingAvailability}`;
    const response = await fetch(API_URL_GET_BY_DISCTRICT_ID);
    let districtName = "";
    if (districtID === 395) {
        districtName = "Mumbai"
    }
    if (districtID === 392) {
        districtName = "Thane"
    }

    //converting API Response into JSON
    let data = await response.json();


    console.log(data);
    for (i = 0; i < data.sessions.length; i++) {
        if (data.sessions[i].available_capacity_dose1 > 0 && data.sessions[i].min_age_limit < 45) {
            //insert row
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

    //clear existing records
    if (table.rows.length > 1) {
        console.log(table.rows.length);
        for (i = 0; i <= table.rows.length; i++) {
            table.deleteRow(1);
        }
    }

    for (j = 0; j < inputDistrictCodes.length; j++) {
        getVaccineAvailablity(inputDistrictCodes[j], dateOfAvailability);
    }
}

//setting up default values
document.getElementById('dateForCheckingAvailability').value = dateOfAvailability;
document.getElementById('disctrictCodes').value = inputDistrictCodes;

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
