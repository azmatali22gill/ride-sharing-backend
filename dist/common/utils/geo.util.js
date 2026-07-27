"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.haversineDistanceKm = haversineDistanceKm;
exports.estimateDurationMinutes = estimateDurationMinutes;
const EARTH_RADIUS_KM = 6371;
function toRad(value) {
    return (value * Math.PI) / 180;
}
function haversineDistanceKm(a, b) {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return EARTH_RADIUS_KM * c;
}
function estimateDurationMinutes(distanceKm, avgSpeedKmH = 25) {
    return (distanceKm / avgSpeedKmH) * 60;
}
//# sourceMappingURL=geo.util.js.map