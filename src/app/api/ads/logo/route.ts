// Logo de una pauta servido desde el portal (el juego carga imágenes del mismo
// sitio). Solo trae imágenes del Blob del proyecto.
const BLOB = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//;

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("u") ?? "";
  if (!BLOB.test(url)) return new Response("No encontrado", { status: 404 });
  const response = await fetch(url);
  if (!response.ok || !(response.headers.get("content-type") ?? "").startsWith("image/")) return new Response("No encontrado", { status: 404 });
  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
