#Introduction
This is a simple website that lets you monitor vaccine availability using API Setu (https://apisetu.gov.in/)
This app however does not book appointments for you. For the purpose of appointment you can visit https://selfregistration.cowin.gov.in/.

#How to use this website:
1. Download the zip file
2. Extract the zip file 
3. Open index.html in browser
4. You can change the options and click on search.
5. Let it auto-refresh for updating after set intervals (Generally refresh interval = 3 x Number of Disctrict IDs)


#Notes about CoWIN API
1. As per CoWin API guidelines on API Setu, the API Call limit is 100 API calls per 5 Minutes. This means on average you could make 1 API Request every 3 seconds. 
2. API requests are served from cached data. Hence, there could be cases where the data received by the app could be upto 30 mins old.
3. API calls is being allowed only from Indian IP. If you make an API call from outside india, you will receive 
    ```
    {
    "message": "Forbidden"
    }
    ```

#Options:
For the purpose of this project, I have used only 2 District IDs 
Thane   392
Mumbai  395

You can check for other district IDs by inserting comma separated disctrict IDs in the user input form.
You can get district IDs from API Setu.