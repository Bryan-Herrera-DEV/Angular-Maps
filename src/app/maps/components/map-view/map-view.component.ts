import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Map, Popup, Marker } from "mapbox-gl";
import { MapService, PlacesService } from "../../services";

@Component({
	selector: "app-map-view",
	templateUrl: "./map-view.component.html",
	styleUrls: ["./map-view.component.scss"],
})
export class MapViewComponent implements AfterViewInit {
	@ViewChild("mapDiv")
	mapDivElement!: ElementRef;
	constructor(
		private placesServcies: PlacesService,
		private mapServices: MapService
	) {}

	ngAfterViewInit(): void {
		if (!this.placesServcies.userLocation) {
			throw new Error("User location is not ready");
		}
		const map = new Map({
			container: this.mapDivElement.nativeElement, // container ID
			style: "mapbox://styles/mapbox/streets-v11", // style URL
			center: this.placesServcies.userLocation, // starting position [lng, lat]
			zoom: 9, // starting zoom
		});
		const popUp = new Popup().setHTML(`
      <h6>Aqui estoy</h6>
      <span>I stay here</span>
    `);
		new Marker({ color: "red" })
			.setLngLat(this.placesServcies.userLocation)
			.setPopup(popUp)
			.addTo(map);
		this.mapServices.setMap(map);
	}
}
