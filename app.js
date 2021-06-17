//gettting HTML Table from index.html
let table = document.getElementById('mainTable');

//default value is current day + 1 day i.e. next day
let dateOfAvailability = `${new Date().getDate() + 1}-${new Date().getUTCMonth() + 1}-${new Date().getFullYear()}`;
//default value is 392(THANE) 395(MUMBAI)
let inputDistrictCodes = [392, 395];

//default value of notification:
let sendNotification = true;

//Setting API Call Counter
let countAPICalls = 0;

//condition that is set getVaccineAvaialbility to filter records received from API Call
let condition = false;
//This function has limit of 100 hits per 5 min interval.This amounts it an average of 1 API call per 3 seconds.
async function getVaccineAvailablity(districtID, dateForCheckingAvailability) {
    console.log(`Checking for ${districtID} as on  ${dateForCheckingAvailability}`);

    const API_URL_GET_BY_DISCTRICT_ID = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtID}&date=${dateForCheckingAvailability}`;
    const response = await fetch(API_URL_GET_BY_DISCTRICT_ID);

    //converting API Response into JSON
    let data = await response.json();

    //setting conditions based on user input


    console.log(data);
    for (i = 0; i < data.sessions.length; i++) {
        //if available capacity (regardless of dose number or age) is more than 0, then the following block of code will execute
        if (data.sessions[i].available_capacity > 0) {

            //insert row
            let districtName = "";
            if (districtID == 395) {
                districtName = "Mumbai"
            }
            else if (districtID == 392) {
                districtName = "Thane"
            } else {
                districtName = "NA"
            }
            if (document.getElementById('optionsAge18plus').checked && data.sessions[i].min_age_limit < 45) {
                if (document.getElementById('optionsDose1').checked && document.getElementById('optionsDose2').checked) {
                    //show both dose 1 & dose 2 details
                    //Note: Here dose 1 or dose 2 avaialability is note checked, because if neither of them was available, then this code block would not run
                    //This code block is sub clause of top level If statement that runs only if (available_dose > 0)
                    insertRowInTable(districtID, districtName, `18+ Any Dose`, data.sessions[i].name, data.sessions[i].pincode, data.sessions[i].available_capacity_dose1, data.sessions[i].available_capacity_dose2);

                }
                else if (document.getElementById('optionsDose1').checked && data.sessions[i].available_capacity_dose1 > 0) {
                    //show dose 1 details only
                    insertRowInTable(districtID, districtName, `18+ Dose 1`, data.sessions[i].name, data.sessions[i].pincode, data.sessions[i].available_capacity_dose1, "NA");
                }
                else if (document.getElementById('optionsDose2').checked && data.sessions[i].available_capacity_dose2 > 0) {
                    //show dose 2 details only
                    insertRowInTable(districtID, districtName, `18+ Dose 2`, data.sessions[i].name, data.sessions[i].pincode, "NA", data.sessions[i].available_capacity_dose2);
                }
            }
            if (document.getElementById('optionsAge45plus').checked && data.sessions[i].min_age_limit > 18) {
                if (document.getElementById('optionsDose1').checked && document.getElementById('optionsDose2').checked) {
                    //show both dose 1 & dose 2 details
                    //Note: Here dose 1 or dose 2 avaialability is note checked, because if neither of them was available, then this code block would not run
                    //This code block is sub clause of top level If statement that runs only if (available_dose > 0)
                    insertRowInTable(districtID, districtName, `45+ Any Dose`, data.sessions[i].name, data.sessions[i].pincode, data.sessions[i].available_capacity_dose1, data.sessions[i].available_capacity_dose2);
                }
                else if (document.getElementById('optionsDose1').checked && data.sessions[i].available_capacity_dose1 > 0) {
                    //show dose 1 details only
                    insertRowInTable(districtID, districtName, `45+ Dose 1`, data.sessions[i].name, data.sessions[i].pincode, data.sessions[i].available_capacity_dose1, "NA");
                }
                else if (document.getElementById('optionsDose2').checked && data.sessions[i].available_capacity_dose2 > 0) {
                    //show dose 2 details only
                    insertRowInTable(districtID, districtName, `45+ Dose 2`, data.sessions[i].name, data.sessions[i].pincode, "NA", data.sessions[i].available_capacity_dose2);
                }
            }
        }
        //when search is complete, show notification
        if (i = data.sessions.length) {
            //if rows are added to the table, then show notification:
            console.log("Table Length " + table.rows.length);
            if (table.rows.length > 1) {
                showNotification();
            }
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
        for (i = -1 * table.rows.length; i < -1; i++) {
            table.deleteRow(i * -1 - 1);
        }
    }


    for (j = 0; j < inputDistrictCodes.length; j++) {
        getVaccineAvailablity(inputDistrictCodes[j], dateOfAvailability);
        countAPICalls += 1;
    }
    document.getElementById('API_CALL_Count').innerText = `API Call Count: ${countAPICalls}`;



}

// Acquiring notification permission on checking "notifications" checkbox
function getNotificationPermission() {
    if (document.getElementById('notifications').checked) {
        let permissionStatus = Notification.permission;
        console.log(permissionStatus);
        if (permissionStatus === 'granted') {
            document.getElementById('notificationPermissionStatus').innerHTML = "Notification Permission Granted";
        } else if (permissionStatus !== 'denied') {
            Notification.requestPermission().then(permissionRequest => {
                permissionStatus = permissionRequest;
                if (permissionStatus === 'granted') {
                    document.getElementById('notificationPermissionStatus').innerHTML = "Notification Permission Granted";
                    sendNotification = true;
                } else {
                    document.getElementById('notificationPermissionStatus').innerHTML = "Notification Permission Blocked";
                    sendNotification = false;
                }
            })
        } else {
            document.getElementById('notificationPermissionStatus').innerHTML = "Notification Permission Blocked (If you need notification then allow from browser menu)";
            sendNotification = false;
        }
    } else {
        document.getElementById('notificationPermissionStatus').innerHTML = "";
        sendNotification = false;
    }
}

function showNotification() {
    console.log("Called");
    if (sendNotification === true) {
        const notification = new Notification("Vaccination Tracker", {
            body: `Vaccine avaialble!`
        });
    }
}

//inserting rows in tables
function insertRowInTable(_districtID, _districtName, _availabilityText, _name, _pinCode, _available_capacity_dose1, _available_capacity_dose2) {
    let newRow = table.insertRow();
    let newCell = newRow.insertCell();
    newCell.innerHTML = _districtID;
    newCell = newRow.insertCell();
    newCell.innerHTML = _districtName;
    newCell = newRow.insertCell();
    //insert Age and Dose Details here:
    newCell.innerHTML = _availabilityText;
    newCell = newRow.insertCell();
    newCell.innerHTML = _name;
    newCell = newRow.insertCell();
    newCell.innerHTML = _pinCode;
    newCell = newRow.insertCell();
    newCell.innerHTML = _available_capacity_dose1;
    newCell = newRow.insertCell();
    newCell.innerHTML = _available_capacity_dose2;

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
getNotificationPermission();
setInterval(search, inputDistrictCodes.length * 3 * 1000);
