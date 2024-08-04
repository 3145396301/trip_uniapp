
import json from "./url.json";
let userBaseUrl = json.serviceUri.user.protocol + "://" + json.serviceUri.user.serverHost + ":" + json.serviceUri.user.port + json.serviceUri.user.context;
let itineraryBaseUrl = json.serviceUri.itinerary.protocol + "://" + json.serviceUri.itinerary.serverHost + ":" + json.serviceUri.itinerary.port + json.serviceUri.itinerary.context;
let onlineBaseUrl = json.serviceUri.onLine.protocol + "://" + json.serviceUri.onLine.serverHost + ":" + json.serviceUri.onLine.port + json.serviceUri.onLine.context;
let orderBaseUrl = json.serviceUri.order.protocol + "://" + json.serviceUri.order.serverHost + ":" + json.serviceUri.order.port + json.serviceUri.order.context;
if (json.proxy===true){
    userBaseUrl = json.serviceUri.user.proxyPrefix+json.serviceUri.user.context;
    itineraryBaseUrl = json.serviceUri.itinerary.proxyPrefix+json.serviceUri.itinerary.context;
    onlineBaseUrl = json.serviceUri.onLine.proxyPrefix+json.serviceUri.onLine.context;
    orderBaseUrl = json.serviceUri.order.proxyPrefix+json.serviceUri.order.context;
}
let urlObj={
    user:{
        login: userBaseUrl+json.serviceUri.user.login,
        updateCoordinates: userBaseUrl+json.serviceUri.user.updateCoordinates,
        searchLocation: userBaseUrl+json.serviceUri.user.searchLocation,
        loginTest: userBaseUrl+json.serviceUri.user.loginTest,
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
        evaluateItinerary: itineraryBaseUrl+json.serviceUri.itinerary.evaluateItinerary,
        inProgress: itineraryBaseUrl+json.serviceUri.itinerary.inProgress,
        endItinerary: itineraryBaseUrl+json.serviceUri.itinerary.endItinerary,
        takeOrder: itineraryBaseUrl+json.serviceUri.itinerary.takeOrder,
    },
    onLine:{
        onlineVerification: onlineBaseUrl+json.serviceUri.onLine.onlineVerification
    },
    order:{
        loadMyOrder:orderBaseUrl+json.serviceUri.order.getAllOrders
    }
}
export default urlObj;
