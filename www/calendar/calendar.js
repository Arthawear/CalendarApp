(function () {
    'use strict';
    angular.module('app').controller('CalendarCtrl', CalendarCtrl);

    CalendarCtrl.$inject = ['$rootScope', '$scope', '$filter', 'navigationBar', 'constants'];

    function CalendarCtrl($rootScope, $scope, $filter,  navigationBar, constants) {
        var vm = this;

        function activate() {
            $rootScope.contentPaddingTop = 75;
            $rootScope.contentPaddingBottom = 0;
            navigationBar.setup({
                title: "Calendar",
                class: 'navigationBarMiddleBlue'
            });
            setCompoundCalendarProperty('views.oneDay','type:timelineDay,duration:{days:1},dateIncrement:{days:1},slotLabelInterval:{hours:1},slotWidth:20,slotLabelFormat:[dddd DD.MM.YYYY;HH]');
            setCompoundCalendarProperty('views.twoDays','type:timelineWeek,duration:{days:2},dateIncrement:{days:2},slotLabelInterval:{days:1},slotLabelFormat:[dd;DD]');
            setCompoundCalendarProperty('views.workWeek','type:timelineWeek,duration:{days:7},dateIncrement:{days:7},slotLabelInterval:{days:1},slotLabelFormat:[dd;DD],weekends:false');
            setCompoundCalendarProperty('views.oneWeek','type:timelineWeek,duration:{days:7},dateIncrement:{days:7},slotLabelInterval:{days:1},slotLabelFormat:[dd;DD],weekends:true');
            setCalendarProperty('nowIndicator','true');
            setCalendarProperty('scrollTime',"07:00:00");
            setCalendarProperty('resourceAreaWidth',"35%");
            setCalendarProperty('resourceGroupField',"");
            setResources(constants.resources);
            setCalendarProperty('defaultView','oneDay');
            setCalendarProperty('minTime','07:00');
            setCalendarProperty('maxTime','17:00');
            setResourceColumns([{"field":"title"}]);

            startCalendar();

            setEvents(constants.events);
            
            //setView('oneDay');
            //setView('twoDays');
            setView('oneWeek');
            //setView('workWeek');
            SetDate();
        }
        var currentDate = moment();
        var firstInit = true;
        var calendarFreeDays = [];
        var isResourceFiltered = false;
    
        var calendarProperties = {
            locale: 'en',
            eventLimit: true,
            theme: true,
            aspectRatio: 3.0,
            editable: false,
            droppable: true,
            weekendColor: "#d6e9f5",
            eventDurationEditable: false,
            selectable: true,
            unselectAuto: false,
            height: 'parent',
            resourceAreaWidth: "28%",
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
        };
        var defaultHeaderAvailabilityPlanning = {
            left: 'title',
            center: '',
            right: 'moveToCurrentDate prevDuration,prevDateIncrement,nextDateIncrement,nextDuration'
        };
        var resourceAvailabilityButtons = [];
                
        var eventRender = function(event, element, view) {
            element.on('click', function(e) {
                //alert('yes');
            });
            element.prop("title", event.mouseoverText);
        };
        var dayRender = function(date, cell) {
            if (date.day() === 6 || date.day() === 0) {
                cell.css("background-color", calendarProperties.weekendColor);
            }
            calendarFreeDays.forEach(function(day) {
                var freeDay = moment.utc(day.date);
                if (date.isSame(freeDay, 'day')) {
                    cell.css("background-color", day.color);
                }
            });
        };
        var resourceRender = function(resourceObj, labelTds, bodyTds) {
            labelTds.on('dblclick', function(e) {
                GetDate();
                var view = $('#calendar').fullCalendar('getView');
                if (!isResourceFiltered) {
                    var filteredResource = $filter("filter")(calendarProperties.resources, { id: resourceObj.id },true);
                    filteredResource[0].parentId = '';
                    calendarProperties.resources = filteredResource;
                    startCalendar();
                    setEvents(constants.events);
                    setView(view.name);
                    SetDate();
                    isResourceFiltered = true;
                } else {
                    setResources(constants.resources);
                    startCalendar();
                    setEvents(constants.events);
                    setView(view.name);
                    SetDate();
                    isResourceFiltered = false;
                }
            });
        };   
                
        function setBaseLayout() {
            var calendar = document.createElement("div");
            calendar.id = "calendar";
            $('#divCalendar').append(calendar);
            firstInit = false;
        }
        
        function startCalendar() {
            try {
                $('#calendar').fullCalendar('destroy');
                if (firstInit) {
                    setBaseLayout();
                }
                addFunctionsToProperties(calendarProperties);
                setModuleSpecificProperties(calendarProperties);
                $('#calendar').fullCalendar(calendarProperties);
                addDesigns();
            } catch (e) {
                alert(e);
            }
        }
                        
        function setView(newView) {
            calendarProperties.currentView = newView;
            var currDateButton = $('.fc-moveToCurrentDate-button');
            if (newView === 'oneDay') {
                currDateButton.html('Today');
            } else {
                currDateButton.html('CurrWeek');
            }
            setPrevNextDurationVisibility(newView);
        
            $('#calendar').fullCalendar('changeView', newView);
            addDayDivider();
        }
        
          
        function addFunctionsToProperties(properties) {
            properties.dayRender = dayRender;
            properties.eventRender = eventRender;
            properties.resourceRender = resourceRender;
        }
        
        function setModuleSpecificProperties(properties) {
            properties.customButtons = fillButtonsAvailabilityPlanning(resourceAvailabilityButtons);
            properties.header = createDefaultHeaderAvailabilityPlanning(resourceAvailabilityButtons, defaultHeaderAvailabilityPlanning);
            properties.currentView = properties.defaultView;
        }
        
        function addDesigns() {
            addDayDivider();
            setPrevNextDurationVisibility(calendarProperties.defaultView);
        }
        
        function addDayDivider() {
            var view = $('#calendar').fullCalendar('getView');
            var duration = view.viewSpec.duration;
            var slotDuration = view.slotDuration;
            var slotCnt = view.slotCnt;
            if (duration.asDays() >= 1 && slotDuration.asDays() < 1) {
                if (view.options.weekends) {
                    var realDuration = duration.asDays();
                } else {
                    (realDuration = duration.asDays() * 5 / 7);
                }
                var slotsPerDay = slotCnt / realDuration;
                if (slotsPerDay % 1 === 0) {
                    $("*.fc-bg table td:nth-child(" + slotsPerDay + "n+1)").css("border-left", "1px solid #71adda");
                }
            }
        
        }
        
        function fillButtonsAvailabilityPlanning(buttons) {
        
            var buttonsAvailabilityPlanning = [];
        
            buttonsAvailabilityPlanning['moveToCurrentDate'] = {};
            buttonsAvailabilityPlanning['moveToCurrentDate'].click = goToCurrentDate;
            if (calendarProperties.defaultView === 'oneDay') {
                buttonsAvailabilityPlanning['moveToCurrentDate'].text = 'Today';
            } else {
                buttonsAvailabilityPlanning['moveToCurrentDate'].text = 'CurrWeek';
            }
        
            buttonsAvailabilityPlanning['prevDateIncrement'] = {};
            buttonsAvailabilityPlanning['prevDateIncrement'].text = "\u2039";
            buttonsAvailabilityPlanning['prevDateIncrement'].click = function() {
                var currView = $('#calendar').fullCalendar('getView');
                var newStart = currView.start.subtract(calendarProperties.views[currView.name].dateIncrement);
                $('#calendar').fullCalendar('gotoDate', newStart);
            };
        
            buttonsAvailabilityPlanning['nextDateIncrement'] = {};
            buttonsAvailabilityPlanning['nextDateIncrement'].text = "\u203A";
            buttonsAvailabilityPlanning['nextDateIncrement'].click = function() {
                var currView = $('#calendar').fullCalendar('getView');
                var newStart = currView.start.add(calendarProperties.views[currView.name].dateIncrement);
                $('#calendar').fullCalendar('gotoDate', newStart);
            };
        
            buttonsAvailabilityPlanning['prevDuration'] = {};
            buttonsAvailabilityPlanning['prevDuration'].text = "\u00AB";
            buttonsAvailabilityPlanning['prevDuration'].click = function() {
                var currView = $('#calendar').fullCalendar('getView');
                var newStart = currView.start.subtract(calendarProperties.views[currView.name].duration);
                $('#calendar').fullCalendar('gotoDate', newStart);
            };
        
            buttonsAvailabilityPlanning['nextDuration'] = {};
            buttonsAvailabilityPlanning['nextDuration'].text = "\u00BB";
            buttonsAvailabilityPlanning['nextDuration'].click = function() {
                var currView = $('#calendar').fullCalendar('getView');
                var newStart = currView.start.add(calendarProperties.views[currView.name].duration);
                $('#calendar').fullCalendar('gotoDate', newStart);
            };
        
            return buttonsAvailabilityPlanning;
        }
        
        function createDefaultHeaderAvailabilityPlanning(buttons, defaultHeader) {
            var centerString = "deleteAll ";
            buttons.forEach(function(button) {
                centerString = centerString + button.text + ' ';
            });
            defaultHeader.center = centerString;
            return defaultHeader;
        
        }
        
        function setCalendarProperty(name, value) {
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            calendarProperties[name] = value;
        }
        
        function setCompoundCalendarProperty(name, value) {
            value = value.split(',');
            for (var i = 0; i < value.length; i++) {
                if (value[i].indexOf('{') > 0) {
                    var objDefinition = value[i].split(':{');
                    objDefinition[1] = objDefinition[1].replace('}', "");
                    var objDefinitionArray = objDefinition[1].split(';');
                    var tempObject = {};
                    for (var j = 0; j < objDefinitionArray.length; j++) {
                        var tempArr = objDefinitionArray[j].split(':');
                        AssignValue(tempArr[0], tempArr[1], tempObject);
                    }
                    AssignValue(name + '.' + objDefinition[0], tempObject, calendarProperties);
                } else if (value[i].indexOf('[') > 0) {
                    var arrDefinition = value[i].split(':[');
                    arrDefinition[1] = arrDefinition[1].replace(']', "");
                    var arrDefinitionArray = arrDefinition[1].split(';');
                    AssignValue(name + '.' + arrDefinition[0], arrDefinitionArray, calendarProperties);
                } else {
                    var propDefinition = value[i].split(':');
                    var propertyname = name + '.' + propDefinition[0];
                    AssignValue(propertyname, propDefinition[1], calendarProperties);
                }
            }
        }
        
        function setResourceColumns(resourceColumns) {
            if (resourceColumns !== "") {
                calendarProperties.resourceColumns = resourceColumns;
            }
            calendarProperties.resourceColumns[0].render = function(resource, el) {
                if (resource.type === "Planning Group") {
                    el.css('font-weight', 'bold');
                }
            }
        }
        
        function setResources(resources) {
            if (resources !== "") {
                calendarProperties.resources = JSON.parse(resources);
            }
        }
        
       
        function setEvents(events) {
            if (events !== "") {
                $('#calendar').fullCalendar('addEventSource', { events: events});
            }
        }
        
        function goToDate(date) {
            $('#calendar').fullCalendar('gotoDate', moment.utc(date));
        }
        
        function setPrevNextDurationVisibility(view) {
            var prevDur = $('.fc-prevDuration-button');
            var nextDur = $('.fc-nextDuration-button');
        
            if (view === 'fourWeeks' || view === 'twoWeeks') {
                nextDur[0].style.display = 'inline-block';
                prevDur[0].style.display = 'inline-block';
            } else {
                nextDur[0].style.display = 'none';
                prevDur[0].style.display = 'none';
            }
        }
        
        function goToCurrentDate() {
            if (calendarProperties.currentView === 'oneDay') {
                goToToday();
            } else {
                goToCurrentWeek();
            }
            $('.fc-highlight').remove();
        }
        
        function goToToday() {
            $('#calendar').fullCalendar('gotoDate', moment());
        }
        
        function goToCurrentWeek() {
            var currDate = moment();
            $('#calendar').fullCalendar('gotoDate', getCurrentMonday(currDate));
        }
        
        function getCurrentMonday(currDate) {
            var date = new Date(currDate);
            var currMonday = moment.utc(date);
            var weekday = currMonday.isoWeekday();
            if (weekday > 1) {
                currMonday = currMonday.subtract(weekday - 1, 'days');
            }
            return (currMonday);
        }
                
        function AssignValue(varname, value, aimingObject) {
            if (value === 'false') {
                value = false;
            }
            if (value === 'true') {
                value = true;
            }
            var v = varname.split(".");
            if (!v.length)
                return;
            for (var i = 0; i < v.length - 1; i++) {
                if (aimingObject[v[i]] === undefined) {
                    aimingObject[v[i]] = {}
                }
                aimingObject = aimingObject[v[i]];
            }
            aimingObject[v[v.length - 1]] = value;
        }
        function GetDate() {
            var elem = $("#calendar").find(".ui-widget-header");
            var th = elem[4];
            currentDate = moment.utc(th.dataset.date);
        }

        function SetDate() {
            var currDate = moment();
            if (getCurrentMonday(currentDate) == getCurrentMonday(currDate)) {
                if (calendarProperties.currentView == 'oneDay' || calendarProperties.currentView == 'twoDays') {
                    goToToday();
                } else {
                    goToDate(getCurrentMonday(currDate));
                }
            } else {
                if (calendarProperties.currentView == 'oneDay' || calendarProperties.currentView == 'twoDays') {
                    goToDate(currentDate);
                } else {
                    goToDate(getCurrentMonday(currentDate));
                }
            }
        }

        activate();
    }
})();
