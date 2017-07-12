/**
 * Created by beuttlerma on 14.03.17.
 */
var logger = require('../../global/logger');
var db = require('../db_connection');

/**
 * Creates an technologydata object from a database query result.
 *
 * @param data
 * @constructor
 */
function TechnologyData(data) {
    if (data) {
        this.technologydataid = data.technologydataid;
        this.technologydatauuid = data.technologydatauuid;
        this.technologydataname = data.technologydataname;
        this.technologyid = data.technologyid;
        this.technologydata = data.technologydata;
        this.licensefee = data.licensefee;
        this.retailprice = data.retailprice;
        this.licenseproductcode = data.licenseproductcode;
        this.technologydatadescription = data.technologydatadescription;
        this.technologydatathumbnail = data.technologydatathumbnail;
        this.technologydataimgref = data.technologydataimgref;
        this.createdat = data.createdat;
        this.createdby = data.createdby;
        this.updatedat = data.updatedat;
        this.updatedby = data.updatedby;
        this.componentlist = data.componentlist;
        this.taglist = data.taglist;
    }
}

TechnologyData.prototype.FindAll = TechnologyData.FindAll = function (userUUID, params, callback) {
    var technologies = params['technologies'];
    var tags = params['tags'];
    var components = params['components'];
    var attributes = params['attributes'];


    db.func('GetTechnologyDataByParams',
        [components,
            technologies,
            userUUID
        ], 1 //TODO: Document this parameter
    )
        .then(function (data) {
            logger.debug('Database query result: ' + JSON.stringify(data));
            var resultList = [];
            for (var key in data.result) {
                resultList.push(new TechnologyData(data.result[key]));
            }
            callback(null, resultList);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

TechnologyData.prototype.FindSingle = TechnologyData.FindSingle = function (userUUID, id, callback) {
    db.func('GetTechnologyDataByID', [id, userUUID])
        .then(function (data) {
            //Only return the first element
            if (data && data.length) {
                data = data[0];
            }
            callback(null, new TechnologyData(data));
        })
        .catch(function (error) {
            logger.crit(error); // print the error;
            callback(error);
        });
};
TechnologyData.prototype.Create = function (userUUID, callback) {
    db.func('SetTechnologyData',
        [   self.technologydataname,
            self.technologydata,
            self.technologydatadescription,
            self.technologyid,
            self.licensefee,
            self.retailprice,
            self.taglist,
            self.componentlist,
            userUUID
        ])
        .then(function (data) {
            logger.debug(data);
            callback(null, new TechnologyData(data));
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};
TechnologyData.prototype.Update = function () {
    throw {name: "NotImplementedError", message: "Function not implemented yet"}; //TODO: Implement this function if needed
};
TechnologyData.prototype.Delete = function () {
    throw {name: "NotImplementedError", message: "Function not implemented yet"}; //TODO: Implement this function if needed
};

module.exports = TechnologyData;