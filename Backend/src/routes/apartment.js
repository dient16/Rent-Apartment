const router = require('express').Router();
const controller = require('../controllers/apartment.controller');
const { validateRequest } = require('../middlewares/validation');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const { apartmentSchema } = require('../utils/validation');
const upload = require('../middlewares/uploadFile');

router.post(
    '/',
    verifyAccessToken,
    upload.fields([
        { name: `rooms[${0}][images]`, maxCount: 10 },
        { name: `rooms[${1}][images]`, maxCount: 10 },
        { name: `rooms[${2}][images]`, maxCount: 10 },
        { name: `rooms[${3}][images]`, maxCount: 10 },
    ]),
    validateRequest(apartmentSchema, true),
    controller.createApartment,
);

router.get('/', verifyAccessToken, controller.getAllApartment);
router.get('/:apartmentId', verifyAccessToken, controller.getApartment);
router.put('/:apartmentId', verifyAccessToken, validateRequest(apartmentSchema), controller.updateApartment);
router.delete('/:apartmentId', verifyAccessToken, controller.deleteApartment);
router.delete('/room/:roomId', verifyAccessToken, controller.removeRoomFromApartment);

module.exports = router;
