import { LegalPage } from "@/features/legal/components/LegalPage";
import { termsContent } from "@/features/legal/content/legalPages";

export default function TermsPage() {
  return <LegalPage content={termsContent} />;
}
