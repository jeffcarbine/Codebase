import { xhr } from "/periodic/scripts/xhr/_xhr.js";
import { addEventDelegate } from "/periodic/scripts/eventdelegate/_eventdelegate.js";

const deleteEvent = (button) => {
  const eventId = button.dataset.eventid;
  console.log(eventId);

  const data = {
    eventId,
  };

  const success = (xhr) => {
    window.location.reload();
  };

  const error = (xhr) => {
    alert(xhr.status);
  };

  const failure = (xhr) => {
    alert(xhr.status);
  };

  xhr("POST", "/admin/events/delete", success, error, failure, data);
};

//addEventDelegate("click", "button.delete", deleteEvent);
