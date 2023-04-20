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
let dateRangeValue = [1,2,3];
let dateTexts = ["Date 1","Date 2","Date 3"];
let startingDate = -1;
let noEvent = document.createElement('div');                                                   /*elementul in care va aprea mesajul atunci cand un marker cautat nu are eveniment pentru data curenta*/

let dateRange = document.getElementById('date-range');
let date = document.getElementById('date');
let details = document.getElementById('event-details');

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
        marker.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            })

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
                    noEvent.innerHTML = name + ' has no event on ' + date.innerHTML + '<br />' + 'Previous event is on ' + dateTexts[previousEventPosition] ;    
                    detailedText.innerHTML = '<strong>' + 'From ' + dateTexts[previousEventPosition] + ':' + '</strong>' + '<br />' + '<strong><em>' + eventSummaries[previousEventPosition] + '</strong></em>' + '<br />' + '<em>' + eventDetails[previousEventPosition] + '</em>';
                    jumpTarget = previousEventPosition;                                                                                                                                                                                   /*stocam pozitia evenimentului corespunzator*/             
                    return;                                                                                                                                                                                                                                                                                                                                               
                }
            }/*aici o sa fie nevoie de un else pentru cazul in care cautam inainte de primul eveniment  existent*/
         }
        }; 
      
      this.forrwardButtonEvent = function() {
        returnButoon.removeAttribute('disabled');
        previousEventButton.removeAttribute('disabled');
        if (startingDate == -1) {
            startingDate = dateRange.value-1;
        };
        if(dateRange.value == startingDate) {                                                                                                                    /*'dateRange.value' are aici valoarea anterioara apasarii butonului, deci va fi egala cu pozitia actuala - 1, cea ce o face egala cu valoare din starting date*/ 
            returnButoon.setAttribute('disabled','true');
        }
        for (let i = 0; i < eventSummaries.length; i++) {
            if(detailedText.innerHTML == eventDetails[i]) {
                for( let x = 1; x < eventDetails.length; x++) {  
                    if(eventDetails[i+x] != '') {
                        dateRange.value = dateRangeValue[i+x];
                        dateFunctions[i+x]();
                        console.log('second event runed');
                        
                        detailedText.innerHTML = eventDetails[i+x];
                        newDiv.setAttribute('id','selected-event');
                        marker.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center',
                        });
                        if(eventDetails[i+x] == eventDetails[eventDetails.length-1]) {
                            console.log('This is the last one');
                            nextEventButton.setAttribute('disabled','true');
                        }        
                        let positionToCheckFrom = i+x+1;                                                             
                        for(positionToCheckFrom; positionToCheckFrom < eventDetails.length; positionToCheckFrom++) {       /*verificam daca exista text pentru pozitile urmatoare; daca toate sunt goale dezactivam 'nextEventButton'*/
                            if (eventDetails[positionToCheckFrom] != '') {
                                console.log('Nu e ultimul');
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
        returnButoon.removeAttribute('disabled');
        nextEventButton.removeAttribute('disabled');
        if(startingDate == -1) {
            startingDate = dateRange.value-1;
        };
        console.log(startingDate);
        console.log(dateRange.value);
        if(dateRange.value == startingDate + 2) {                                                                                                                      /*'dateRange.value' are aici valoarea anterioara apasarii butonului, deci va fi egala cu pozitia actuala + 1, rezulta + 2 fata de 'startingDate*/                                                                       
            returnButoon.setAttribute('disabled','true');
        }
        for (let i = 0; i < eventSummaries.length; i++) {
            if(detailedText.innerHTML == eventDetails[i]) {
                for(let x = 1; x < eventDetails.length; x++) {
                    if(eventDetails[i-x] != '') {
                        dateRange.value = dateRangeValue[i-x];
                        dateFunctions[i-x]();
                        detailedText.innerHTML = eventDetails[i-x];
                        newDiv.setAttribute('id','selected-event');
                        marker.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center',
                        });
                        if(eventDetails[i+x] == eventDetails[0]) {
                            console.log('this is the first one');
                            previousEventButoon.setAttribute('disabled','true');
                        }
                        return;
                    }       
                }
            }
        }     
      };

      this.returnButtonEvent = function() {
        if(newDiv.id){
            dateRange.value = dateRangeValue[startingDate];
            dateFunctions[startingDate]();
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
            if(dateRange.value != 1){                                                                 /*daca revine la data 1 sa se dezactiveze optiunea navigarii catre un eveniment anterior*/
            previousEventButton.removeAttribute('disabled');
            }
        };  
      };
    }  
};

let yeseiEventSummaries = ['Yesei is in Aonia.','Yesei went for a Safari in Aelian.','Yesei is visiting one of his relatives in Alcaleis'];
let yeseiEventDetails = ['Yesei is in Aonia dreaming about faraway lands and exotic creatures.',
                         'Yesei traveled to Aelian to take a look at the local dinosaurs. He finds them truly majestic and he is thinking to bring one back home as a pet.',
                         'After finding the perfect dino-pet he decided to show it to one of his relatives living in Alcaleis. She wonders at the sight of the never seen before creature.'];
let yesei = new character('Yesei',document.getElementById('yesei-marker'),yeseiEventSummaries,yeseiEventDetails);
let earlshadeEventSummaries = ['Earlshade is in Vaarya.','Earlshade gains political power in a minor kingdom in Iviej.','Earlshade is streghtening ties with his new allies in Sellaris.'];
let earlshadeEventDetails = ['Earlshade is in Vaarya feeling as abitious as ever.',
                             'Earlshade heard about the political instability of a certain kingdom in Iviej. This is certanly a good optunity and a stepping stone for his future plans. With the help of a misterious individual from Sellaris he manages to put in power the faction that will be more loyal to him.',
                             'Earlshade traveled to Sellaris to meet the conections of his new ally. He thinks they will prove instrumental in the bigger pictures but realizes they could double-cross him at anytime. He knows their kind the best, he world do the same at without thinking tewice.'];
let earlshade = new character('Earlshade',document.getElementById('earlshade-marker'),earlshadeEventSummaries,earlshadeEventDetails);
let erisaEventSummaries = ['Erisa is exploring Aelian.','','Erisa collects her pay in Asenka.'];
let erisaEventDetails = ['Erisa is part of an expedition in Aelian. Unknown tribes in the jungle, artifacts of old civilizations, all kinds of unknown alchemical ingredients. These lands have it all.','',
                         'Erisa and the expedition group return with their finidings to the contractors of the expedition in Asenka. The pay is nothing to wite home aboyt, but for her it is the feeling of adventure that makes it worth'];
let erisa = new character('Erisa',document.getElementById('erisa-marker'),erisaEventSummaries,erisaEventDetails);
let nauseEventSummaries = ['Nause is in Asenka.','Nause is leading a diplomatic mission in Kreea.','Nause returned to Asenka.'];
let nauseEventDetails = ['Nause is the wife of the great orc cheftain of Asenka.',
                         'Nause is leading the mission in the hope of streghtening the ties with old enemies. She is very dedicated and compentent in state matters. Her efforts are a succes, the disscusions with the kreean officials are promissing.',
                         'Nause returns to her husband. Their time togheter is offten brief so she is sure to enjoy these moments. Who knows what the future holds. But if anything were to happen to the cheftain she is ready to continue his legacy'];
let nause = new character('Nause',document.getElementById('nause-marker'),nauseEventSummaries,nauseEventDetails);
let orrorEventSummaries = ['Orror is in Kreea.','Orror settles in Edbrei.',''];
let orrorEventDetails = ['Orror has fought in countless battles. He is a decoated veteran and is really getting tired of fighting.',
                         'Orror travels in Edbrei in the search of a more peacefull live. He buys the farm that will become his home for the rest of his life.',''];
let orror = new character('Orror',document.getElementById('orror-marker'),orrorEventSummaries,orrorEventDetails);
let weiEventSummaries = ['Wei is in Eeng.','Wei runs to Rheall.','Wei tries to become an artist in Aonia.'];
let weiEventDetails = ['Wei is bored of the rigid life of a noblewomman of Eeng. She is especially bored with all the art classes.',
                       'Wei leaves her home behind and travells to Rheall in hope of a new life. She wants to reach Aonia but is low on money so she uses education to perform in the streets. She is free to improvise, sing and dance in any way she sees fit, free from the artistic concentions of her homeland. People seem to enjoy it too and she gains the missing funds in no time.',
                       'Wei reaches Aonia and is planing to become an art performer here after her succes in Rheall. She thought she will abandon her old life compltely, but now she feels like she wants to reconcile the old and the new.'];
let wei = new character('Wei',document.getElementById('wei-marker'),weiEventSummaries,weiEventDetails);
let nadirEventSummaries = ['Nadir is in Rheall.','','Nadir is searching for new hairstyles in Eriol.'];
let nadirEventDetails = ['Nadir is an eccentric mage. He always had an interest in unconventional haircuts.','','Nadir decided learn a few things from the barbers of Eriol. He hard about thir reputation and is definetly not dissapointed after he witnesses the real deal. His brothers back home should get their heads ready for all his new ideas.'];
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

let displayDate1 = function() {
    date.innerHTML = 'Date 1';
    yesei.marker.style.left = '58%';
    yesei.marker.style.top = '26%';

    earlshade.marker.style.left = '67%';
    earlshade.marker.style.top = '18%';
    erisa.marker.style.left = '67%';
    erisa.marker.style.top = '52%';
    nause.marker.style.left = '85%';
    nause.marker.style.top = '38%';
    orror.marker.style.left = '87%';
    orror.marker.style.top = '17%';
    wei.marker.style.left = '51%';
    wei.marker.style.top = '39%';
    nadir.marker.style.left = '58%';
    nadir.marker.style.top = '19%';

    let listEntries = eventsList.childNodes;
    listEntries.forEach(function(entry){
        entry.removeAttribute('id');
    });
    
    eventsList.innerHTML = '';
    yesei.eventListEntry.innerHTML = yesei.eventSummaries[0];
    eventsList.appendChild(yesei.eventListEntry);
    yesei.eventListEntry.addEventListener('click',yeseiEvent);
    
    earlshade.eventListEntry.innerHTML = earlshade.eventSummaries[0];
    eventsList.appendChild(earlshade.eventListEntry);
    earlshade.eventListEntry.addEventListener('click',earlshadeEvent);
    
    erisa.eventListEntry.innerHTML = erisa.eventSummaries[0];
    eventsList.appendChild(erisa.eventListEntry);
    erisa.eventListEntry.addEventListener('click',erisaEvent);
    
    nause.eventListEntry.innerHTML = nause.eventSummaries[0];
    eventsList.appendChild(nause.eventListEntry);
    nause.eventListEntry.addEventListener('click',nauseEvent);
    
    orror.eventListEntry.innerHTML = orror.eventSummaries[0];
    eventsList.appendChild(orror.eventListEntry);
    orror.eventListEntry.addEventListener('click',orrorEvent);
    
    wei.eventListEntry.innerHTML = wei.eventSummaries[0];
    eventsList.appendChild(wei.eventListEntry);
    wei.eventListEntry.addEventListener('click',weiEvent);
    
    nadir.eventListEntry.innerHTML = nadir.eventSummaries[0];
    eventsList.appendChild(nadir.eventListEntry);
    nadir.eventListEntry.addEventListener('click',nadirEvent);
    
    detailedText.innerHTML = '';
    previousEventButton.setAttribute('disabled','true');
    jumpToEventButton.style.display = 'none';
    previousEventButton.style.display = 'inline-block';
    nextEventButton.style.display = 'inline-block';
    returnButoon.style.display = 'inline-block';
};
displayDate1();

let displayDate2 = function() {
    date.innerHTML = 'Date 2';
    yesei.marker.style.left = '81%';
    yesei.marker.style.top = '78%';
    earlshade.marker.style.left = '52%';
    earlshade.marker.style.top = '5%';
    erisa.marker.style.left = '67%';
    erisa.marker.style.top = '52%';
    nause.marker.style.left = '91%';
    nause.marker.style.top = '33%';
    orror.marker.style.left = '94%';
    orror.marker.style.top = '13%';
    wei.marker.style.left = '55%';
    wei.marker.style.top = '20%';
    nadir.marker.style.left = '58%';
    nadir.marker.style.top = '19%';
    
    let listEntries = eventsList.childNodes;
    listEntries.forEach(function(entry){
        entry.removeAttribute('id');
    });

    eventsList.innerHTML = '';
    yesei.eventListEntry.innerHTML = yesei.eventSummaries[1];
    eventsList.appendChild(yesei.eventListEntry);
    yesei.eventListEntry.addEventListener('click',yeseiEvent);

    earlshade.eventListEntry.innerHTML = earlshade.eventSummaries[1];
    eventsList.appendChild(earlshade.eventListEntry);
    earlshade.eventListEntry.addEventListener('click',earlshadeEvent);
    
    nause.eventListEntry.innerHTML = nause.eventSummaries[1];
    eventsList.appendChild(nause.eventListEntry);
    nause.eventListEntry.addEventListener('click',nauseEvent);
    
    orror.eventListEntry.innerHTML = orror.eventSummaries[1];
    eventsList.appendChild(orror.eventListEntry);
    orror.eventListEntry.addEventListener('click',orrorEvent);
    
    wei.eventListEntry.innerHTML = wei.eventSummaries[1];
    eventsList.appendChild(wei.eventListEntry);
    wei.eventListEntry.addEventListener('click',weiEvent); 

    detailedText.innerHTML = '';
    jumpToEventButton.style.display = 'none';
    previousEventButton.style.display = 'inline-block';
    nextEventButton.style.display = 'inline-block';
    returnButoon.style.display = 'inline-block';
};

let displayDate3 = function() {
    date.innerHTML = 'Date 3';
    yesei.marker.style.left = '30%';
    yesei.marker.style.top = '39%';
    earlshade.marker.style.left = '46%';
    earlshade.marker.style.top = '4%';
    erisa.marker.style.left = '83%';
    erisa.marker.style.top = '55%';
    nause.marker.style.left = '85%';
    nause.marker.style.top = '38%';
    orror.marker.style.left = '94%';
    orror.marker.style.top = '13%';
    wei.marker.style.left = '55%';
    wei.marker.style.top = '11%';
    nadir.marker.style.left = '27%';
    nadir.marker.style.top = '9%';

    let listEntries = eventsList.childNodes;
    listEntries.forEach(function(entry){
      entry.removeAttribute('id');
    });

    eventsList.innerHTML = '';
    yesei.eventListEntry.innerHTML = yesei.eventSummaries[2];
    eventsList.appendChild(yesei.eventListEntry);
    yesei.eventListEntry.addEventListener('click',yeseiEvent);

    earlshade.eventListEntry.innerHTML = earlshade.eventSummaries[2];
    eventsList.appendChild(earlshade.eventListEntry);
    earlshade.eventListEntry.addEventListener('click',earlshadeEvent);
    
    nause.eventListEntry.innerHTML = nause.eventSummaries[2];
    eventsList.appendChild(nause.eventListEntry);
    nause.eventListEntry.addEventListener('click',nauseEvent);
    
    wei.eventListEntry.innerHTML = wei.eventSummaries[2];
    eventsList.appendChild(wei.eventListEntry);
    wei.eventListEntry.addEventListener('click',weiEvent);
    
    erisa.eventListEntry.innerHTML = erisa.eventSummaries[2];
    eventsList.appendChild(erisa.eventListEntry);
    erisa.eventListEntry.addEventListener('click',erisaEvent);

    nadir.eventListEntry.innerHTML = nadir.eventSummaries[2];
    eventsList.appendChild(nadir.eventListEntry);
    nadir.eventListEntry.addEventListener('click',nadirEvent);

    detailedText.innerHTML = '';
    jumpToEventButton.style.display = 'none';
    previousEventButton.style.display = 'inline-block';
    nextEventButton.style.display = 'inline-block';
    returnButoon.style.display = 'inline-block';
};
let dateFunctions = [displayDate1,displayDate2,displayDate3];

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
    noEvent.innerHTML = "";

   let markerId = '';
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
    noEvent.innerHTML = "";

   let markerId = '';
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
    dateRange.value = dateRange.value-1;                                                 /*are nevoie de actualizare separata*/
    for (x in eventsArray) {                                                             /*rulam din nou marker selection corespunzataore*/
        if (eventsArray[x].name.includes(extractedName)) {
            eventsArray[x]();
        }
    }  
    jumpToEventButton.style.display = 'none';
    previousEventButton.style.display = 'inline-block';
    nextEventButton.style.display = 'inline-block';
    returnButoon.style.display = 'inline-block';
});

dateRange.addEventListener('change', function() {                                       /*cand schimbam data manual activam functia corespunzatoare si dezactivam toate optiunile ce trebuie sa apara doar la selecatrea unui personaj*/
    if(dateRange.value == 1) {
        displayDate1();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
    }
    if(dateRange.value == 2) {
        displayDate2();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
    }
    if(dateRange.value == 3) {
        displayDate3();
        nextEventButton.setAttribute('disabled','true');
        previousEventButton.setAttribute('disabled','true');
        returnButoon.setAttribute('disabled','true');
    }
});




