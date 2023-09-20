import { initModals } from "/periodic/components/modal/modal.js";
import { handleDatapointForm } from "../modules/handle-datapoint-form.module.js";
import { handleDatapointCards } from "../modules/handleDatapointCards.js";

initModals();
handleDatapointForm();
handleDatapointCards("global");
