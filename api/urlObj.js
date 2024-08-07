

import json from "./url.json";
let userBaseUrl = json.serviceUri.user.protocol + "://" + json.serviceUri.user.serverHost + ":" + json.serviceUri.user.port + json.serviceUri.user.context;
let itineraryBaseUrl = json.serviceUri.itinerary.protocol + "://" + json.serviceUri.itinerary.serverHost + ":" + json.serviceUri.itinerary.port + json.serviceUri.itinerary.context;
let onlineBaseUrl = json.serviceUri.onLine.protocol + "://" + json.serviceUri.onLine.serverHost + ":" + json.serviceUri.onLine.port + json.serviceUri.onLine.context;
let orderBaseUrl = json.serviceUri.order.protocol + "://" + json.serviceUri.order.serverHost + ":" + json.serviceUri.order.port + json.serviceUri.order.context;
let uploadBaseUrl = json.serviceUri.upload.protocol + "://" + json.serviceUri.upload.serverHost + ":" + json.serviceUri.upload.port + json.serviceUri.upload.context;
let realnameInfoBaseUrl = json.serviceUri.realnameInfo.protocol + "://" + json.serviceUri.realnameInfo.serverHost + ":" + json.serviceUri.realnameInfo.port + json.serviceUri.realnameInfo.context;
let representationsBaseUrl = json.serviceUri.representations.protocol + "://" + json.serviceUri.representations.serverHost + ":" + json.serviceUri.representations.port + json.serviceUri.representations.context;
let evaluateBaseUrl = json.serviceUri.evaluate.protocol + "://" + json.serviceUri.evaluate.serverHost + ":" + json.serviceUri.evaluate.port + json.serviceUri.evaluate.context;
let aiBaseUrl = json.serviceUri.ai.protocol + "://" + json.serviceUri.ai.serverHost + ":" + json.serviceUri.ai.port + json.serviceUri.ai.context;
let chatBaseUrl = json.serviceUri.chat.protocol + "://" + json.serviceUri.chat.serverHost + ":" + json.serviceUri.chat.port + json.serviceUri.chat.context;
if (json.proxy===true){
    userBaseUrl = json.serviceUri.user.proxyPrefix+json.serviceUri.user.context;
    itineraryBaseUrl = json.serviceUri.itinerary.proxyPrefix+json.serviceUri.itinerary.context;
    onlineBaseUrl = json.serviceUri.onLine.proxyPrefix+json.serviceUri.onLine.context;
    orderBaseUrl = json.serviceUri.order.proxyPrefix+json.serviceUri.order.context;
    realnameInfoBaseUrl = json.serviceUri.realnameInfo.proxyPrefix+json.serviceUri.realnameInfo.context;
    representationsBaseUrl = json.serviceUri.representations.proxyPrefix+json.serviceUri.representations.context;
    evaluateBaseUrl = json.serviceUri.evaluate.proxyPrefix+json.serviceUri.evaluate.context;
    uploadBaseUrl = json.serviceUri.upload.proxyPrefix+json.serviceUri.upload.context;
    aiBaseUrl = json.serviceUri.ai.proxyPrefix+json.serviceUri.ai.context;
}
let urlObj={
    user:{
        login: userBaseUrl+json.serviceUri.user.login,
        updateCoordinates: userBaseUrl+json.serviceUri.user.updateCoordinates,
        searchLocation: userBaseUrl+json.serviceUri.user.searchLocation,
        loginTest: userBaseUrl+json.serviceUri.user.loginTest,
        applyForDriver: userBaseUrl+json.serviceUri.user.applyForDriver,
        findUserUsableCoupon: userBaseUrl+json.serviceUri.user.findUserUsableCoupon,
        decreaseCoupon: userBaseUrl+json.serviceUri.user.decreaseCoupon,

    },
    itinerary:{
        getPlan: itineraryBaseUrl+json.serviceUri.itinerary.getPlan,
        startItinerary: itineraryBaseUrl+json.serviceUri.itinerary.startItinerary,
        getAllVehicleType: itineraryBaseUrl+json.serviceUri.itinerary.getAllVehicleType,
        getAllItinerary: itineraryBaseUrl+json.serviceUri.itinerary.getAllItinerary,
        getNearbyOrders: itineraryBaseUrl+json.serviceUri.itinerary.getNearbyOrders,
        getOrder: itineraryBaseUrl+json.serviceUri.itinerary.getOrder,
        tripHistory: itineraryBaseUrl+json.serviceUri.itinerary.tripHistory,
        cancelItinerary: itineraryBaseUrl+json.serviceUri.itinerary.cancelItinerary,
        delItinerary: itineraryBaseUrl+json.serviceUri.itinerary.delItinerary,
        inProgress: itineraryBaseUrl+json.serviceUri.itinerary.inProgress,
        endItinerary: itineraryBaseUrl+json.serviceUri.itinerary.endItinerary,
        takeOrder: itineraryBaseUrl+json.serviceUri.itinerary.takeOrder,
    },
    onLine:{
        onlineVerification: onlineBaseUrl+json.serviceUri.onLine.onlineVerification
    },
    order:{
        loadMyOrder:orderBaseUrl+json.serviceUri.order.getAllOrders,
        paymentOrders:orderBaseUrl+json.serviceUri.order.paymentOrders,
        computeActualCost:orderBaseUrl+json.serviceUri.order.computeActualCost,
        refundOrders:orderBaseUrl+json.serviceUri.order.refundOrders,
    },
    upload:{
        uploadImage:uploadBaseUrl+json.serviceUri.upload.uploadImages,
    },
    realnameInfo:{
        isRealName: realnameInfoBaseUrl+json.serviceUri.realnameInfo.isRealName,
    },
    representations:{
        saveRepresentations: representationsBaseUrl+json.serviceUri.representations.saveRepresentations,
        findByItineraryId: representationsBaseUrl+json.serviceUri.representations.findByItineraryId,
    },
    evaluate:{
        evaluateItinerary: evaluateBaseUrl+json.serviceUri.evaluate.evaluateItinerary,
    },
    ai:{
        aiChat: aiBaseUrl+json.serviceUri.ai.aiChat
    },
    chat:{
        getHistoricalMessages: chatBaseUrl+json.serviceUri.chat.getHistoricalMessages,
    }

}
export default urlObj;
