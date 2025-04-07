import { asyncWrapper } from "../lib/AsyncWrapper";
import CategoryController from "../controllers/CategoryController";

import express from 'express';

const router = express.Router();

router.get('/', asyncWrapper(CategoryController.getCategories));

router.get('/:id', asyncWrapper(CategoryController.getCategoryById));

router.post('/', asyncWrapper(CategoryController.createCategory));

router.put('/:id', asyncWrapper(CategoryController.updateCategory));

router.delete('/:id', asyncWrapper(CategoryController.deleteCategory));

module.exports=router;