import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createOrder } from '../controllers/order/createOrder';
import { getOrder } from '../controllers/order/getOrder';
import { createOrderSchema, getOrderSchema } from '../validators/order';

const router = Router();

router.post('/', validate(createOrderSchema), createOrder);
router.get('/:orderId', validate(getOrderSchema), getOrder);

export default router;
