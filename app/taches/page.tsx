import { prisma } from "@/lib/prisma";

export default async function Page() {
  const taches = await prisma.tache.findMany();

  return (
    <>
      <h1>Ma liste de taches</h1>
      <ul>
        {taches.map((t) => (
          <li key={t.id}>
            <a href={`taches/${t.id}`}>
              {t.titre} : {t.description}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
