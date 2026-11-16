import { parseIsoDate, toIsoDate, today } from "@/lib/calendar";
import CreateForm from "@/components/opret/CreateForm";

const TYPES = ["paamindelse", "note", "begivenhed"];

// /opret?type=note&dato=2026-11-13 – both are optional
export default async function CreatePage({ searchParams }) {
  const { type, dato } = await searchParams;
  const date = parseIsoDate(dato) ?? today();

  return (
    <CreateForm
      initialType={TYPES.includes(type) ? type : "paamindelse"}
      initialDate={toIsoDate(date)}
    />
  );
}
