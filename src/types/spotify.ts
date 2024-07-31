export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyAuthErrorResponse {
  error: string;
  error_description: string;
}

export interface SpotifyApiResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface SpotifyImageObject {
  height: number | null;
  url: string;
  width: number | null;
}

export interface UsersTopTracksResponse extends SpotifyApiResponse {
  items: SpotifyTrack[];
}

interface ExternalUrls {
  spotify: string;
}

interface ExternalIds {
  isrc: string;
}

interface SpotifyArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface SpotifyTrackAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: SpotifyArtist[];
}

interface SpotifyTrack {
  album: SpotifyTrackAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url?: string | null; // Optional because it might not always be present
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}
