import { createGrid } from "./gridLayout.js";
import { createControlButtons } from "./controlsLayout.js";

const app = document.getElementById("app");

setupLayout()

function setupLayout() {
    createGrid(app);
    createControlButtons(app);
}
