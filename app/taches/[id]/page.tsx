import { modifierTache } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ajouterPiece, supprimerPiece } from "@/app/actions";

// export default async function Editer({
//   params,
// }: {
//   params: Promise<{ id: String }>;
// }) {
//   const { id } = await params;
//   const tache = await prisma.tache.findUnique({
//     where: { id: Number(id) },
//     include: { pieces },
//   });

//   if (!tache) notFound();
//   return (
//     <>
//       <h1>Modifier la tache</h1>
//       <form action={modifierTache}>
//         <input type="hidden" name="id" value={tache.id} />
//         <input type="text" name="titre" defaultValue={tache.titre} required />
//         <textarea
//           name="description"
//           defaultValue={tache.description ?? ""}
//           required
//         />
//         <div className="flex flex-col gap-2">
//           <button>Enregistrer</button>
//           <a href="/">Retourner à la page principale</a>
//         </div>
//       </form>
//     </>
//   );
// }

export default async function Page({
  params,
}: {
  params: Promise<{ id: String }>;
}) {
  const { id } = await params;
  const tache = await prisma.tache.findUnique({
    where: { id: Number(id) },
    include: { pieces: { orderBy: { createdAt: "desc" } } },
  });

  if (!tache) return <p>Tache introuvable</p>;

  return (
    <main>
      <h1>{tache.titre}</h1>
      <p>{tache.description ?? "pas de description"}</p>

      <h2>Pieces Jointes ({tache.pieces.length})</h2>

      <form action={ajouterPiece}>
        <input type="hidden" name="tacheId" value={tache.id} />
        <input
          type="file"
          name="fichier"
          accept="image/jpeg, image/png, application/pdf"
          required
        />
        <button style={{ padding: "8px 14px" }}>Joindre un fichier</button>
      </form>

      <ul>
        {tache.pieces.map((p) => (
          <li key={p.id}>
            {p.typeMime.startsWith("image/") ? (
              <img src={p.url} alt={p.nom} width={200} />
            ) : (
              <a href={p.url} target="_blank">
                {p.nom}
              </a>
            )}
            <div>
              {p.nom} - {(p.taille / 1024).toFixed(0)} Ko
            </div>
            <form action={supprimerPiece}>
              <input type="hidden" name="id" value={p.id} />
              <button>Supprimer</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
