/**
 * Global variables saved to the database
 */
angular.module('app').value("constants", {
    isMobile: false,
    isTablet: false,
    isAndroid: false,
    isPhone: false,
    isWeb: true,
    isWindowsPhone: false,
    isOrientationPortrait: false,
    deviceID: '',
    resources: JSON.stringify([{
        "id": "TAN1",
        "title": "Programozas",
        "type": "Planning Group"
      },
      {
        "id": "TAN2",
        "title": "Konyveles",
        "type": "Planning Group"
      },
      {
        "id": "C#",
        "parentId": "TAN1",
        "title": "C#",
        "type": "Resource"
      },
      {
        "id": "Pithon",
        "parentId": "TAN1",
        "title": "Pithon",
        "type": "Resource"
      },
      {
        "id": "Statisztika",
        "parentId": "TAN2",
        "title": "Statisztika",
        "type": "Resource"
      }]),
    events: [{
        "id": "9171",
        "resourceId": "Pithon",
        "planningGroup": "",
        "start": "2020-02-17T10:15:00Z",
        "end": "2020-02-17T11:15:00Z",
        "allDay": "Nein",
        "type": "NBEREIT",
        "color": "#007700",
        "editable": "true",
        "durationEditable": "true",
        "eventType": "resourceAvailabilityEntry",
        "showContextMenu": "true",
        "EventDescription": "",
        "mouseoverText": "Nachtschicht Bereitschaft\n21.02.2020 14:00 - 22.02.2020 6:30\n",
        "title": "ELOADAS"
      },
      {
        "id": "9172",
        "resourceId": "C#",
        "planningGroup": "",
        "start": "2020-02-20T10:15:00Z",
        "end": "2020-02-20T11:15:00Z",
        "allDay": "Nein",
        "type": "NBEREIT",
        "color": "#007700",
        "editable": "true",
        "durationEditable": "true",
        "eventType": "resourceAvailabilityEntry",
        "showContextMenu": "true",
        "EventDescription": "",
        "mouseoverText": "Nachtschicht Bereitschaft\n21.02.2020 14:00 - 22.02.2020 6:30\n",
        "title": "GYAK"
      },],
   
});