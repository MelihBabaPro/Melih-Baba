const { createServiceHandler } = require('../utils/request-handler');
const foodServices = require('./categories/food');
const retailServices = require('./categories/retail');
const transportServices = require('./categories/transport');
const utilityServices = require('./categories/utilities');
const otherServices = require('./categories/other');

const { PRIMARY_WATERMARK, getCodeFingerprint, embedServiceWatermark } = require('../utils/protection');

const _s1 = String.fromCharCode(88, 101, 108, 100, 97, 114, 65, 108, 122);
const _s2 = String.fromCharCode(104, 116, 116, 112, 115, 58, 47, 47, 103, 105, 116, 104, 117, 98, 46, 99, 111, 109, 47, 88, 101, 108, 100, 97, 114, 65, 108, 122, 47, 86, 111, 114, 116, 101, 120, 45, 83, 77, 83, 45, 83, 112, 97, 109, 109, 101, 114);
const _s3 = String.fromCharCode(78, 111, 110, 45, 67, 111, 109, 109, 101, 114, 99, 105, 97, 108);
const _signature = {
    author: _s1,
    repo: _s2,
    license: _s3,
    _: PRIMARY_WATERMARK._,
    __: PRIMARY_WATERMARK.__
};

const _fingerprint = getCodeFingerprint();

const services = [
    ...foodServices,
    ...retailServices,
    ...transportServices,
    ...utilityServices,
    ...otherServices
];

function initializeServices(onLog) {
    const serviceHandlers = services.map(config => {
        const watermarkedConfig = { ...config };
        embedServiceWatermark(watermarkedConfig);
        
        return {
            handler: createServiceHandler(watermarkedConfig, onLog),
            name: config.serviceName
        };
    });
    
    embedServiceWatermark(serviceHandlers);
    
    return serviceHandlers;
}

function getServiceStats() {
    return {
        total: services.length,
        food: foodServices.length,
        retail: retailServices.length,
        transport: transportServices.length,
        utilities: utilityServices.length,
        other: otherServices.length
    };
}

module.exports = {
    services,
    initializeServices,
    getServiceStats
};
