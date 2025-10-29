export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Mon Restaurant</h1>
      <form className="space-y-3 max-w-sm">
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Le clos des sens" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="18 Rue Jean Mermoz" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="74000" />
        <input className="w-full h-9 rounded-md border px-3 text-sm" placeholder="Annecy" />
        <button type="submit" className="h-9 rounded-md bg-primary px-4 text-white text-sm">Modifier</button>
      </form>
    </div>
  );
}


