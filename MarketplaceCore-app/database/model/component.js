/**
 * Created by beuttlerma on 31.05.17.
 */

const logger = require('../../global/logger');
const db = require('../db_connection');

/**
 *
 * Builds a component object from a database response
 *
 * @param data
 * @constructor
 */
function Component(data) {
    if (data) {
        this.componentuuid = data.componentuuid;
        this.componentname = data.componentname;
        this.componentparentid = data.componentparentid;
        this.componentparentname = data.componentparentname;
        this.componentdescription = data.componentdescription;
        this.createdat = data.createdat;
        this.createdby = data.createdby;
        this.updatedat = data.updatedat;
        this.useruuid = data.useruuid;
        this.attributelist = data.attributelist;
        this.technologylist = data.technologylist;
        this.displaycolor = data.displaycolor;
    }

}

Component.prototype.FindAll = Component.FindAll = function (userUUID, roles, params, callback) {
    db.func('GetAllComponents', [userUUID, params.lang || 'en', params.technologies, params.attributes, roles])
        .then(function (data) {
            const resultList = [];

            for (let key in data) {
                resultList.push(new Component(data[key]));
            }

            callback(null, resultList);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

Component.prototype.FindSingle = Component.FindSingle = function (userUUID, roles, id, lang, callback) {
    db.func('GetComponentByID', [id, userUUID, lang || 'en', roles])
        .then(function (data) {
            if (data && data.length) {
                data = data[0];
            }
            callback(null, new Component(data));
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

Component.prototype.FindByTechnologyDataId = Component.FindByTechnologyDataId = function (userUUID, roles, technologyDataId, lang, callback) {
    db.func('GetComponentsForTechnologyDataId', [technologyDataId, userUUID, lang || 'en', roles])
        .then(function (data) {
            var resultList = [];
            for (var key in data) {
                resultList.push(new Component(data[key]));
            }
            callback(null, resultList);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

Component.prototype.Create = function (userUUID, roles, callback) {
    db.func('SetComponent',
        [this.componentname,
            this.componentparentname,
            this.componentdescription,
            this.attributelist,
            this.technologylist,
            userUUID,
            roles
        ])
        .then(function (data) {
            logger.debug(data);
            callback(null, data);
        })
        .catch(function (error) {
            logger.crit(error);
            callback(error);
        });
};

Component.prototype.Update = function () {
    throw {name: "NotImplementedError", message: "Function not implemented yet"}; //TODO: Implement this function if needed
};

Component.prototype.Delete = function () {
    throw {name: "NotImplementedError", message: "Function not implemented yet"}; //TODO: Implement this function if needed
};

module.exports = Component;