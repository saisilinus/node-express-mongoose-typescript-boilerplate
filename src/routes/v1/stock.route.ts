import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { stockValidation, stockController } from '../../modules/stock';

const router: Router = express.Router();

router
  .route('/update')
  .put(auth('manageProducts'), validate(stockValidation.updateProductStock), stockController.updateProductStock);

router.route('/buy').put(auth('buyProducts'), validate(stockValidation.buyProduct), stockController.buyProduct);

export default router;

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: Stock management and retrieval
 */

/**
 * @swagger
 * /stock/update:
 *   put:
 *     summary: Manage products stock
 *     description: Only admins can manage stock.
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *             example:
 *               products:
 *                 - productId: 123m2sf9232573aafX23av
 *                   quantity: 10
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Product'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /stock/buy:
 *   put:
 *     summary: Buy a product and reduce stock
 *     description: Any user can buy products.
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             example:
 *               productId: 123m2sf9232573aafX23av
 *               quantity: 10
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Product'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
