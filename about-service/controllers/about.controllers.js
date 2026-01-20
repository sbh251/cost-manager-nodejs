const Joi = require('joi');

const teamSchema = Joi.array().items(
    Joi.object({
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().min(1).required()
    })
);

function getAbout(req, res, next) {
    try {
        const raw = process.env.TEAM_MEMBERS;
        if(!raw) {
            const err = new Error('TEAM_MEMBERS is missing');
            err.status = 500;
            return next(err);
        }

        let members;
        try {
            members = JSON.parse(raw);
        } catch (e) {
            const err = new Error('TEAM_MEMBERS is not valid JSON');
            err.status = 500;
            return next(err);
        }

        const { error } = teamSchema.validate(members);
        if(error) {
            const err = new Error('TEAM_MEMBERS validation failed');
            err.status = 500;
            return next(err);
        }

        return res.status(200).json(members);
    } catch (e) {
        return next(e);
    }
}

module.exports = { getAbout };