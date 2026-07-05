type ClientStatusBadgeProps = {
  status?: string | null;
};

const statusMap: Record<string, string> = {
  ativo: "cj-badge cj-badge-success",
  urgente: "cj-badge cj-badge-danger",
  arquivado: "cj-badge cj-badge-muted",
  inadimplente: "cj-badge cj-badge-danger",
  "aguardando documentos": "cj-badge cj-badge-warning",
  administrativo: "cj-badge cj-badge-info",
  judicial: "cj-badge cj-badge-primary",
};

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase().trim() || "ativo";
  const className = statusMap[normalizedStatus] || "cj-badge cj-badge-primary";

  return (
    <span className={className}>
      {status || "Ativo"}
    </span>
  );
}
