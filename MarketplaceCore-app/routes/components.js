/* ##########################################################################
 -- Author: Marcel Ely Gomes
 -- Company: Trumpf Werkzeugmaschine GmbH & Co KG
 -- CreatedAt: 2017-03-08
 -- Description: Routing requests for components
 -- ##########################################################################*/

const express = require('express');
const router = express.Router();
const logger = require('../global/logger');

const {Validator, ValidationError} = require('express-json-validator-middleware');
const validator = new Validator({allErrors: true});
const validate = validator.validate;
const validation_schema = require('../schema/components_schema');

const Component = require('../database/model/component');
const helper = require('../services/helper_service');

const bruteForceProtection = require('../services/brute_force_protection');


router.get('/', validate({
    query: validation_schema.Components_Query,
    body: validation_schema.Empty
}), function (req, res, next) {

    Component.FindAll(req.token.user.id, req.token.user.roles, req.query, function (err, data) {
        if (err) {
            next(err);
        }
        else {
            res.json(data);
        }
    });
});

router.get('/:id', validate({
    query: validation_schema.Single_Component_Query,
    body: validation_schema.Empty
}), function (req, res, next) {
    Component.FindSingle(req.token.user.id, req.token.user.roles, req.params['id'], req.query['lang'], function (err, data) {
        if (err) {
            next(err);
        }
        else {
            res.json(data);
        }
    });
});

router.post('/', bruteForceProtection.global,
    validate({
        body: validation_schema.SaveData_Body,
        query: validation_schema.Empty
    }), function (req, res, next) {
        const comp = new Component();

        const data = req.body;

        comp.componentname = data['componentName'];
        comp.componentparentname = data['componentParentName'];
        comp.componentdescription = data['componentDescription'];
        comp.attributelist = data['attributeList'];
        comp.technologylist = data['technologyList'];

        comp.Create(req.token.user.id, req.token.user.roles, function (err, data) {
            if (err) {
                next(err);
            }
            else {
                var fullUrl = helper.buildFullUrlFromRequest(req);
                res.set('Location', fullUrl + data[0]['componentuuid']);
                res.sendStatus(201);
            }
        });
    });

module.exports = router;