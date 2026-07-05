type ClientSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ClientSearchBar({ value, onChange }: ClientSearchBarProps) {
  return (
    <div className="cj-search-card">
      <label className="cj-search-label" htmlFor="client-search">
        Pesquisa inteligente
      </label>
      <input
        id="client-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por nome, CPF, e-mail, telefone ou cidade..."
        className="cj-search-input"
      />
    </div>
  );
}
