import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr } from "/periodic/modules/xhr/xhr.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";
import { handleDatapointCards } from "../modules/handleDatapointCards.js";

handleDatapointForm();
handleDatapointCards("page", pageId);
