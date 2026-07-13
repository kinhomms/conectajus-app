import * as documentsRepository from "@/features/documents/repositories/documents.repository";

export async function listDocuments() {
  return documentsRepository.listDocuments();
}

export async function listCitizenDocuments(userId: string) {
  return documentsRepository.listCitizenDocuments(userId);
}

export async function uploadCitizenDocument(
  userId: string,
  file: File,
  notes: string,
  opportunityId?: string,
) {
  const uploadResponse = await documentsRepository.uploadCitizenDocumentFile(userId, file);

  if (uploadResponse.error) {
    return {
      data: null,
      error: uploadResponse.error,
      linkError: null,
    };
  }

  const documentResponse = await documentsRepository.createCitizenDocument({
    file_name: file.name,
    file_path: uploadResponse.filePath,
    file_size: file.size,
    mime_type: file.type || null,
    notes: notes.trim() || null,
    user_id: userId,
  });

  if (documentResponse.error || !documentResponse.data || !opportunityId) {
    return {
      ...documentResponse,
      linkError: null,
    };
  }

  const linkResponse = await documentsRepository.appendCitizenDocumentToMarketplaceOpportunity(
    opportunityId,
    userId,
    documentResponse.data.id,
  );

  return {
    ...documentResponse,
    linkError: linkResponse.error ?? null,
  };
}

export async function createCitizenDocumentSignedUrl(filePath: string) {
  return documentsRepository.createCitizenDocumentSignedUrl(filePath);
}