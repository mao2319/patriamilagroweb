import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Mission } from "@/lib/missions";

// Color de cada ciudad mientras no tiene foto (el mismo orden que en el juego).
const CITY_COLORS = ["#2e8ce0", "#e0528c", "#f98c26", "#38a861", "#8c5ce6"];

// «Elige tu misión»: una tarjeta por mapa, con su foto (de /admin), estado y botón.
export default function MissionCards({ t, missions }: { t: Dictionary; missions: Mission[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {missions.map((mission) => {
        const ready = mission.status === "playable";
        return (
          <li
            key={mission.id}
            className="group flex flex-col overflow-hidden rounded-3xl border-4 border-game-violet bg-[#241a5c] shadow-[0_10px_0_rgba(10,5,40,0.45)] transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div
              className="relative aspect-[4/3] overflow-hidden"
              style={{
                backgroundColor: CITY_COLORS[(mission.order - 1) % CITY_COLORS.length],
              }}
            >
              {mission.photoUrl ? (
                <Image
                  src={mission.photoUrl}
                  alt={mission.city}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none ${ready ? "" : "grayscale-[35%]"}`}
                />
              ) : (
                <p className="game-outline flex h-full items-center justify-center px-3 text-center font-display text-4xl text-white sm:text-[2.6rem] lg:text-[2.2rem] xl:text-[2.6rem]">
                  {mission.city}
                </p>
              )}
              <span
                className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${ready ? "bg-game-green text-white" : "bg-black/60 text-white"}`}
              >
                {ready ? t.home.missionReady : t.home.missionSoon}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-display text-2xl leading-tight">{mission.title}</h3>
              <p className="flex-1 text-sm text-foreground/85">{mission.mission}</p>
              {ready ? (
                <Link
                  href="/jugar"
                  className="game-button mt-3 inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white bg-game-green font-display text-xl uppercase tracking-wide text-white"
                >
                  {t.home.missionPlay}
                </Link>
              ) : (
                <span
                  className="mt-3 inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-white/25 font-display text-xl uppercase tracking-wide text-white/60"
                  aria-disabled="true"
                >
                  {t.home.missionSoon}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
