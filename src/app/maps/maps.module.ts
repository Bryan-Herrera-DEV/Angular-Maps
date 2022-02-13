import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapScreenComponent } from "./screens/map-screen/map-screen.component";
import { MapViewComponent } from './components/map-view/map-view.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BtnMyLocationComponent } from './components/btn-my-location/btn-my-location.component';
import { LogoComponent } from './components/logo/logo.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PopupComponent } from './components/popup/popup.component';

@NgModule({
	declarations: [MapScreenComponent, MapViewComponent, LoadingComponent, BtnMyLocationComponent, LogoComponent, SearchBarComponent, SearchResultsComponent, NavbarComponent, PopupComponent],
	imports: [CommonModule],
	exports: [MapScreenComponent],
})
export class MapsModule {}
