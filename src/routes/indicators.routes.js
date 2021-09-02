const { Router } = require("express");

const IndicatorsController = require("../controllers/IndicatorsController");

const indicatorsRoutes = Router();

indicatorsRoutes.get("/doneTasks", IndicatorsController.totalDoneTasks);
indicatorsRoutes.get("/:userId/averageDoneTasks", IndicatorsController.averageDoneTasks);
indicatorsRoutes.get("/:userId/timeAverageCreatedToRunning", IndicatorsController.timeAverageCreatedToRunning);
indicatorsRoutes.get("/:userId/timeAverageRunningToDone", IndicatorsController.timeAverageRunningToDone);

module.exports = indicatorsRoutes;