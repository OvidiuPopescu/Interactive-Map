let zoomInButton = document.getElementById('zoom-in-button');
let zoomOutButton = document.getElementById('zoom-out-button');
var mapZoom = 100;
var markerZoom = 100;
var interval;

let searchMarkerInput = document.getElementById('search-marker-input');
let searchButton = document.getElementById('search-button');
let markerData = document.getElementsByClassName('marker-container');
let jumpTarget = -1;
let extractedName = '';
let jumpToEventButton = document.getElementById('jump-button');

let eventsList = document.getElementById('events-list');
let detailedText = document.getElementById('detailed-text');
let nextEventButton = document.getElementById('next-event-button');
let previousEventButton = document.getElementById('previous-event-button');
let returnButoon = document.getElementById('return-button');
let dateRangeValue = [1,2,3,4,5,6,7,8,9,10];
let dateTexts = ["21 May 4001","5 June 4001","19 June 4001","25 October 4001","1 January 4002","13 March 4002","23 July 4002","10 November 4002","11 Februray 4003","31 April 4003"];
let startingDate = -1;
let noEvent = document.createElement('div');                                                   /*elementul in care va aprea mesajul atunci cand un marker cautat nu are eveniment pentru data curenta*/
let dateRange = document.getElementById('date-range');
let date = document.getElementById('date');

let dateDay = document.getElementById('date-day');
let dateMonth = document.getElementById('date-month');
let dateYear = document.getElementById('date-year');
let changeDateButton = document.getElementById('change-date');
let dayDropdown = document.getElementById('days');
let monthDropdown = document.getElementById('months');
let yearDropdown = document.getElementById('years');

let details = document.getElementById('event-details');
let markerId = "";

let selectedMonthDates = [];                                                         /*variable will contain all dates that have the same month as the currently selected one*/
let dateEditActive = 0;                                                              /*variable used for remembering if date editing is on*/

let monthLoop = function() {
    for (i = 0; i < monthDropdown.options.length; i++) {                                /*loop trough all the options of the month dropdown...*/
        monthDropdown.options[i].style.display = 'none';                                /*...hide all...*/
        for (x = 0; x < currentYear.length; x++) {                                      /*...and find the ones that appear in the date objects...*/
            if (monthDropdown.options[i].value == currentYear[x].month) {                       
                console.log(monthDropdown.options[i].value);
                monthDropdown.options[i].style.display = 'block';                      /*...and reenable them*/

                if (monthDropdown.options[i].value == monthDropdown.value) {           /*search for all dates that contain the currently selected month*/                
                    selectedMonthDates.push(currentYear[x]);                           /*add them to the array*/
                    console.log(selectedMonthDates);
                }
            }
        }
    }
}
let dayLoop = function() {
    for (i = 0; i < dayDropdown.options.length; i++) {                               /*loop through all the dayDropdown options...*/
        dayDropdown.options[i].style.display = 'none';
        for (x = 0; x < selectedMonthDates.length; x++) {
          if(dayDropdown.options[i].value == selectedMonthDates[x].day) {            /*...find all that have a coresponding value in the dates from the array...*/
            dayDropdown.options[i].style.display = 'block';                          /*...and reenable them*/
          }
        }
    }
}

/*character objects*/

class character {
    constructor(name,marker,eventSummaries,eventDetails) {
      this.name = name;
      this.marker = marker;
      this.eventSummaries = eventSummaries;
      this.eventDetails = eventDetails;
      let newDiv = document.createElement('div');
      newDiv.classList.add('new-div');
      this.eventListEntry = newDiv;
      this.selectMarkerEvent = function() {
        markerId = marker.id;                                                               /*store the id of the currently slected marker so the marker can be selected again on pageload*/
        localStorage.setItem("marker", markerId);
        marker.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            })
        jumpToEventButton.style.display = 'none';                                                /*make the no-event specific changes disapear when clicking on another event on the list*/
        noEvent.innerHTML = '';
        previousEventButton.style.display = 'inline-block';
        nextEventButton.style.display = 'inline-block';
        returnButoon.style.display = 'inline-block';

        

        if(eventSummaries[dateRange.value-1] != ""){                                              /*pentr ca sa aiba loc doar 'scrollIntoView' a markerului atunci cand functia estea activata de cautatrea personaljului in search input, dar acesta nu are entries pe data curenta*/
            if(!newDiv.id){                                                                       /*doar daca nu este personajul selectat reapasat*/
            returnButoon.setAttribute('disabled','true');                                         /*dezactiveaza x button cand schimbam personajul selectat*/
            startingDate = -1;                                                                    /*pentru a uita pozitia salvata cand schimbam personajul selectat*/
            }
            let listEntries = eventsList.childNodes;
            listEntries.forEach(function(entry){
                entry.removeAttribute('id');
            })
            newDiv.setAttribute('id','selected-event');
            
            for (let i = 0; i < eventSummaries.length; i++) {
                if(newDiv.innerHTML == eventSummaries[i]) {
                    detailedText.innerHTML = eventDetails[i];
                }
            }
            
            if(dateRange.value != 3) {
            nextEventButton.removeAttribute('disabled');
            };
            if(dateRange.value != 1) {
            previousEventButton.removeAttribute('disabled');
            };
            if(detailedText.innerHTML == eventDetails[eventDetails.length-1]) {
                console.log('this is the last one');
                nextEventButton.setAttribute('disabled','true');
            }
            let positionToCheckFrom = dateRange.value;                                                             
            for(positionToCheckFrom; positionToCheckFrom < eventDetails.length; positionToCheckFrom++) {       /*verificam daca exista text pentru pozitile urmatoare; daca toate sunt goale dezactivam 'nextEventButton'*/
                if (eventDetails[positionToCheckFrom] != '') {
                    console.log('Nu e ultimul');
                    nextEventButton.removeAttribute('disabled');
                    return;
                } else {
                    nextEventButton.setAttribute('disabled','true');
                }
            }
            jumpToEventButton.style.display = 'none';                                                           /*ascundem elementle care au aparut in urma cautarii unui marker lipsit de event*/
            noEvent.innerHTML = '';
            previousEventButton.style.display = 'inline-block';
            nextEventButton.style.display = 'inline-block';
            returnButoon.style.display = 'inline-block';
            console.log('Event runed once'); 
         } else {
            noEvent.setAttribute('class', 'notCurrentEvent');
            eventsList.prepend(noEvent);
            jumpToEventButton.style.display = 'inline-block';
            previousEventButton.style.display = 'none';
            nextEventButton.style.display = 'none';
            returnButoon.style.display = 'none';
            
            let previousEventPosition = dateRange.value-2;                                                                                                                                                                                /*dateRange.value e +1 fata de array index pozition asa ca avem nevoie de -2 pentr a porni verificarea de la eveniemntul anterior*/
            console.log(previousEventPosition);
            for (previousEventPosition; previousEventPosition > -1; previousEventPosition--) {                                                                                                                                            /*verificam pana la prima pozitie posibila (0)*/
                if(eventSummaries[previousEventPosition] != "") {                                                                                                                                                                         /*cum gasim una ce are text, afisam si oprim cautarea cu 'return'*/
                    noEvent.innerHTML = name + ' has no event on this date. ' + '<br />' + 'Previous event is on ' + dateTexts[previousEventPosition] ;    
                    detailedText.innerHTML = '<strong>' + 'From ' + dateTexts[previousEventPosition] + ':' + '</strong>' + '<br />' + '<strong><em>' + eventSummaries[previousEventPosition] + '</strong></em>' + '<br />' + '<em>' + eventDetails[previousEventPosition] + '</em>';
                    jumpTarget = previousEventPosition;                                                                                                                                                                                   /*stocam pozitia evenimentului corespunzator*/             
                    return;                                                                                                                                                                                                                                                                                                                                               
                }
            }/*aici o sa fie nevoie de un else pentru cazul in care cautam inainte de primul eveniment  existent*/
         }
        }; 
      
      this.forrwardButtonEvent = function() {
        dayDropdown.style.display = 'none';                                                 /*restore date text and hide dropdowns*/
        monthDropdown.style.display = 'none';
        yearDropdown.style.display = 'none';
        dateDay.style.display = 'inline-block';                                             
        dateMonth.style.display = 'inline-block';
        dateYear.style.display = 'inline-block';
  
        console.log('One time');
        previousEventButton.removeAttribute('disabled');
        if (startingDate == -1) {
            startingDate = dateRange.value-1;
        };

        for (let i = 0; i < eventSummaries.length; i++) {
            if(detailedText.innerHTML == eventDetails[i]) {
                for( let x = 1; x < eventDetails.length; x++) {  
                    if(eventDetails[i+x] != '') {
                        dateRange.value = dateRangeValue[i+x];
                        dateFunctions[i+x]();
                        console.log('second event runed');
                        localStorage.setItem('dateRangeValue', dateRange.value);                /*to remember the local storage values when pressing forrward*/
                        localStorage.setItem('date',i+x);                      
                        detailedText.innerHTML = eventDetails[i+x];
                        newDiv.setAttribute('id','selected-event');
                        marker.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center',
                        });

                        console.log(startingDate);
                        console.log(dateRange.value);
                        if(dateRange.value == startingDate+1) {                                                                                                                    /*'dateRange.value' are aici valoarea anterioara apasarii butonului, deci va fi egala cu pozitia actuala - 1, cea ce o face egala cu valoare din starting date*/ 
                            returnButoon.setAttribute('disabled','true');
                            console.log('return disabled');
                        }else{
                            returnButoon.removeAttribute('disabled');
                            console.log('return not disabled');  
                        }

                        if(eventDetails[i+x] == eventDetails[eventDetails.length-1]) {
                            console.log('This is the last one');
                            nextEventButton.setAttribute('disabled','true');
                        }        
                        let positionToCheckFrom = i+x+1;                                                             
                        for(positionToCheckFrom; positionToCheckFrom < eventDetails.length; positionToCheckFrom++) {       /*verificam daca exista text pentru pozitile urmatoare; daca toate sunt goale dezactivam 'nextEventButton'*/
                            if (eventDetails[positionToCheckFrom] != '') {
                                console.log('Nu e ultimul');
                                nextEventButton.removeAttribute('disabled');
                                return;
                            } else {
                                nextEventButton.setAttribute('disabled','true');
                                console.log('E ultimul');
                            }
                        }
                        return;
                    }       
                }
            }
        }  
      };

      this.previousButtonEvent = function() {
        dayDropdown.style.display = 'none';                                                 /*restore date text and hide dropdowns*/
        monthDropdown.style.display = 'none';
        yearDropdown.style.display = 'none';       
        dateDay.style.display = 'inline-block';                                             
        dateMonth.style.display = 'inline-block';
        dateYear.style.display = 'inline-block';
        nextEventButton.removeAttribute('disabled');

        if(startingDate == -1) {
            startingDate = dateRange.value-1;
        };      
        for (let i = 0; i < eventSummaries.length; i++) {
            if(detailedText.innerHTML == eventDetails[i]) {
                for(let x = 1; x < eventDetails.length; x++) {
                    if(eventDetails[i-x] != '') {
                        dateRange.value = dateRangeValue[i-x];
                        dateFunctions[i-x]();
                        localStorage.setItem('dateRangeValue', dateRange.value);                /*to remember the local storage values when pressing back*/
                        localStorage.setItem('date',i-x);
                        detailedText.innerHTML = eventDetails[i-x];
                        newDiv.setAttribute('id','selected-event');
                        marker.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center',
                        });

                        console.log(startingDate);
                        console.log(dateRange.value);
                        if(dateRange.value == startingDate+1) {                                                                                                                    /*'dateRange.value' are aici valoarea anterioara apasarii butonului, deci va fi egala cu pozitia actuala - 1, cea ce o face egala cu valoare din starting date*/ 
                            returnButoon.setAttribute('disabled','true');
                            console.log('return disabled');
                        }else{
                            returnButoon.removeAttribute('disabled');
                            console.log('return not disabled');  
                        }

                        if(eventDetails[i-x] == eventDetails[0]) {
                            console.log('this is the first one');
                            previousEventButton.setAttribute('disabled','true');
                        }
                        return;
                    }       
                }
            }
        }     
      };

      this.returnButtonEvent = function() {
        if(newDiv.id){
            dayDropdown.style.display = 'none';                                                 /*restore date text and hide dropdowns*/
            monthDropdown.style.display = 'none';
            yearDropdown.style.display = 'none';
            dateDay.style.display = 'inline-block';                                             
            dateMonth.style.display = 'inline-block';
            dateYear.style.display = 'inline-block';

            dateRange.value = dateRangeValue[startingDate];
            dateFunctions[startingDate]();
            localStorage.setItem('dateRangeValue',startingDate+1);                /*to remember the local storage values when pressing revert*/
            localStorage.setItem('date',startingDate);
            detailedText.innerHTML = eventDetails[startingDate];
            newDiv.setAttribute('id','selected-event');
            marker.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
            returnButoon.setAttribute('disabled','true');
            startingDate = -1;
            
            if(dateRange.value != eventSummaries.length){                                             /*daca revine la ultimul eveniment al marker-ului sa nu mai exista optiunea de a avansa*/
            nextEventButton.removeAttribute('disabled');                  
            } else {
            nextEventButton.setAttribute('disabled', 'true');
            }
            if(dateRange.value == 1){                                                                 /*daca revine la data 1 sa se dezactiveze optiunea navigarii catre un eveniment anterior*/
            previousEventButton.setAttribute('disabled','true');
            }
        };  
      };
    }  
};

let yeseiEventSummaries = ['Yesei is in Aonia.','Yesei went for a Safari in Aelian.','Yesei is visiting one of his relatives in Alcaleis',
                           'Yesei date 4 summary.','Yesei date 5 summary.','Yesei date 6 summary.','Yesei date 7 summary.','Yesei date 8 summary.','Yesei date 9 summary.','Yesei date 10 summary.'];
let yeseiEventDetails = ['Yesei is in Aonia dreaming about faraway lands and exotic creatures.',
                         'Yesei traveled to Aelian to take a look at the local dinosaurs. He finds them truly majestic and he is thinking to bring one back home as a pet.',
                         'After finding the perfect dino-pet he decided to show it to one of his relatives living in Alcaleis. She wonders at the sight of the never seen before creature.',
                         'Yesei date 4 details.','Yesi date 5 details.','Yesi date 6 details.','Yesi date 7 details.','Yesi date 8 details.','Yesi date 9 details.','Yesei date 10 details.'];
let yesei = new character('Yesei',document.getElementById('yesei-marker'),yeseiEventSummaries,yeseiEventDetails);
let earlshadeEventSummaries = ['Earlshade is in Vaarya.','Earlshade gains political power in a minor kingdom in Iviej.','Earlshade is streghtening ties with his new allies in Sellaris.',
                               'Earlshade 4 date summary.','','','Earlshade date  7 summary.','Earlshade date 8 summary.','Earlshade date 9 summary.','Earlshade date 10 summary.'];
let earlshadeEventDetails = ['Earlshade is in Vaarya feeling as abitious as ever.',
                             'Earlshade heard about the political instability of a certain kingdom in Iviej. This is certanly a good optunity and a stepping stone for his future plans. With the help of a misterious individual from Sellaris he manages to put in power the faction that will be more loyal to him.',
                             'Earlshade traveled to Sellaris to meet the conections of his new ally. He thinks they will prove instrumental in the bigger pictures but realizes they could double-cross him at anytime. He knows their kind the best, he world do the same at without thinking tewice.',
                             'Earlshade date 4 details.','','','Earlshade date 7 details.','Earlshade date 8 details.','Earlshade date 9 details.','Earlshade date 10 details.'];
let earlshade = new character('Earlshade',document.getElementById('earlshade-marker'),earlshadeEventSummaries,earlshadeEventDetails);
let erisaEventSummaries = ['Erisa is exploring Aelian.','','Erisa collects her pay in Asenka.',
                           '','','','Erisa date 7 summary.','Erisa date 8 summary.','',''];
let erisaEventDetails = ['Erisa is part of an expedition in Aelian. Unknown tribes in the jungle, artifacts of old civilizations, all kinds of unknown alchemical ingredients. These lands have it all.','',
                         'Erisa and the expedition group return with their finidings to the contractors of the expedition in Asenka. The pay is nothing to wite home aboyt, but for her it is the feeling of adventure that makes it worth',
                         '','','','Erisa date 7 details.','Erisa date 8 details.','',''];
let erisa = new character('Erisa',document.getElementById('erisa-marker'),erisaEventSummaries,erisaEventDetails);
let nauseEventSummaries = ['Nause is in Asenka.','Nause is leading a diplomatic mission in Kreea.','Nause returned to Asenka.',
                           '','','','','Nause date 8 summary.','Nause date 9 summary.','Nause date 10 summary.'];
let nauseEventDetails = ['Nause is the wife of the great orc cheftain of Asenka.',
                         'Nause is leading the mission in the hope of streghtening the ties with old enemies. She is very dedicated and compentent in state matters. Her efforts are a succes, the disscusions with the kreean officials are promissing.',
                         'Nause returns to her husband. Their time togheter is offten brief so she is sure to enjoy these moments. Who knows what the future holds. But if anything were to happen to the cheftain she is ready to continue his legacy',
                          '','','','','Nause date 8 details.','Nause date 9 details.','Nause date 10 details.'];
let nause = new character('Nause',document.getElementById('nause-marker'),nauseEventSummaries,nauseEventDetails);
let orrorEventSummaries = ['Orror is in Kreea.','Orror settles in Edbrei.','',
                           '','','','','','',''];
let orrorEventDetails = ['Orror has fought in countless battles. He is a decoated veteran and is really getting tired of fighting.',
                         'Orror travels in Edbrei in the search of a more peacefull live. He buys the farm that will become his home for the rest of his life.','',
                         '','','','','','',''];
let orror = new character('Orror',document.getElementById('orror-marker'),orrorEventSummaries,orrorEventDetails);
let weiEventSummaries = ['Wei is in Eeng.','Wei runs to Rheall.','Wei tries to become an artist in Aonia.',
                         '','Wei date 5 summary.','','Wei date 7 summary.','','Wei date 9 summary.',''];
let weiEventDetails = ['Wei is bored of the rigid life of a noblewomman of Eeng. She is especially bored with all the art classes.',
                       'Wei leaves her home behind and travells to Rheall in hope of a new life. She wants to reach Aonia but is low on money so she uses education to perform in the streets. She is free to improvise, sing and dance in any way she sees fit, free from the artistic concentions of her homeland. People seem to enjoy it too and she gains the missing funds in no time.',
                       'Wei reaches Aonia and is planing to become an art performer here after her succes in Rheall. She thought she will abandon her old life compltely, but now she feels like she wants to reconcile the old and the new.',
                        '','Wei date 5 details','','Wei date 7 details','','Wei date 9 details'];
let wei = new character('Wei',document.getElementById('wei-marker'),weiEventSummaries,weiEventDetails);
let nadirEventSummaries = ['Nadir is in Rheall.','','Nadir is searching for new hairstyles in Eriol.',
                           '','','','','','Nadir date 9 summary.','Nadir date 10 summary.'];
let nadirEventDetails = ['Nadir is an eccentric mage. He always had an interest in unconventional haircuts.','','Nadir decided learn a few things from the barbers of Eriol. He hard about thir reputation and is definetly not dissapointed after he witnesses the real deal. His brothers back home should get their heads ready for all his new ideas.',
                         '','','','','','Nadir date 9 details','Nadir date 10 details'];
let nadir = new character('Nadir',document.getElementById('nadir-marker'),nadirEventSummaries,nadirEventDetails);

/*date slider and event list*/

let yeseiEvent = function() {
    yesei.selectMarkerEvent();
    nextEventButton.addEventListener('click',yesei.forrwardButtonEvent);
    previousEventButton.addEventListener('click',yesei.previousButtonEvent);
    returnButoon.addEventListener('click',yesei.returnButtonEvent);
    
    /*alternate code for no multiple events running
    let removeEvent = function(){
            returnButoon.removeEventListener('click',yesei.returnButtonEvent);
        }
    returnButoon.addEventListener('click',function(){
        setTimeout(removeEvent,100);
    });
    */
};
let earlshadeEvent = function() {
    earlshade.selectMarkerEvent();
    nextEventButton.addEventListener('click',earlshade.forrwardButtonEvent);
    previousEventButton.addEventListener('click',earlshade.previousButtonEvent);
    returnButoon.addEventListener('click',earlshade.returnButtonEvent);
};
let erisaEvent = function() {
    erisa.selectMarkerEvent();
    nextEventButton.addEventListener('click',erisa.forrwardButtonEvent);
    previousEventButton.addEventListener('click',erisa.previousButtonEvent);
    returnButoon.addEventListener('click',erisa.returnButtonEvent);
};
let nauseEvent = function() {
    nause.selectMarkerEvent();
    nextEventButton.addEventListener('click',nause.forrwardButtonEvent);
    previousEventButton.addEventListener('click',nause.previousButtonEvent);
    returnButoon.addEventListener('click',nause.returnButtonEvent);
};
let orrorEvent = function() {
    orror.selectMarkerEvent();
    nextEventButton.addEventListener('click',orror.forrwardButtonEvent);
    previousEventButton.addEventListener('click',orror.previousButtonEvent);
    returnButoon.addEventListener('click',orror.returnButtonEvent);
};
let weiEvent = function() {
    wei.selectMarkerEvent();
    nextEventButton.addEventListener('click',wei.forrwardButtonEvent);
    previousEventButton.addEventListener('click',wei.previousButtonEvent);
    returnButoon.addEventListener('click',wei.returnButtonEvent);
};
let nadirEvent = function() {
    nadir.selectMarkerEvent();
    nextEventButton.addEventListener('click',nadir.forrwardButtonEvent);
    previousEventButton.addEventListener('click',nadir.previousButtonEvent);
    returnButoon.addEventListener('click',nadir.returnButtonEvent);
};
let eventsArray = [yeseiEvent, earlshadeEvent, erisaEvent, nauseEvent, orrorEvent, weiEvent, nadirEvent];

class timelineDate {                         
  constructor(day,month,year,dateRangeValue,yeseiMarkerLeft,yeseiMarkerTop,earlshadeMarkerLeft,earlshadeMarkerTop,erisaMarkerLeft,erisaMarkerTop,nauseMarkerLeft,nauseMarkerTop,orrorMarkerLeft,orrorMarkerTop,weiMarkerLeft,weiMarkerTop,nadirMarkerLeft,nadirMarkerTop, eventSummariesIndex) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.dateRangeValue = dateRangeValue;

    this.displayDateContent = function() {
        dateDay.innerHTML = day;
        dateMonth.innerHTML = month;
        dateYear.innerHTML = year;

        yesei.marker.style.left = yeseiMarkerLeft;
        yesei.marker.style.top = yeseiMarkerTop;
        earlshade.marker.style.left = earlshadeMarkerLeft;
        earlshade.marker.style.top = earlshadeMarkerTop;
        erisa.marker.style.left = erisaMarkerLeft;
        erisa.marker.style.top = erisaMarkerTop;
        nause.marker.style.left = nauseMarkerLeft;
        nause.marker.style.top = nauseMarkerTop;
        orror.marker.style.left = orrorMarkerLeft;
        orror.marker.style.top = orrorMarkerTop;
        wei.marker.style.left = weiMarkerLeft;
        wei.marker.style.top = weiMarkerTop;
        nadir.marker.style.left = nadirMarkerLeft;
        nadir.marker.style.top = nadirMarkerTop;

        let listEntries = eventsList.childNodes;
        listEntries.forEach(function(entry){
            entry.removeAttribute('id');
        });
        eventsList.innerHTML = '';

        yesei.eventListEntry.innerHTML = yesei.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(yesei.eventListEntry);
        yesei.eventListEntry.addEventListener('click',yeseiEvent);
        earlshade.eventListEntry.innerHTML = earlshade.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(earlshade.eventListEntry);
        earlshade.eventListEntry.addEventListener('click',earlshadeEvent);
        erisa.eventListEntry.innerHTML = erisa.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(erisa.eventListEntry);
        erisa.eventListEntry.addEventListener('click',erisaEvent);      
        nause.eventListEntry.innerHTML = nause.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(nause.eventListEntry);
        nause.eventListEntry.addEventListener('click',nauseEvent);      
        orror.eventListEntry.innerHTML = orror.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(orror.eventListEntry);
        orror.eventListEntry.addEventListener('click',orrorEvent);      
        wei.eventListEntry.innerHTML = wei.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(wei.eventListEntry);
        wei.eventListEntry.addEventListener('click',weiEvent);       
        nadir.eventListEntry.innerHTML = nadir.eventSummaries[eventSummariesIndex];
        eventsList.appendChild(nadir.eventListEntry);
        nadir.eventListEntry.addEventListener('click',nadirEvent);       
        detailedText.innerHTML = '';
        jumpToEventButton.style.display = 'none';
        previousEventButton.style.display = 'inline-block';
        nextEventButton.style.display = 'inline-block';
        returnButoon.style.display = 'inline-block';
    }
  }
}

const date1 = new timelineDate(21,'May',4001,1, /*yesei*/'58%','26%', /*earlshade*/'67%','18%', /*erisa*/'67%','52%', /*nause*/'85%','38%', /*orror*/ '87%','17%', /*wei*/ '51%','39%', /*nadir*/ '57%','20%',0);
const date2 = new timelineDate(5,'June',4001,2, /*yesei*/'78%','78%', /*earlshade*/'52%','5%', /*erisa*/'67%','52%', /*nause*/'86%','33%', /*orror*/ '88%','13%', /*wei*/ '55%','20%', /*nadir*/ '57%','20%',1);
const date3 = new timelineDate(19,'June',4001,3, /*yesei*/'30%','39%', /*earlshade*/'46%','4%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '55%','9%', /*nadir*/ '27%','9%',2);
const date4 = new timelineDate(25,'October',4001,4, /*yesei*/'36%','46%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '55%','9%', /*nadir*/ '27%','9%',3);
const date5 = new timelineDate(1,'January',4002,5, /*yesei*/'55%','39%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '59%','10%', /*nadir*/ '27%','9%',4);
const date6 = new timelineDate(13,'March',4002,6, /*yesei*/'55%','39%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '59%','10%', /*nadir*/ '27%','9%',5);
const date7 = new timelineDate(23,'July',4002,7, /*yesei*/'55%','39%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '59%','10%', /*nadir*/ '27%','9%',6);
const date8 = new timelineDate(10,'November',4002,8, /*yesei*/'55%','39%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '59%','10%', /*nadir*/ '27%','9%',7);
const date9 = new timelineDate(11,'February',4003,9, /*yesei*/'55%','39%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '59%','10%', /*nadir*/ '27%','9%',8);
const date10 = new timelineDate(31,'April',4003,10, /*yesei*/'55%','39%', /*earlshade*/'51%','5%', /*erisa*/'83%','55%', /*nause*/'85%','38%', /*orror*/ '88%','13%', /*wei*/ '59%','10%', /*nadir*/ '27%','9%',9);

let year4001Dates = [date1,date2,date3,date4];
let year4002Dates = [date5,date6,date7,date8];
let year4003Dates = [date9,date10];
let allYears = {'4001': year4001Dates, '4002': year4002Dates, '4003': year4003Dates};
let currentYear = allYears[yearDropdown.value];                                        /*variable holds the array with all the dates from the selected year*/

let displayDate1 = function() {
    date1.displayDateContent();
};
displayDate1();

let displayDate2 = function() {
    date2.displayDateContent();
};
let displayDate3 = function() {
    date3.displayDateContent();
};
let displayDate4 = function() {
   date4.displayDateContent();
};
let displayDate5 = function() {
   date5.displayDateContent();
};
let displayDate6 = function() {
    date6.displayDateContent();
};
let displayDate7 = function() {
    date7.displayDateContent();
};
let displayDate8 = function() {
    date8.displayDateContent();
};
let displayDate9 = function() {
    date9.displayDateContent();
};
let displayDate10 = function() {
    date10.displayDateContent();
};
let dateFunctions = [displayDate1,displayDate2,displayDate3,displayDate4,displayDate5,displayDate6,displayDate7,displayDate8,displayDate9,displayDate10];

/*load from local storage*/

let savedRangeValue = localStorage.getItem('dateRangeValue');                         /*when page is open it will move date range to the stored value*/
dateRange.value = savedRangeValue;
let storedDateFunction = localStorage.getItem('date');                                /*and run the coresponding date funtion*/
dateFunctions[storedDateFunction]();

markerId = localStorage.getItem('marker');                                            /*retrive id of last selected marker on page load*/
let idToArray = markerId.split('-');                                            /*find the coresponding selectMarker funtion and run it*/
extractedName = idToArray[0];
for (x in eventsArray) {                                                       
    if (eventsArray[x].name.includes(extractedName)) {
        eventsArray[x]();
    }
} 

function zoomIn() {
    console.log('zoom-zoom');

    let map = document.getElementById('map');
    let markers = document.getElementsByClassName('marker');
    mapZoom = mapZoom + 10;
    if(markerZoom > 50) { 
      markerZoom = markerZoom - 5;
    }
    map.style.zoom = mapZoom + '%';
    for (i = 0; i < markers.length; i++) {
        markers[i].style.zoom = markerZoom + '%';
    }
};
function zoomOut() {
    console.log('downscale');
    
    let map = document.getElementById('map');
    let markers = document.getElementsByClassName('marker');
    mapZoom = mapZoom - 10;
    if(mapZoom < 210) { 
        markerZoom = markerZoom + 5;
    }
    map.style.zoom = mapZoom + '%';
    for (i = 0; i < markers.length; i++) {
        markers[i].style.zoom = markerZoom + '%';
    }
 }
zoomInButton.addEventListener('click', zoomIn);
zoomOutButton.addEventListener('click', zoomOut);

/*continuous zoom while holding button*/

zoomInButton.addEventListener('mousedown', function(){
    interval = setInterval(zoomIn, 200);
});
zoomOutButton.addEventListener('mousedown', function(){
    interval = setInterval(zoomOut, 200);
});
zoomInButton.addEventListener('mouseup', function(){
    clearInterval(interval);
});
zoomOutButton.addEventListener('mouseup', function(){
    clearInterval(interval);
});

/*1.marker search*/

searchButton.addEventListener('click',function() {
   let listEntries = eventsList.childNodes;                                                                 /*pentru a reseta elementul deja selectat de o selectie anterioara atunci cand cautam un marker ce nu are detalii in data curenta*/
    listEntries.forEach(function(entry){
      entry.removeAttribute('id');
    });
    detailedText.innerText = "";
    nextEventButton.setAttribute('disabled','true');
    previousEventButton.setAttribute('disabled','true');

   let caseInsensitive = searchMarkerInput.value.toUpperCase();
   for (x in markerData) { 
     if (markerData[x].innerText == caseInsensitive) {
        markerId = markerData[x].id;
        let idToArray = markerId.split('-');
        extractedName = idToArray[0];
        for (x in eventsArray) {
        if (eventsArray[x].name.includes(extractedName)) {
            eventsArray[x]();
            }
        } 
     }
    }
});

/*1.1.search by pressing enter*/

searchMarkerInput.addEventListener('change',function() {
   let listEntries = eventsList.childNodes;                                              /*pentru a reseta elementul deja selectat de o selectie anterioara atunci cand cautam un marker ce nu are detalii in data curenta*/
    listEntries.forEach(function(entry){
      entry.removeAttribute('id');
    });
    detailedText.innerText = "";
    nextEventButton.setAttribute('disabled','true');
    previousEventButton.setAttribute('disabled','true');

   let caseInsensitive = searchMarkerInput.value.toUpperCase();
   for (x in markerData) { 
     if (markerData[x].innerText == caseInsensitive) {
        markerId = markerData[x].id;
        let idToArray = markerId.split('-');                                             /*luam numele marker-ului din id-ul selectat*/
        extractedName = idToArray[0];
        for (x in eventsArray) {                                                         /*verificam daca numele din id se regaseste si in numele functilor de selectare a evenimentului curent pentru personajul selectat pentru a rula functia corespunzatoare*/
        if (eventsArray[x].name.includes(extractedName)) {
            eventsArray[x]();
            }
        }       
     }
    } 
});

jumpToEventButton.addEventListener('click', function(){ 
    dateFunctions[jumpTarget]();                                                         /*mergem la data corespunzatoare ultimului eveniment disponibil*/
    dateRange.value = jumpTarget + 1;                                                    /*are nevoie de actualizare separata*/
    for (x in eventsArray) {                                                             /*rulam din nou marker selection corespunzataore*/
        if (eventsArray[x].name.includes(extractedName)) {
            eventsArray[x]();
        }
    }  
    jumpToEventButton.style.display = 'none';
    previousEventButton.style.display = 'inline-block';
    nextEventButton.style.display = 'inline-block';
    returnButoon.style.display = 'inline-block';
    localStorage.setItem('dateRangeValue', dateRange.value);                           /*to remember the local storage values when pressing forrward*/
    localStorage.setItem('date',jumpTarget);

    dayDropdown.style.display = 'none';                                                 /*restore date text and hide dropdowns*/
    monthDropdown.style.display = 'none';
    yearDropdown.style.display = 'none';       
    dateDay.style.display = 'inline-block';                                             
    dateMonth.style.display = 'inline-block';
    dateYear.style.display = 'inline-block';
});

/*select marker by clicking it on map*/

for (i = 0; i< markerData.length; i++) {                                                /*for every marker on map...*/
    let markerId = markerData[i].id;                                                    /*we grab the id*/
    markerData[i].addEventListener('click', function(){
        console.log('Click!!!');
        console.log(markerId); 

        let idToArray = markerId.split('-');                                            /*we extract the markers name*/
        extractedName = idToArray[0];
        for (x in eventsArray) {                                                        /*and we add the corresponding selection event to the markers*/  
            if (eventsArray[x].name.includes(extractedName)) {
                eventsArray[x]();
                }
        } 
    })
}

/*date range*/

dateRange.addEventListener('change', function() {                                       /*cand schimbam data manual activam functia corespunzatoare si dezactivam toate optiunile ce trebuie sa apara doar la selecatrea unui personaj*/
    dayDropdown.style.display = 'none';                                                 /*restore date text and hide dropdowns*/
    monthDropdown.style.display = 'none';
    yearDropdown.style.display = 'none';
    
    dateDay.style.display = 'inline-block';                                             
    dateMonth.style.display = 'inline-block';
    dateYear.style.display = 'inline-block';

    if(dateRange.value == 1) {
        displayDate1();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',0);                                                /*stores a number corespondig to the position of the displayDate function in the array 'date functions'*/
    }
    if(dateRange.value == 2) {
        displayDate2();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');   
       localStorage.setItem('date',1);
    }
    if(dateRange.value == 3) {
        displayDate3();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',2);
    }
    if(dateRange.value == 4) {
        displayDate4();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',3);
    }
    if(dateRange.value == 5) {
        displayDate5();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',4);
    }
    if(dateRange.value == 6) {
        displayDate6();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',5);
    }
    if(dateRange.value == 7) {
        displayDate7();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',6);
    }
    if(dateRange.value == 8) {
        displayDate8();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',7);
    }
    if(dateRange.value == 9) {
        displayDate9();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',8);
    }
    if(dateRange.value == 10) {
        displayDate10();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
        localStorage.setItem('date',9);
    }
    localStorage.setItem('dateRangeValue', dateRange.value);                           /*store the value of the date range in the local storage*/
    startingDate = -1;
});

/*change date*/

changeDateButton.addEventListener('click', function() {
    if (dateEditActive == 0) {                                                             /*if Edit was not alredy pressed*/
        dateDay.style.display = 'none';                                                   /*hides original date text...*/
        dateMonth.style.display = 'none';
        dateYear.style.display = 'none';
        dayDropdown.style.display = 'inline-block';                                       /*...replaces it with coresponding dropdown menus*/
        monthDropdown.style.display = 'inline-block';
        yearDropdown.style.display = 'inline-block';
        dayDropdown.value = dateDay.innerText;                                            /*the selected values in the dropdowns will be the values of the initial date text*/
        monthDropdown.value = dateMonth.innerText;
        yearDropdown.value = dateYear.innerText;       
        monthLoop();
        dayLoop(); 
        dateEditActive = 1;
    } else {
        dayDropdown.style.display = 'none';                                                 /*restore date text and hide dropdowns*/
        monthDropdown.style.display = 'none';
        yearDropdown.style.display = 'none';       
        dateDay.style.display = 'inline-block';                                             
        dateMonth.style.display = 'inline-block';
        dateYear.style.display = 'inline-block';
        dateEditActive = 0;
    }
})
yearDropdown.addEventListener('change', function() {
    currentYear = allYears[yearDropdown.value];                                        /*keep only dates from selected year*/
    selectedMonthDates = [];                                                           /*empty previously added dates*/
    monthDropdown.value = currentYear[0].month;                                        /*show the first date from that year*/
    dayDropdown.value = currentYear[0].day;
    currentYear[0].displayDateContent();
    dateRange.value = currentYear[0].dateRangeValue;
    monthLoop();
    dayLoop();

    nextEventButton.setAttribute('disabled','true');
    previousEventButton.setAttribute('disabled','true');
    returnButoon.setAttribute('disabled','true');
    localStorage.setItem('date',dateRange.value-1);
    localStorage.setItem('dateRangeValue', dateRange.value);
})
monthDropdown.addEventListener('change', function(){   
    selectedMonthDates = [];                                                       /*will hold only dates with the selected month*/  
    for (i = 0; i < currentYear.length; i++) {                                     /*loop trogh selected year dates*/
        if (currentYear[i].month == monthDropdown.value) {                         /*find only the dates with the selected month*/
            selectedMonthDates.push(currentYear[i]);                               /*add to the prepeared array*/
        }
    }
    dayLoop();
    for (i = 0; i < currentYear.length; i++) {                                       /*loop selected year dates*/
        if (monthDropdown.value == currentYear[i].month) {                           /*find the first one that has the selected month*/
            dayDropdown.value = currentYear[i].day;                                   /*select its day*/         
            currentYear[i].displayDateContent();                                     /*display content of selected date*/
            dateRange.value = currentYear[i].dateRangeValue;

            nextEventButton.setAttribute('disabled','true');
            previousEventButton.setAttribute('disabled','true');
            returnButoon.setAttribute('disabled','true');
            localStorage.setItem('date',dateRange.value-1);
            localStorage.setItem('dateRangeValue', dateRange.value);           

           return;                                                                   /*stop searching to keep first option*/
        }
    }     
})
dayDropdown.addEventListener('change', function(){
    for (i = 0; i < currentYear.length; i++) {                                       /*loop selected year dates*/
        if (dayDropdown.value == currentYear[i].day) {                               /*find the one that has the selected day*/                     
            currentYear[i].displayDateContent();                                     /*display content of selected date*/
            dateRange.value = currentYear[i].dateRangeValue;                                                                  
        }
    }  
    nextEventButton.setAttribute('disabled','true');
    previousEventButton.setAttribute('disabled','true');
    returnButoon.setAttribute('disabled','true');
    localStorage.setItem('date',dateRange.value-1);
    localStorage.setItem('dateRangeValue', dateRange.value);
})




/*LAST UPDATES:
1. Made no marker details disapar when pressing a event in the list
2. Added local storage to save date and selected event
*/