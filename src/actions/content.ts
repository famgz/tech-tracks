"use server";

import { db } from "@/lib/prisma";

export async function getTrackById(trackId: string) {
  return db.track.findUnique({ where: { id: trackId } });
}
