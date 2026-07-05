type ClientEmptyStateProps = {
  title?: string;
  description?: string;
};

export function ClientEmptyState({
  title = "Nenhum cliente encontrado",
  description = "Ajuste os filtros ou cadastre um novo cliente para começar.",
}: ClientEmptyStateProps) {
  return (
    <div className="cj-empty-state">
      <div className="cj-empty-icon">👥</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
