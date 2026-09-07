import { createGrid } from "./createGrid.js";
import { createControlButtons } from "./createControlButtons.js";

const app = document.getElementById("app");

setupLayout()

function setupLayout() {
    createGrid(app);
    createControlButtons(app);
}
