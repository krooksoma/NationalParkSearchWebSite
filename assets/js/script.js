"use strict"
$(document).ready(function () {
    
    let cityResultText = {};
    
    let dayForecast = $("#row5day");
    let forecastDate = {};
    let forecastIcon = {};
    let forecastTemp = {};
    let forecastWind = {};
    let forecastHum = {};
    let forecastCity = {};
    let today = moment().format("MM" + "/" + "DD" + "/" + "YYYY");
    let APIKey = "&APPID=fb3dd2a5acdd03a900a040c7940d4846&units=imperial";
    let url = "https://api.openweathermap.org/data/2.5/";

    let citiesArray = JSON.parse(localStorage.getItem("Saved City")) || [];
    const changeBackgroundEl = $(".hero");
    const npsKey = "h6tXDWnmFLuDQHAPIhnXzQKP5pBX66EKu0vrNdFn";
    const searchInput = $("#searchBar");
    const searchSubmit = $("#input-field");

    let parkName;
    let parkCity;
    // let weatherCard;


    const imgs = ["assets/img/Alaska.jpg", "assets/img/GrandCanyon.jpg",
        "assets/img/nPark.jpg", "assets/img/Rockies.jpg", "assets/img/Yosemite.jpg"];

    changeBackgroundEl.attr("src", `${imgs[0]}`);

    let i = 1;

    // fades out first image
    let timerOut = setTimeout(() => {
        changeBackgroundEl.fadeOut(1000, $);

    }, 7000)

    // call recallTimer every 7 sec


    const recallTimer = () => {

        if (i < 5) {
            // fades in new image
            changeBackgroundEl.attr("src", `${imgs[i]}`).fadeIn(1000, $);
            i++;
            //  fades out the new image after 6 secs
            let timerOut = setTimeout(() => {
                changeBackgroundEl.fadeOut(1000, $);

            }, 7000)
            // else to resets index value.
        } else {
            i = 1
            changeBackgroundEl.attr("src", `${imgs[0]}`).fadeIn(1000, $);
            let timerOut = setTimeout(() => {
                changeBackgroundEl.fadeOut(1000, $);

            }, 7000)
        };

    }

    let internalTimer = setInterval(recallTimer, 8000);


    //  put it inside function to call park info
    function fetchParkData(event) {
        event.preventDefault();
        let currentSearch = searchInput.val();

        fetch(`https://developer.nps.gov/api/v1/parks?q=${currentSearch}&api_key=${npsKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                // calling each park name
                data.data.forEach(displayData)

            })
        // search for specific park part
    }


    searchSubmit.submit(fetchParkData);


    // display data acquired from API
    function displayData(park) {

        parkName = park.name;
        parkCity = park.addresses[0].city;

        let parkList = $("#park-list");
        // create div for the column and attach to the main div container

        let item = $("<div>").addClass("col custom-card"); //change custom-card class on css later to container
        parkList.append(item);
        // card title
        let itemCard = $("<h3>").addClass("card-title").text(parkName);
        item.append(itemCard);
        // card button
        let infoBtn = $("<button>").addClass("show-modal custom-button waves-effect waves-light btn").text("More Info");
        item.append(infoBtn);

        // div to add the card to
        let bigCardContent = $("<div>").addClass("row-12 hidden");
        item.append(bigCardContent);
       

        // creates a card for the city

        let listCard = $ ("<div>").addClass("card col-2");
        bigCardContent.append(listCard);


        
        // create card for each park and attach to park list div
      
        $.getJSON(`https://developer.nps.gov/api/v1/parks?q=${parkName}&api_key=${npsKey}`, function (data) {

            let activities = data.data[0].activities;
            

            // creating a div and adding a list to it with each activity
            let listActivities = $("<div>");

            // gets activitites from APi and add to the div
            
            for (let i = 0; i < activities.length; i++) {
                let parkActivities = activities[i].name;
                
                let newActivity = $("<li>").text(parkActivities);
                listActivities.append(newActivity);
                
            }
            listCard.append(listActivities);
            
        })
            ;


    //    add weather Data for each park on -9 space
        let rowCards = $("<div>").addClass("card col-8");

       
    
            let weatherCard = $("<div>").addClass("row").attr("id", "custom-format");
            rowCards.append(weatherCard);
            
    
            let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${parkCity}&units=imperial&APPID=fb3dd2a5acdd03a900a040c7940d4846`;
            $.ajax({
                url: forecastURL,
            }).then(function (response) {
                // creating card for weather

                for (let i = 0; i < response.list.length; i += 8) {
    
                    forecastCity = response.city.name;
                    forecastDate[i] = response.list[i].dt_txt;
                    forecastIcon[i] = response.list[i].weather[0].icon;
                    forecastTemp[i] = response.list[i].main.temp;
                    forecastWind[i] = response.list[i].wind.speed;
                    forecastHum[i] = response.list[i].main.humidity;
    
                    
    
                    let newDivCard = $("<div>").addClass("card text-white bg-primary col").css({"max-width": "12rem"});
                    weatherCard.append(newDivCard);
    
                    let newCardBody = $("<div>").addClass("card-content");
                    newDivCard.append(newCardBody);
    
                    let newH5 = $("<h5>").addClass("card-title").text(moment(forecastDate[i]).format("MMM Do"));
                    newCardBody.append(newH5);
    
                    let newImg = $("<img>").addClass("card-img-top").attr("src", `https://openweathermap.org/img/wn/${forecastIcon[i]}@2x.png`);
                    newCardBody.append(newImg);
    
                    let newPTemp = $("<p>").addClass("card-text").text(`Temp: ${Math.floor(forecastTemp[i])}ºF`);
                    newCardBody.append(newPTemp);
    
                    let newPWind = $("<p>").addClass("card-text").text(`Wind: ${forecastWind[i]} MPH`);
                    newCardBody.append(newPWind);
    
                    let newPHum = $("<p>").addClass("card-text").text(`Hum: ${forecastHum[i]} %`);
                    newCardBody.append(newPHum);                    
                    
                }
     
            });
       

        bigCardContent.append(rowCards);
        
        storeData(parkName);
        
    }
    $(document).on("click", ".show-modal", function (e) {
        console.log("click, click, clicking ®️Dan");
        e.target.nextSibling.classList.toggle("hidden");
    })


    

    // remember to call it after everything is working
    function storeData(locStorage) {
        console.log(locStorage);
        let inputStorage = locStorage.toLowerCase();
        let containsCity = false;
        if (citiesArray != null) {
            $(citiesArray).each(function (x) {
                if (citiesArray[x] === inputStorage) {
                    containsCity = true;
                }
            });
        }
        if (containsCity === false) {
            citiesArray.push(inputStorage);
        }
        localStorage.setItem("Saved City", JSON.stringify(citiesArray));
    }

 
});