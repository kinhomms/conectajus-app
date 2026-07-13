import * as processesRepository from "@/features/processes/repositories/processes.repository";

export async function listProcesses() {
  return processesRepository.listProcesses();
}
