/**
 * Created by beuttlerma on 03.03.17.
 */

var self = {};

//TODO: Remove this function
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

self.generateInvoiceForRequest = function (request, callback) {

    var invoice = {
        totalAmount: 100000 ,
        referenceId: request.offerId,
        expiration: new Date(new Date().getTime() + (2 * 60 * 60 * 1000)).toISOString(),
        transfers: [

            {
                address: 'mqN3sB5jo3r4aDRmXHHQZMf9tCwP1zMzce',
                coin: 70000
            }
        ]
    };


    callback(null, invoice);
};


module.exports = self;