import { createGrid } from "./gridLayout.js";
import { createControlButtons } from "./controlsLayout.js";
import { createNewGame } from "./gridLayout.js";
import { resumeGame } from "./controlsLayout.js";

const app = document.getElementById("app");

createGrid(app);
createControlButtons(app);
createNewGame();
resumeGame(app);


