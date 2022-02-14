import { Component } from "@angular/core";
import { MapService, PlacesService } from "../../services";

@Component({
	selector: "app-btn-my-location",
	templateUrl: "./btn-my-location.component.html",
	styleUrls: ["./btn-my-location.component.scss"],
})
export class BtnMyLocationComponent {
	constructor(
		private mapService: MapService,
		private placesServices: PlacesService
	) {}
	goToMyLocation() {
		if (!this.placesServices.isUserLocationReady) {
			throw new Error("User location is not ready");
		}
		if (!this.mapService.isMapReady) {
			throw new Error("Map is not ready");
		}
		this.mapService.flyTo(this.placesServices.userLocation!);
	}
}
