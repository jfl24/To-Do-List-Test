"use server";

import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";

export async function creerTache(formData: FormData) {
  const titre = String(formData.get("titre")).trim();
  const description = String(formData.get("description") || "").trim();
  if (!titre) return;

  await prisma.tache.create({
    data: { titre, description: description || null },
  });
  revalidatePath("/");
}

export async function supprimerTache(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.tache.delete({ where: { id } });
  revalidatePath("/");
}

export async function basculterStatut(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  await prisma.tache.update({
    where: { id },
    data: { status: status as any },
  });

  revalidatePath("/");
}

export async function modifierTache(formData: FormData) {
  const id = Number(formData.get("id"));
  const titre = String(formData.get("titre"));
  const description = String(formData.get("description"));
  await prisma.tache.update({
    where: { id },
    data: { titre, description: description || null },
  });
  revalidatePath("/");
  redirect("/");
}

const typeAccepte = ["image/jpeg", "image/png", "application/pdf"];
const tailleMax = 4 * 1024 * 1024;

export async function ajouterPiece(formData: FormData) {
  const tacheId = Number(formData.get("tacheId"));
  const fichier = formData.get("fichier");

  if (!Number.isInteger(tacheId)) {
    return;
  }

  if (!(fichier instanceof File)) {
    return;
  }

  if (!typeAccepte.includes(fichier.type)) {
    return;
  }

  if (fichier.size > tailleMax) return;

  const tache = await prisma.tache.findUnique({
    where: {
      id: tacheId,
    },
  });

  if (!tache) return;

  const nomPropre = fichier.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .slice(-60);
  const cle = `taches/${tacheId}/${crypto.randomUUID()}-${nomPropre}`;

  const objet = await put(cle, fichier, {
    access: "public",
    contentType: fichier.type,
  });

  await prisma.piece.create({
    data: {
      cle: objet.pathname,
      nom: fichier.name,
      url: objet.url,
      typeMime: fichier.type,
      taille: fichier.size,
      tacheId,
    },
  });

  revalidatePath(`/taches/${tacheId}`);
}

export async function supprimerPiece(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) return;

  const piece = await prisma.piece.findUnique({ where: { id } });

  if (!piece) return;

  await del(piece.url);

  await prisma.piece.delete({ where: { id } });

  revalidatePath(`/taches/${piece.tacheId}`);
}
