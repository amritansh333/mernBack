import express from 'express';
import asyncHandler from '../../../middleware/asyncHandler.js';
import * as controller from './controller.js';

const router = express.Router();

router.get('/', asyncHandler(controller.listUsers));
router.get('/:id', asyncHandler(controller.getUser));
router.post('/', asyncHandler(controller.createUser));
router.put('/:id', asyncHandler(controller.updateUser));
router.delete('/:id', asyncHandler(controller.deleteUser));
router.post('/bulk-delete', asyncHandler(controller.bulkDelete));

export default router;
