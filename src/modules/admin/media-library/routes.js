import express from 'express';
import asyncHandler from '../../../middleware/asyncHandler.js';
import * as controller from './controller.js';

const router = express.Router();
import { adminResponse } from '../common/middleware/adminResponse.js';
router.use(adminResponse);

router.get('/', asyncHandler(controller.listMedia));
router.get('/:folder/:filename', asyncHandler(controller.getMedia));

export default router;