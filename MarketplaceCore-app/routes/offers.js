/* ##########################################################################
 -- Author: Marcel Ely Gomes
 -- Company: Trumpf Werkzeugmaschine GmbH & Co KG
 -- CreatedAt: 2017-02-28
 -- Description: Routing offers requests
 -- ##########################################################################*/

const express = require('express');
const router = express.Router();
const logger = require('../global/logger');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/offers_schema');

const invoiceService = require('../services/invoice_service');
const helper = require('../services/helper_service');
const Offer = require('../database/model/offer');
const offerRequest = require('../database/function/offer_request');
const payment = require('../database/function/payment');
const transaction = require('../database/function/transaction');

router.get('/:id', validate({
    query: validation_schema.Empty,
    body: validation_schema.Empty
}), function (req, res, next) {
    new Offer().FindSingle(req.token.user.id, req.token.user.roles, req.params['id'], function (err, data) {
        if (err) {
            next(err);
        } else {
            res.json(data);
        }
    });

});

router.post('/', validate({
    query: validation_schema.Empty,
    body: validation_schema.OfferRequestBody
}), function (req, res, next) {

    const userUUID = req.token.user.id;
    const clientUUID = req.token.client.id;
    const requestData = req.body;
    const roles = req.token.user.roles;

    offerRequest.CreateOfferRequest(userUUID, clientUUID, roles, requestData, function (err, offerRequest) {
        if (err) {
            next(err);
        } else {
            if (!offerRequest || offerRequest.length <= 0) {
                next(new Error('Error when creating offer request in marketplace'));
            } else {
                transaction.GetTransactionByOfferRequest(userUUID, roles, offerRequest.result.offerrequestuuid, function (err, transaction) {
                    if (err) {
                        next(err);
                    } else {
                        invoiceService.generateInvoice(userUUID, offerRequest, transaction, roles, function (err, invoiceData) {
                            if (err) {
                                next(err);
                            } else {
                                payment.SetPaymentInvoiceOffer(userUUID, roles, invoiceData, offerRequest.result.offerrequestuuid, function (err, offer) {
                                    if (err) {
                                        next(err);
                                    } else {
                                        const fullUrl = helper.buildFullUrlFromRequest(req);
                                        res.set('Location', fullUrl + offer[0].offeruuid);
                                        res.status(201);
                                        const invoiceIn = JSON.parse(offer[0].invoice);
                                        const invoiceOut = {
                                            expiration: invoiceIn.expiration,
                                            transfers: invoiceIn.transfers
                                        };
                                        res.json({'id': offer[0].offeruuid, 'invoice': invoiceOut});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });


});

module.exports = router;