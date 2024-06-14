import { Router } from 'express';

import * as controller from '../controllers/apartment.controller';
import upload from '../middlewares/uploadFile';
import { validateRequest } from '../middlewares/validation';
import { verifyAccessToken } from '../middlewares/verifyToken';
import { apartmentSchema } from '../utils/validation';

const router = Router();

router.post('/', verifyAccessToken, upload.any(), controller.createApartment);
router.get('/search', controller.searchApartments);
router.get('/room/:roomId', controller.findRoomById);
router.get('/by-user', verifyAccessToken, controller.getApartmentsByUserId);
router.get('/', verifyAccessToken, controller.getAllApartment);
router.get('/:apartmentId', controller.getApartment);
router.put('/:apartmentId', verifyAccessToken, validateRequest(apartmentSchema), controller.updateApartment);
router.delete('/:apartmentId', verifyAccessToken, controller.deleteApartment);
router.delete('/room/:roomId', verifyAccessToken, controller.removeRoomFromApartment);
router.post('/create-stripe-payment', controller.createStripePayment);

export default router;

