const Joi = require('joi');
const User = require('../models/user.model');
const Cost = require('../models/cost.model');

const addUserSchema = new Joi.object({
    id: Joi.number().integer().required(),
    first_name: Joi.string().min(1).required(),
    last_name: Joi.string().min(1).required(),
    birthday: Joi.date().required()
});

async function addUser(req, res, next){
    try {
        const existing = await User.findOne({ id: req.body.id }).lean();
        if(existing) {
            const err = new Error('user id already exists');
            err.status = 400;
            return next(err);
        }

        const user = await User.create(req.body);
        return res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            birthday: user.birthday
        });
    } catch (e) {
        return next(e);
    }
}

async function listUsers(req, res, next){
    try {
        const users = await User.find({}).lean();
        return res.status(200).json(users);
    } catch (e) {
        return next(e);
    }
}

async function getUserDetails(req, res, next) {
    try {
        const userId = Number(req.params.id);
        if(!Number.isFinite(userId)) {
            const err = new Error('invalid user id');
            err.status = 400;
            return next(err);
        }

        const user = await User.findOne({ id: userId }).lean();
        if(!user) {
            const err = new Error('user not found');
            err.status = 404;
            return next(err);
        }

        const agg = await Cost.aggregate([
            { $match: { userid: userId } },
            { $group: { _id: '$userid', total: { $sum: '$sum' } } }
        ]);

        const total = agg.length ? agg[0].total : 0;

        return res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (e) {
        return next(e);
    }
}

module.exports = { addUserSchema, addUser, listUsers, getUserDetails };