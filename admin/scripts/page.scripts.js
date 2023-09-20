import { initModals } from "/periodic/components/modal/modal.js";
import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import { xhr } from "/periodic/modules/xhr/xhr.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";
import { handleDatapointCards } from "../modules/handleDatapointCards.js";

initModals();
handleDatapointForm();
handleDatapointCards("page", pageId);
