import Image from "next/image";
import { basculterStatut, creerTache, supprimerTache } from "./actions";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const taches = await prisma.tache.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>Liste des taches </h1>

      <form action={creerTache}>
        <input name="titre" placeholder="Nouvelle tache ... " required />
        <input
          name="description"
          placeholder="Donnez une description pour cette tache ..."
        />
        <button style={{ padding: "8px 14px" }}>Ajouter</button>
      </form>

      <ul>
        {taches.map((t) => (
          <li key={t.id}>
            <span
              style={{
                textDecoration:
                  t.status === "TERMINE" ? "line-through" : "none",
              }}
            >
              <b>{t.titre}</b>{" "}
              {t.description ? `${t.description}` : "pas de description"} {"  "}
              <em>({t.status})</em>
            </span>
            <a href={`/taches/${t.id}`}>Modifier</a>
            <form action={basculterStatut}>
              <input type="hidden" name="id" value={t.id} />
              <input
                type="hidden"
                name="status"
                value={t.status === "TERMINE" ? "A_FAIRE" : "TERMINE"}
              />
              <button>{t.status === "TERMINE" ? "A_FAIRE" : "TERMINER"}</button>
            </form>
            <form action={supprimerTache}>
              <input type="hidden" name="id" value={t.id} />
              <button>X</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
