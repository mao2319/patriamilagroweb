import { connectionCountry, countryName } from "@/lib/countries";

// País de la conexión para el juego: código, nombre en español y la bandera
// (servida desde este mismo sitio para que el juego la pueda cargar).
export async function GET(request: Request) {
  const country = connectionCountry(request);
  const body = country ? { country, name: countryName(country), flag: `/api/flag?c=${country}` } : { country: "", name: "", flag: "" };
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
