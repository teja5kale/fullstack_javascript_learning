const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');

router.get('/projects', ctrl.listProjects);
router.post('/projects', ctrl.createProject);
router.get('/projects/:id', ctrl.getProject);
router.put('/projects/:id', ctrl.updateProject);
router.delete('/projects/:id', ctrl.deleteProject);

router.get('/projects/:id/summary', ctrl.getProjectSummary);

router.get('/projects/:id/cables', ctrl.listCableRuns);
router.post('/projects/:id/cables', ctrl.addCableRun);
router.get('/projects/:id/cables/boq', ctrl.getCableBOQ);
router.delete('/cables/:cableId', ctrl.deleteCableRun);

module.exports = router;
