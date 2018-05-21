/**
 * This Program looks ahead at the calendar and grabs all the events related to me and puts them on my personal calendar so I can see them on my iphone it's Written in Google Apps Script which is basically Javascript with a few different options, I don't expect this to work outside of Apps Script
-- Execution: Run myMain()
 * 
 */

/**
 * Lists the next upcoming events from the calendars listed below
 * https://developers.google.com/apps-script/advanced/calendar#listing_events
 */
function listNextEvents(CalendarString) {
  Logger.log('----------- List Next Events -------------');
  var calendarId = CalendarString;
  var now = new Date();
  var events = Calendar.Events.list(calendarId, {
    timeMin: now.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 20,
  });
  //Logger.log(events);
  var cleanedEvents = [];
  if (events.items && events.items.length > 0) {
    for (var i = 0; i < events.items.length; i++) {
      var event = {
        summary: events.items[i].summary,
        start: { dateTime: events.items[i].start.dateTime, },
        end: { dateTime: events.items[i].end.dateTime, },
      };
      Logger.log(event.summary);
      Logger.log(event.start.dateTime);
      Logger.log(event.end.dateTime);
      cleanedEvents.push(event);
    }
    
  } else {
    Logger.log('No events found.');
  }
  
  Logger.log('cleanedEvents is Type of: ');
  Logger.log(typeof cleanedEvents);
  return cleanedEvents;
}

function maintEventForUser(maintEventsList, whoIsThis) {
  Logger.log('----------- maintEventForUser -------------');
  Logger.log('Who is This Passed: %s', whoIsThis);
  var userMaintEvents = [];
  for (var i = 0; i < maintEventsList.length; i++) {
    var event = maintEventsList[i]
    var summary = event.summary.toLowerCase();
    Logger.log('Event: %s', event);
    Logger.log('summary: %s', event);
    Logger.log(summary.indexOf(whoIsThis))
    if (summary.indexOf(whoIsThis)  != -1){
      Logger.log("true, Event Pushed");
      userMaintEvents.push(event);
    }
  }
  return userMaintEvents;
}

/*
* This function was removed after I found isDuplicate to be just as effective, and not as "prone to error" ---> undefined
* I'm leaving it here until I'm sure I no longer need it.
*/
/*
function isDifferent(List1, List2) {
  Logger.log('----------- is Different -------------');
  var newEvents = [];
  var currentCount = 0;
  var count1 = List1.length;

  while (currentCount < count2 ) {
    if ((List1[currentCount].summary != List2[currentCount].summary) && (List1[currentCount].start != List2[currentCount].start)){
      Logger.log('%s ---> New Event (%s) Start: %s - Ending: %s', List1[currentCount], List1[currentCount].summary, List1[currentCount].start.dateTime, List1[currentCount].end.dateTime);
      newEvents.push(List1[currentCount]);
    
    } else {
      Logger.log('Event is the Same');
    }
    currentCount++;
  }
  while (currentCount < count1) {
    newEvents.push(List1[currentCount]);
    currentCount++;
  
  }
  return newEvents;
}
*/

/**
 * Creates an event in the user's calendar.
 */
function isDuplicate(eventsToBeAdded, userCalendarEventsList) {
  Logger.log('----------- is Duplicate -------------');
  var finalList = [];
  
  for (var i = 0; i < eventsToBeAdded.length; i++) {
    var duplicate = 0;
    var event = eventsToBeAdded[i];
    //Logger.log('isDuplicate - Loop 1');
    //Logger.log('The Event Being Tested: %s', event);
    
    for (var j = 0; j < userCalendarEventsList.length; j++) {
      //Logger.log('Loop 2');
      //Logger.log('The Event Being Tested: %s --- against this: ', event);
      //Logger.log('%s', userCalendarEventsList[j]);
      //Logger.log('Loop 2/');
      /*
      This is here because for some reason I cannot evaluate a dictionary against a dictionary - not sure why - but there you go
      */
      if (event.summary == userCalendarEventsList[j].summary){
        if (event.start.dateTime == userCalendarEventsList[j].start.dateTime){
          if (event.end.dateTime == userCalendarEventsList[j].end.dateTime){
            Logger.log('#########################');
            Logger.log('Duplicate Event: %s ---------- %s ', event, userCalendarEventsList[j]);
            Logger.log('#########################');
            duplicate++;
          }
        }
      }
    }
    if (event != null && duplicate == 0){
      finalList.push(event);
      
    }
    duplicate = 0;
  }
  
  return finalList;
}
/**
 * Creates an event in the user's calendar.
 */
function createEvent(string, List1) {
  Logger.log('----------- Create Event -------------');
  var calendarId = string;
  Logger.log(calendarId);
  var newEvents = List1;
  Logger.log(newEvents.length);
  for (var i = 0; i < newEvents.length; i++) {
    Logger.log(newEvents[i].summary);
    Logger.log(newEvents[i].start.dateTime);
    Logger.log(newEvents[i].end.dateTime);
    var event = {
      summary: newEvents[i].summary,
      start: { dateTime: newEvents[i].start.dateTime, },
      end: { dateTime: newEvents[i].end.dateTime, },
    };
    event = Calendar.Events.insert(event, calendarId);
    Logger.log('Event ID: ' + event.getId());
    Logger.log('%s ---> New Event (%s) Start: %s - Ending: %s', i, event.summary, event.start.dateTime, event.end.dateTime);
  }
}

/*
* NOTES:
* MainSchedules: Paste Calendar ID
* UserCalendar: Paste your personal calendar ID (Make this one a new Calendar)
* WhoIsThis: your name, if you want to search for a specfic user
* 
*/

function myMain() {
  var maintSchedules = ''
  var userCalendar = ''
  var whoIsThis = ''
  
  Logger.log('-------------- Maint Calendar List -----------------');
  var maintEventsList = listNextEvents(maintSchedules);
  Logger.log('-------------- Maint Calendar Returned LIST -----------------');
  //Logger.log(typeof maintEventsList);
  //Logger.log('User Events %s', maintEventsList);
  //var maintEventsCount = maintEventsList.length;
  //Logger.log('Maint Calendar Returned Count %s', maintEventsCount);
  
  Logger.log('-------------- Is the Event For Me -----------------');
  var maintEventsForMe = maintEventForUser(maintEventsList, whoIsThis);
  Logger.log('-------------- EventForMe Returned LIST -----------------');
  Logger.log('Events For Me: %s', maintEventsForMe);
  Logger.log('Event for Me Returned Count %s',  maintEventsForMe.length);
  
  Logger.log('-------------- User Calendar List -----------------');
  var userCalendarEventsList = listNextEvents(userCalendar);
  Logger.log('-------------- Maint Calendar Returned LIST -----------------');
  //Logger.log('User Events %s', userCalendarEventsList);
  //var userEventsCount = userCalendarEventsList.length;
  //Logger.log('User Calendar Returned Count %s', userEventsCount);
/*
  Logger.log('-------------- Is Different Function -----------------');
  var eventsToBeAdded = isDifferent(maintEventsForMe, userCalendarEventsList);
  Logger.log('-------------- eventsToBeAdded Returned LIST -----------------');
  Logger.log(eventsToBeAdded);
  Logger.log('Number of Events to be Added %s', eventsToBeAdded.length);
  Logger.log(typeof eventsToBeAdded);
*/
  if (maintEventsForMe.length > 0){
    Logger.log('-------------- Is Duplicate Function -----------------');
    var withoutDuplicates = isDuplicate(maintEventsForMe, userCalendarEventsList);
    Logger.log('-------------- withoutDuplicates Returned LIST -----------------');
    Logger.log(withoutDuplicates);
    Logger.log(typeof withoutDuplicates);
    if (withoutDuplicates.length > 0) {
      Logger.log('-------------- Add Event to Calendar -----------------');
      Logger.log('More Events to be Added %s', withoutDuplicates.Length);
      createEvent(userCalendar, withoutDuplicates);
    }

  }

}
