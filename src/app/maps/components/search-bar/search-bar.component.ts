import { Component, OnInit } from "@angular/core";
import { PlacesService } from "../../services";

@Component({
	selector: "app-search-bar",
	templateUrl: "./search-bar.component.html",
	styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent implements OnInit {
	constructor(private placesSerevices: PlacesService) {}
	private debounce?: NodeJS.Timeout;
	onQuerySearch(query: string = "") {
		if (this.debounce) {
			clearTimeout(this.debounce);
		}
		this.debounce = setTimeout(() => {
			this.placesSerevices.getPlacesByQuery(query);
		}, 700);
	}

	ngOnInit(): void {}
}
