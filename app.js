//Defining constants for Mumbai and Thane
const MUMBAI_DISTRICT_ID = 395;
const THANE_DISTRICT_ID = 392;
const DATE_OF_AVAILABILITY = '02-06-2021';

//Defining boolean variables for avaialbility:
let isAvailableMumbai = false;
let isAvailableThane = false;


//Defining Arrays for getting data out from JSON object
let centerName, address, pincode, min_age_limit, available_capacity_dose1, vaccine = [];

/*
    This function has limit of 100 hits per 5 min interval.
    This amounts it an average of 1 API call per 3 seconds.
*/


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

    //gettting HTML Table from index.html
    let table = document.getElementById('mainTable');

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


            // listNames = `${listNames}</br>${data.sessions[i].name}      ${data.sessions[i].pincode}`
        }
    }

}


getVaccineAvailablity(MUMBAI_DISTRICT_ID, DATE_OF_AVAILABILITY);
getVaccineAvailablity(THANE_DISTRICT_ID, DATE_OF_AVAILABILITY);
