import { PublicLawyerProfileWorkspace } from "@/features/lawyers/components/PublicLawyerProfileWorkspace";

export default async function PublicLawyerProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return <PublicLawyerProfileWorkspace userId={userId} />;
}
