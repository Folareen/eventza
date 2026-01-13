import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createOrder } from '../controllers/order/createOrder';
import { getOrder } from '../controllers/order/getOrder';
import { createOrderSchema, getOrderSchema } from '../validators/order';

const router = Router();

router.post('/', validate(createOrderSchema, 'body'), createOrder);
router.get('/:orderId', validate(getOrderSchema, 'params'), getOrder);

export default router;
