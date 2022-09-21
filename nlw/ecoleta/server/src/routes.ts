import express from 'express';
import knex from './database/connection';

import {celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';


const routes = express.Router();
const upload = multer(multerConfig);

import PointsController from './controllers/PointsController';
const pointsController = new PointsController();

import ItemsController from './controllers/ItemsController';
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);


routes.get('/points/:id', pointsController.show);

routes.get('/points', pointsController.index);

routes.post(
    '/points',
     upload.single('image') ,
     celebrate({
         body: Joi.object().keys({
             name: Joi.string().required(),
             email: Joi.string().required().email(),
             whatsapp: Joi.number().required(),
             latitude: Joi.number().required(),
             longitude: Joi.number().required(),
             uf: Joi.string().required().max(2),
             city: Joi.string().required(),
             item: Joi.string().required()
         })
     },{
         abortEarly: false
     }),
     pointsController.create

);



export default routes;