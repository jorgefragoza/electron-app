const message = document.getElementById('label');

EventHandler.subscribe(events.changeLabel, (label) => {
    message.innerHTML = label;
});