// HTML Selectors
const table = document.getElementById('mainTable');
const btn = document.getElementById('btn');
const dateField = document.getElementById('dateForCheckingAvailability');
const districtsField = document.getElementById('districtCodes');

// Init variables
let dateOfAvailability = `${new Date().getDate() + 1}-${new Date().getUTCMonth() + 1}-${new Date().getFullYear()}`;
dateField.value = dateOfAvailability;
let inputDistrictCodes = districtsField.value.replace(/\s/g, '').split(',');  // \s is spaces, so this strips any spaces from the input if user includes them.
let isFilteredResult = false;

// District Lookup Table
//TODO: Add more districts
const districtMap = new Map([
  [392, 'Thane'],
  [395, 'Mumbai'],
]);

const getVaccineAvailablity = async (districtIds, dateToCheck) => {
  const parsedData = [];
  const options = {
    eighteen: document.getElementById('optionsAge18plus').checked,
    fortyFive: document.getElementById('optionsAge45plus').checked,
    doseOne: document.getElementById('optionsDose1').checked,
    doseTwo: document.getElementById('optionsDose2').checked,
  };

  for (const districtId of districtIds) {
    console.log(`Checking for ${districtId} on ${dateToCheck}`);
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${dateToCheck}`;
    const data = await fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        alert("Error making API call - please wait a moment and try again.")
        throw new Error(err);
      });

    // Create new array of objects with only the data we want
    for (let i = 0; i < data.sessions.length; i++) {
      // This uses Object Destructuring & Property Shorthand to just get the subset of parameters that we need.
      const parsedObj = (({
        name,
        pincode,
        available_capacity_dose1,
        available_capacity_dose2,
        vaccine,
        fee_type,
        fee,
        min_age_limit,
      }) => ({
        name,
        pincode,
        available_capacity_dose1,
        available_capacity_dose2,
        vaccine,
        fee_type,
        fee,
        min_age_limit,
      }))(data.sessions[i]);

      // Add additional parameters we need
      parsedObj.districtId = districtId;
      parsedObj.districtName = districtMap.get(parseInt(districtId));
      if (parsedObj.min_age_limit === 18) {
        parsedObj.availabilityText = '18+';
      } else if (parsedObj.min_age_limit === 45) {
        parsedObj.availabilityText = '45+';
      }
      parsedData.push(parsedObj);
    }
  }

  let filteredData;
  if (options.eighteen && options.fortyFive) {
    if (options.doseOne && options.doseTwo) {
      filteredData = parsedData.filter((obj) => {
        return obj.available_capacity_dose1 > 0 || obj.available_capacity_dose2 > 0;
      });
    } else if (options.doseOne) {
      filteredData = parsedData.filter((obj) => {
        obj.available_capacity_dose1 > 0;
      });
    } else if (options.doseTwo) {
      filteredData = parsedData.filter((obj) => {
        obj.available_capacity_dose2 > 0;
      });
    } else {
      alert('ERROR: Code 100');
      throw new Error('Error 100');
    }
  } else if (options.eighteen) {
    if (options.doseOne && options.doseTwo) {
      filteredData = parsedData.filter((obj) => {
        return (
          obj.min_age_limit < 45 &&
          (obj.available_capacity_dose1 > 0 || obj.available_capacity_dose2 > 0)
        );
      });
    } else if (options.doseOne) {
      filteredData = parsedData.filter((obj) => {
        return obj.min_age_limit < 45 && obj.available_capacity_dose1 > 0;
      });
    } else if (options.doseTwo) {
      filteredData = parsedData.filter((obj) => {
        return obj.min_age_limit < 45 && obj.available_capacity_dose2 > 0;
      });
    } else {
      alert('ERROR: Code 101');
      throw new Error('Error 101');
    }
  } else if (options.fortyFive) {
    if (options.doseOne && options.doseTwo) {
      filteredData = parsedData.filter((obj) => {
        return (
          obj.min_age_limit >= 45 &&
          (obj.available_capacity_dose1 > 0 || obj.available_capacity_dose2 > 0)
        );
      });
    } else if (options.doseOne) {
      filteredData = parsedData.filter((obj) => {
        return obj.min_age_limit >= 45 && obj.available_capacity_dose1 > 0;
      });
    } else if (options.doseTwo) {
      filteredData = parsedData.filter((obj) => {
        return obj.min_age_limit >= 45 && obj.available_capacity_dose2 > 0;
      });
    } else {
      alert('ERROR: Code 102');
      throw new Error('Error 102');
    }
  } else {
    alert('ERROR: Code 103');
    throw new Error('Error 103');
  }

  updateTable(filteredData);
};

const updateTable = (vaccineDataArray) => {
  console.log(vaccineDataArray);
  // Delete old tbody
  table.childNodes[3].innerHTML = '<tbody></tbody>';

  // For each vaccine, add a row
  vaccineDataArray.forEach((item) => {
    const newRow = table.childNodes[3].insertRow();
    let newCell = newRow.insertCell();
    newCell.innerHTML = item.districtId;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.districtName;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.availabilityText;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.name;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.pincode;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.vaccine;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.fee_type;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.fee;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.available_capacity_dose1;
    newCell = newRow.insertCell();
    newCell.innerHTML = item.available_capacity_dose2;
  });
};

const verifyDate = (date) => {
  const reg = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\-](0?[1-9]|1[012])[\-]\d{4}$/);
  return reg.test(date);
};

const verifyDistrictCodes = (codes) => {
  for (let i = 0; i < codes.length; i++) {
    if (codes[i] === "") {
      return false
    }
    return true
  }
}

const search = () => {
  inputDistrictCodes = districtsField.value.replace(/\s/g, '').split(',');
  if(!verifyDistrictCodes(inputDistrictCodes)) {
    return alert("Please enter at least one district code.")
  }

  dateOfAvailability = dateField.value;
  if(!verifyDate(dateOfAvailability)) {
    return alert("Please enter a valid date (DD-MM-YYYY).")
  }

  getVaccineAvailablity(inputDistrictCodes, dateOfAvailability);
};
