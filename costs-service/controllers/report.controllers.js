const Cost = require('../models/cost.model');
const Report = require('../models/report.model');

const categories = ['food', 'education', 'health', 'housing', 'sports'];

function isPastMonth(year, month) {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    if(year < nowYear) return true;
    if( year < nowYear ) return false;
    return month< nowMonth;
}

function buildEmptyCostArray() {
    return categories.map((c) => ({ [c]: [] }));
}

function groupCosts(costDocs) {
    const map = {};
    for(const c of categories) {
        map[c] = [];
    }

    for(const doc of costDocs) {
        const category = String(doc.category || '').trim().toLowerCase();

        if(!map[category]) {
            continue;
        }

        const d = new Date(doc.created_at || Date.now());
        const day = d.getDate();

        map[category].push({
            sum: doc.sum,
            description: doc.description,
            day: day
        });
    }

    return categories.map((c) => ({ [c]: map[c]}));
}

async function getReport(req, res, next) {
    try {
        const userId = Number(req.query.id);
        const year = Number(req.query.year);
        const month = Number(req.query.month);

        if(!Number.isFinite(userId) || !Number.isFinite(year) || !Number.isFinite(month)) {
            const err = new Error('invalid query params');
            err.status = 400;
            return next(err);
        }

        if(month < 1 || month > 12) {
            const err = new Error('month must be between 1 and 12');
            err.status = 400;
            return next(err);
        }

        const past = isPastMonth(year, month);

        if(past) {
            const cached = await Report.findOne({ userid: userId, year: year, month: month }).lean();
            if(cached) {
                return res.status(200).json({
                    userid: cached.userid,
                    year: cached.year,
                    month: cached.month,
                    costs: cached.costs
                });
            }
        }

        const start = new Date(year, month - 1, 1,0 ,0 ,0 ,0);
        const end = new Date(year, month, 1, 0,0,0,0);

        const costs = await Cost.find({
            userid: userId,
            created_at: { $gte: start, $lt: end }
        }).lean();

        const costsGrouped = costs.length ? groupCosts(costs): buildEmptyCostArray();

        const report = {
            userid: userId,
            year: year,
            month: month,
            costs: costsGrouped
        };

        if(past){
            try {
                await Report.create(report);
            } catch (e) {

            }
        }

        return res.status(200).json(report);
    } catch (e) {
        return next(e);
    }
}

module.exports = { getReport };