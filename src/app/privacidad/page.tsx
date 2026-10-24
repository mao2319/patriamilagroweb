import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Política de privacidad · Firme por la Patria" };

export default function Privacidad() {
  return (
    <LegalPage title="Política de privacidad" updated="23 de octubre de 2026">
      <p>Esta política explica qué datos usa «Firme por la Patria» y para qué, de acuerdo con la Ley 1581 de 2012 de Colombia.</p>
      <h2>1. Qué datos usamos</h2>
      <ul>
        <li>Tu edad (la que eliges al empezar), para ajustar la experiencia.</li>
        <li>Tu progreso: nivel, monedas, artículos, misiones y puntajes.</li>
        <li>Tu nombre de jugador.</li>
        <li>Tu correo, solo si decides conectar tu cuenta.</li>
        <li>Tu país aproximado, para el ranking por país.</li>
      </ul>
      <h2>2. Dónde se guardan</h2>
      <p>
        En la versión web, el progreso se guarda en tu navegador. Si conectas tu correo, se guarda también en nuestros servidores para que no
        lo pierdas.
      </p>
      <h2>3. Para qué</h2>
      <p>Para que puedas jugar, guardar tu progreso, aparecer en el ranking y recibir el código de verificación de tu cuenta. No vendemos tus datos.</p>
      <h2>4. Menores de edad</h2>
      <p>Si eres menor de edad, pide a tu madre, padre o acudiente que lea esta política contigo antes de conectar un correo.</p>
      <h2>5. Tus derechos</h2>
      <p>Puedes pedir conocer, corregir o borrar tus datos escribiendo a mauricio.campos.oviedo@gmail.com.</p>
    </LegalPage>
  );
}
