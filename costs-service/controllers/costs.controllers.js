const Joi = require('joi');
const User = require('../models/user.model');
const Cost = require('../models/cost.model');

const allowedCategories = new Set(['food', 'health', 'housing', 'sports', 'education']);

const addCostSchema = Joi.object({
    description: Joi.string().min(1).required(),
    category: Joi.string().valid('food', 'health', 'housing', 'sports', 'education').required(),
    userid: Joi.number().integer().required(),
    sum: Joi.number().positive().required(),
    created_at: Joi.date().optional()
});

function isPastDate(date){
    const now = new Date();
    const d = new Date(date);
    return d.getTime() < now.getTime();
}

async function addCost(req, res, next) {
    try {
        if (!allowedCategories.has(req.body.category)) {
            const err = new Error('invalid category');
            err.status = 400;
            return next(err);
        }

        const user = await User.findOne({ id: req.body.userid }).lean();
        if(!user) {
            const err = new Error('user not found');
            err.status = 404;
            return next(err);
        }

        if(req.body.created_at && isPastDate(req.body.created_at)) {
            const err = new Error('cannot add costs in the past');
            err.status = 400;
            return next(err);
        }

        const payload = {
            description: req.body.description,
            category: req.body.category,
            userid: req.body.userid,
            sum: req.body.sum,
            created_at: req.body.created_at ? new Date(req.body.created_at) : new Date()
        };

        const cost = await Cost.create(payload);

        return res.status(200).json({
            description: cost.description,
            category: cost.category,
            userid: cost.userid,
            sum: cost.sum
        });
    } catch (e) {
        return next(e);
    }
}

module.exports = { addCostSchema, addCost };