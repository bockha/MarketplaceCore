/* ##########################################################################
 -- Author: Marcel Ely Gomes
 -- Company: Trumpf Werkzeugmaschine GmbH & Co KG
 -- CreatedAt: 2017-03-08
 -- Description: Routing service for Reports
 -- ##########################################################################*/

var express = require('express');
var router = express.Router();
var logger = require('../global/logger');
var queries = require('../connectors/pg-queries');


router.get('/', function (req, res, next) {
       if(req.query['sinceDate'] && req.query['topValue']) {
           queries.GetTopTechnologyDataSince(req.query['userUUID'], req.query['sinceDate'], req.query['topValue'], function (err, data) {
               if (err) {
                   next(err);
               }
               else {
                   logger.debug('TechDataResponse: ' + JSON.stringify(data));
                   res.json(data);
               }
           });
       }
       else if(req.query['sinceDate']){
           queries.GetActivatedLicensesSince(req.query['userUUID'], req.query['sinceDate'], function (err, data) {
               if (err) {
                   next(err);
               }
               else {
                   res.json(data);
               }
           });
       }
});

router.get('/favorit/', function (req, res, next) {
    queries.GetMostUsedComponents(req.query['userUUID'], req.params['sinceDate'], req.params['topValue'], function (err, data) {
        if (err) {
            next(err);
        }
        else {
            logger.debug('TechDataResponse: ' + JSON.stringify(data));
            res.json(data);
        }
    });
});

router.get('/workload/', function (req, res, next) {
    queries.GetWorkloadSince(req.query['userUUID'], req.params['sinceDate'], function (err, data) {
        if (err) {
            next(err);
        }
        else {
            logger.debug('TechDataResponse: ' + JSON.stringify(data));
            res.json(data);
        }
    });

});



module.exports = router;