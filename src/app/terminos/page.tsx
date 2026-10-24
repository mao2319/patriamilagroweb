import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Términos del servicio · Firme por la Patria" };

export default function Terminos() {
  return (
    <LegalPage title="Términos del servicio" updated="23 de octubre de 2026">
      <p>
        Estos términos regulan el uso de «Firme por la Patria» (el «juego»), desarrollado por Mauricio Campos. Al tocar «Aceptar» en el
        juego confirmas que los leíste y que los aceptas.
      </p>
      <h2>1. El juego</h2>
      <p>
        Es un juego de ficción. Los personajes, los sospechosos, los alias y los hechos son inventados y cualquier parecido con personas
        reales es coincidencia. La versión web es una demo gratuita con contenido limitado.
      </p>
      <h2>2. Edad</h2>
      <p>
        Te pedimos tu edad para ajustar la experiencia. Si eres menor de edad, usa el juego con permiso y acompañamiento de tu madre, padre o
        acudiente.
      </p>
      <h2>3. Uso permitido</h2>
      <ul>
        <li>Juega de forma personal y no comercial.</li>
        <li>No intentes alterar el juego, sus puntajes ni sus servidores.</li>
        <li>No uses nombres de jugador ofensivos ni que suplanten a otra persona.</li>
      </ul>
      <h2>4. Monedas y artículos</h2>
      <p>Las monedas y los artículos del juego no tienen valor en dinero, no se pueden cambiar por dinero y pueden ajustarse para mantener el equilibrio del juego.</p>
      <h2>5. Cuenta</h2>
      <p>Si conectas tu correo, eres responsable de mantenerlo seguro. Podemos suspender cuentas que incumplan estos términos.</p>
      <h2>6. Cambios</h2>
      <p>Podemos actualizar el juego y estos términos. Si el cambio es importante, te lo pediremos aceptar de nuevo.</p>
      <h2>7. Contacto</h2>
      <p>Escríbenos a mauricio.campos.oviedo@gmail.com.</p>
    </LegalPage>
  );
}
