import { Request, Response } from 'express';
import { OrderService } from './orders.service';
import { error } from 'console';
import { OrderStatus } from '../../database/entities/Order.entity';
import { stat } from 'fs';

const orderService = OrderService();

export class OrderController {

    /**
   * POST /api/orders
   * Створити замовлення (публічний endpoint)
   */

    async create(req: Request, res: Response){
        try{
            const {
                customerName,
                customerEmail,
                customerPhone
                paymentMethod,
                shippingAddress,
                customerNotes,
                items,
            } = req.body;

            if(
                !customerName ||
                !customerEmail ||
                !paymentMethod ||
                !shippingAddress ||
                !customerPhone ||
                !customerNotes ||
                !items ||
                !Array.isArray(items)||
                items.length === 0
            ){
                return res.status(400).json({
                    error: 'Missing required fields',
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(customerEmail)) {
                return res.status(400).json({
                error: 'Invalid email format',
                });
            }

            const order = await orderService.create({
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                customerNotes,
                items,
            });

            res.status(201).json({
                message: 'Order crated successfully',
                data: order,
            });
        } catch (error: any){
            res.status(400).json({
                error: error.message || 'Order creation failed'
            })
        }
    }

    /**
   * GET /api/admin/orders
   * get all orders
   * Query: ?status=pending
   */

    async getAll(req: Request, res: Response){
        try{
            const status = req.query.status as OrderStatus | undefined;

            const orders = await orderService.findAll(
                status? {status} : undefined
            );

            res.status(200).json({
                data: orders,
                count: orders.length,
            });
        } catch (error: any){
            res.status(500).json({
                error: error.message || 'Failed to fetch orders',
            });
        }
    }

    /**
   * GET /api/admin/orders/:id
   */

    async getById(res: Response, req: Request){
        try{
            const {id} = req.params;

            const order = await orderService.findByID(id);

            res.status(200).json({
                data: order,
            });
        } catch(error:any){
            res.status(404).json({
                error: error.message || 'Order not found',
            });
        }
    }

    /**
   * PATCH /api/admin/orders/:id/status
   */

    async updateStatus(req: Request, res: Response){
        try{
            const {id} = req.params;
            const {status} = req.body;

            if(!status || !Object.values(OrderStatus).includes(status)){
                return res.status(400).json({
                    error: 'Invalid status',
                    validStatuses: Object.values(OrderStatus),
                });
            }
            const order = await orderService.updateStatus(id, status);

            res.status(200).json({
                message: 'Order status updated',
                data: order,
            });
        } catch (error: any){
            res.status(400).json({
                error: error.message || 'Status update failed',
            });
        }
    }

    /**
   * PATCH /api/admin/orders/:id/tracking
   * add tracking number
   */

    async addTracking(req: Request, res: Response){
        try{
            const {id} = req.params;
            const { trackingNumber} = req.body;

            if(!trackingNumber){
                return res.status(400).json({
                    error: 'Tracking number is required',
                });
            }

            const order = await orderService.addTracking(id, trackingNumber);

            res.status(200).json({
                message: 'Tracking number added',
                data: order,
            });
        } catch (error: any){
            res.status(400).json({
                error: error.message || 'Failed to add tracking number',
            });
        }
    }
}