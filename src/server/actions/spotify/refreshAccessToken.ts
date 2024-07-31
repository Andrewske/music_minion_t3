import { eq } from "drizzle-orm";
import { decodeFormState } from "next/dist/server/app-render/entry-base";
import "server-only";

import { env } from "~/env";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import type {
  SpotifyAuthErrorResponse,
  SpotifyTokenResponse,
} from "~/types/spotify";

export async function refreshAccessToken(token: string) {
  console.log("Refreshing access token");
  try {
    const url = "https://accounts.spotify.com/api/token";

    const clientIdSecret = `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`;
    let authHeader = "";
    if (typeof Buffer === "undefined") {
      // Fallback for environments without Buffer, e.g., browsers
      authHeader = "Basic " + btoa(clientIdSecret);
    } else {
      // Use Buffer for Node.js environments
      authHeader = "Basic " + Buffer.from(clientIdSecret).toString("base64");
    }

    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token,
      }),
      json: true,
    };
    const response = await fetch(url, authOptions);

    if (!response.ok) {
      throw response;
    }

    const refreshedToken = (await response.json()) as SpotifyTokenResponse;
    console.log("Refreshed access token successfully");

    return refreshedToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error refreshing access token", error.message);
      throw error;
    }

    if (error instanceof Response) {
      const spotifyError = (await error.json()) as SpotifyAuthErrorResponse;
      console.error("Error refreshing access token", spotifyError);
      throw spotifyError;
    }

    throw error;
  }
}
