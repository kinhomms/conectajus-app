import { LegalPage } from "@/features/legal/components/LegalPage";
import { privacyPolicyContent } from "@/features/legal/content/legalPages";

export default function PrivacyPage() {
  return <LegalPage content={privacyPolicyContent} />;
}
