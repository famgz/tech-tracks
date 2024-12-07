import { getSessionUserElseRedirectToLogin } from "@/actions/auth";
import { getAllUserTracksForUser } from "@/actions/user-content";
import TrackSlot from "@/app/(site)/user/_components/track-slot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { translate } from "@/lib/translate";
import { Track } from "@prisma/client";

export default async function UserPage() {
  const user = await getSessionUserElseRedirectToLogin();
  const userTracks = await getAllUserTracksForUser();

  const enrolledTracks = userTracks?.filter((t) => t.isEnrolled);
  const completedTracks = userTracks?.filter((t) => t.isCompleted);
  const bookmarkedTracks = userTracks?.filter((t) => t.isBookmarked);

  return (
    <div className="_container flex-center flex-col py-10">
      <Card className="w-full max-w-5xl flex-1">
        <CardHeader className="items-center gap-6">
          <div className="flex-center flex-col gap-2">
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="text-center">
              <span className="block">{user.email}</span>
              <span className="capitalze block">({translate(user.role)})</span>
            </CardDescription>
          </div>

          <Avatar className="size-32">
            <AvatarImage src={user.image || ""} alt="user avatar" />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardHeader>

        <CardContent>
          {!userTracks ? (
            <span>
              Ocorreu um erro ao buscar os dados. Tente novamente mais tarde
            </span>
          ) : (
            <div className="space-y-10">
              <div className="space-y-2">
                <h2 className="text-lg">Trilhas matriculadas</h2>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: USER_MAX_TRACK_SLOTS }).map((_, i) => {
                    const track = enrolledTracks?.[i]?.Track;
                    return (
                      <TrackSlot key={i} track={track as Track} type="enroll" />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg">Trilhas finalizadas</h2>
                {completedTracks && completedTracks.length > 0 ? (
                  <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                    {completedTracks.map(({ Track }) => (
                      <TrackSlot key={Track.id} track={Track} />
                    ))}
                  </div>
                ) : (
                  <p className="py-10 text-center text-muted-foreground">
                    Nenhuma trilha finalizada até o momento
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-lg">Lista de interesse</h2>

                {bookmarkedTracks && bookmarkedTracks.length > 0 ? (
                  <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                    {bookmarkedTracks.map(({ Track }) => (
                      <TrackSlot key={Track.id} track={Track} type="bookmark" />
                    ))}
                  </div>
                ) : (
                  <p className="py-10 text-center text-muted-foreground">
                    Nenhuma trilha salva até o momento
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
