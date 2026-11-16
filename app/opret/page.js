import { parseIsoDate, toIsoDate, today } from "@/lib/calendar";
import CreateForm from "@/components/opret/CreateForm";

// Siden hvor man opretter en påmindelse, note eller begivenhed.
// Adressen kan være fx /opret?type=note&dato=2026-11-13 (begge dele kan udelades)
export default async function CreatePage({ searchParams }) {
  const params = await searchParams;

  // Hvilken knap der er valgt øverst. Påmindelse, hvis der ikke står noget.
  let type = "paamindelse";
  if (params.type === "note" || params.type === "begivenhed") {
    type = params.type;
  }

  // Dagen der oprettes på. I dag, hvis der ikke står nogen dato.
  let date = parseIsoDate(params.dato);
  if (!date) {
    date = today();
  }

  return <CreateForm initialType={type} initialDate={toIsoDate(date)} />;
}
