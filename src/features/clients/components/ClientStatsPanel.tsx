type ClientStatsPanelProps = {
  totalClients: number;
  filteredClients: number;
};

export function ClientStatsPanel({
  totalClients,
  filteredClients,
}: ClientStatsPanelProps) {
  const stats = [
    { label: "Total de clientes", value: totalClients },
    { label: "Resultado da busca", value: filteredClients },
    { label: "Clientes ativos", value: totalClients },
    { label: "Dossiês vinculados", value: "V2" },
  ];

  return (
    <div className="cj-stats-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="cj-stat-card">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </div>
  );
}
