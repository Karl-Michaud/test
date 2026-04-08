import { BugDetailView } from "@/features/bugs/views/BugDetailView";

export default async function BugPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BugDetailView bugId={id} />;
}
