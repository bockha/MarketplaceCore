/**
 * Created by beuttlerma on 31.05.17.
 */

var logger = require('../../global/logger');
var db = require('../db_connection');

var self = {};

self.GetActivatedLicensesSinceForUser = function (userUUID, roles, sinceDate, callback) {
    db.func('GetActivatedLicensesSinceForUser',[sinceDate, userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetTopTechnologyDataForUser= function(userUUID, roles, topValue, callback){
    db.func('GetTopTechnologyDataForUser', [topValue, userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetTopTechnologyDataSinceForUser= function(userUUID, roles, sinceDate, topValue, callback){
    db.func('GetTopTechnologyDataSinceForUser', [sinceDate, topValue, userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetWorkloadSinceForUser = function(userUUID, roles, sinceDate, callback){
    db.func('GetWorkloadSinceForUser', [sinceDate, userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetMostUsedComponentsForUser = function(userUUID, roles, sinceDate, topValue, callback){
    db.func('GetMostUsedComponentsForUser', [sinceDate, topValue, userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetRevenuePerTechDataForUser = function(userUUID, roles, sinceDate, callback){
    db.func('GetRevenuePerTechDataForUser', [sinceDate, userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetTotalRevenueForUser = function(userUUID, roles, callback){
    db.func('GetTotalRevenueForUser', [userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetTechnologyDataForUser = function(userUUID, roles, callback){
    db.func('GetTechnologyDataForUser', [userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

self.GetRevenuePerDayForUser = function(userUUID, roles, callback){
    db.func('GetRevenuePerDayForUser', [userUUID, roles])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

module.exports = self;