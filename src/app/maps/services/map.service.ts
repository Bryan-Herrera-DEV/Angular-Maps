import { Injectable } from "@angular/core";
import {
	AnySourceData,
	LngLatBounds,
	LngLatLike,
	Map,
	Marker,
	Popup,
} from "mapbox-gl";
import { DirectionsApiClient } from "../api/directionsApiClient";
import { DirectionsResponse, Route } from "../interfaces/directions";
import { Feature } from "../interfaces/places";

@Injectable({
	providedIn: "root",
})
export class MapService {
	private map?: Map;
	private markers: Marker[] = [];

	constructor(private directionsapi: DirectionsApiClient) {}
	get IsMapReady() {
		return !!this.map;
	}

	setMap(map: Map) {
		this.map = map;
	}

	flyTo(coords: LngLatLike) {
		if (!this.map) {
			throw new Error("Map is not ready");
		}
		this.map?.flyTo({
			center: coords,
			zoom: 17,
			speed: 1.5, // make the flying slow
			curve: 1, // change the speed at which it zooms out
			easing: (t) => t,

			// this animation is considered essential with respect to prefers-reduced-motion
			essential: true,
		});
	}
	createMarekersFromPlaces(places: Feature[], userLocation: [number, number]) {
		if (!this.map) throw new Error("Map is not ready");
		this.markers.forEach((marker) => marker.remove());
		const newMarkers = [];

		for (const place of places) {
			const [lng, lat] = place.center;
			const popUp = new Popup().setHTML(`
			<h6>${place.text}</h6>
			<span>${place.place_name}</span>
			`);
			const newMarker = new Marker()
				.setLngLat([lng, lat])
				.setPopup(popUp)
				.addTo(this.map);

			newMarkers.push(newMarker);
		}
		if (places.length === 0) return;
		this.markers = newMarkers;
		// limites del mapa
		const bounds = new LngLatBounds();

		newMarkers.forEach((marker) => bounds.extend(marker.getLngLat()));
		bounds.extend(userLocation);
		this.map.fitBounds(bounds, {
			padding: 200,
			speed: 1.5,
			curve: 1,
			easing: (t) => t,
			essential: true,
		});
	}
	getRouteBetweenPoints(start: [number, number], end: [number, number]) {
		this.directionsapi
			.get<DirectionsResponse>(`/${start.join(",")};${end.join(",")}`)
			.subscribe((resp: DirectionsResponse) => {
				this.drawPolyline(resp.routes[0]);
			});
	}

	private drawPolyline(route: Route) {
		console.log({
			kms: route.distance / 1000,
			duration: route.duration / 60,
		});
		if (!this.map) throw new Error("Map is not ready");
		const coords = route.geometry.coordinates;

		const bounds = new LngLatBounds();

		coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
		this.map.fitBounds(bounds, {
			padding: 200,
			speed: 1.5,
			curve: 1,
			easing: (t) => t,
			essential: true,
		});
		const sourceData: AnySourceData = {
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: [
					{
						type: "Feature",
						properties: {},
						geometry: {
							type: "LineString",
							coordinates: coords,
						},
					},
				],
			},
		};
		// limpiar ruta previa
		if (this.map.getLayer("RouteString")) {
			this.map.removeLayer("RouteString");
			this.map.removeSource("RouteString");
		}
		this.map.addSource("RouteString", sourceData);
		this.map.addLayer({
			id: "RouteString",
			type: "line",
			source: "RouteString",
			layout: {
				"line-cap": "round",
				"line-join": "round",
			},
			paint: {
				"line-color": "#3bb2d0",
				"line-width": 3,
			},
		});
	}
}
