import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MapService } from ".";
import { PlacesApiClient } from "../api/placesApiClient";
import { Feature, PlacesResponse } from "../interfaces/places";

@Injectable({
	providedIn: "root",
})
export class PlacesService {
	public userLocation?: [number, number];
	public isLoadingPlaces: boolean = false;
	public places: Feature[] = [];

	get isUserLocationReady(): boolean {
		return !!this.userLocation;
	}

	constructor(private http: PlacesApiClient, private mapservices: MapService) {
		this.getUserLocation();
	}
	public async getUserLocation(): Promise<[number, number]> {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(
				({ coords }) => {
					this.userLocation = [coords.latitude, coords.longitude];
					resolve(this.userLocation);
				},
				(err) => {
					alert("Could not get your location. Please enable location services.");
					reject(err);
				}
			);
		});
	}

	getPlacesByQuery(query: string = "") {
		//evaluar cuando no hay query
		if (!this.userLocation) throw new Error("User location is not ready");
		if (query.length === 0) {
			this.isLoadingPlaces = false;
			this.places = [];
			return;
		}
		this.isLoadingPlaces = true;
		this.http
			.get<PlacesResponse>(`/${query}.json`, {
				params: {
					proximity: this.userLocation.join(","),
				},
			})
			.subscribe(
				(data: PlacesResponse) => {
					console.log(data);
					this.isLoadingPlaces = false;
					this.places = data.features;

					this.mapservices.createMarekersFromPlaces(this.places, this.userLocation!);
				},
				(err: any) => {
					console.log(err);
					this.isLoadingPlaces = false;
				}
			);
	}
	deletePlaces() {
		this.places = [];
	}
}
