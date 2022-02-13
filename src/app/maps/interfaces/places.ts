export interface PlacesResponse {
	type: string;
	query: string[];
	features: Feature[];
	attribution: string;
}

export interface Feature {
	id: string;
	type: string;
	place_type: string[];
	relevance: number;
	properties: Properties;
	text_es: string;
	language_es?: Language;
	place_name_es: string;
	text: string;
	language?: Language;
	place_name: string;
	bbox?: number[];
	center: number[];
	geometry: Geometry;
	context: Context[];
	matching_text?: string;
	matching_place_name?: string;
}

export interface Context {
	id: string;
	wikidata?: string;
	text_es: string;
	language_es?: Language;
	text: string;
	language?: Language;
	short_code?: string;
}

export enum Language {
	Es = "es",
}

export interface Geometry {
	type: string;
	coordinates: number[];
}

export interface Properties {
	wikidata?: string;
	accuracy?: string;
}
