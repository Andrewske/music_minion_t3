import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import type { UsersTopTracksResponse } from "~/types/spotify";

import checkAuth from "~/server/actions/spotify/checkAuth";

export const spotifyRouter = createTRPCRouter({
  getTopTracks: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx?.session?.user;

    try {
      const accessToken = await checkAuth({ userId: user?.id });

      console.log(accessToken);

      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = (await response.json()) as UsersTopTracksResponse;

      console.log(data);
      return null;
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }),
});
