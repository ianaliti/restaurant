export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Ajouter un restaurateur</h1>
      <form className="space-y-3 max-w-sm">
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Nom" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Adresse" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Code Postal" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Ville" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Email" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" type="password" placeholder="Password" />
        <button type="submit" className="h-9 rounded-md bg-primary px-4 text-white text-sm">Ajouter</button>
      </form>
    </div>
  );
}


