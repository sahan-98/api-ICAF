const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const conference = require('../schemas/editor-schema');


const addingConference = async (req, res, next) => {
    console.log('Adding the conference');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError('Invalid inputs! Please check again.', 422));
    }

 

    const { name, starttime, endtime, venue,description,status,guest,guest2,guest3 } = req.body;

    const addedConference = new conference({
        name,
        description,
        venue,
        starttime,
        endtime,
        guest,
        guest2,
        guest3,
        status
    });


    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await addedConference.save({ session: session });
        await session.commitTransaction();
    } catch(err) {
        const error = new HttpError(
            'Error occured while saving conference details. Please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({conference: addingConference});
};

exports.addingConference = addingConference;

