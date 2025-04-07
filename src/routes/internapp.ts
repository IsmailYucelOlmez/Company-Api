import { asyncWrapper } from "../lib/AsyncWrapper";
import InternAppController from "../controllers/InternAppController";

import express from 'express';

const router = express.Router();

router.get('/', asyncWrapper(InternAppController.getInternApps));

router.get('/:id', asyncWrapper(InternAppController.getInternAppById));

router.post('/', asyncWrapper(InternAppController.createInternApp));

router.put('/:id', asyncWrapper(InternAppController.updateInternApp));

router.delete('/:id', asyncWrapper(InternAppController.deleteInternApp));

router.get('/statistics/university', asyncWrapper(InternAppController.getCountByUniversity));

router.get('/statistics/category', asyncWrapper(InternAppController.getCountByCategory));

router.get('/statistics/date', asyncWrapper(InternAppController.getCountByMonth));

router.get('/statistics/duration', asyncWrapper(InternAppController.getCountByDuration));

module.exports=router;