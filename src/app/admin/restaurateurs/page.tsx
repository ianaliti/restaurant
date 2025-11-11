import Link from "next/link";

const restaurateurs = [
  { id: 1, name: "Le clos des sens", email: "contact@gmail.com" },
  { id: 2, name: "Le clos des sens", email: "contact@gmail.com" },
];

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Restaurants</h1>
        <Link href="/admin/restaurateurs/new" className="h-9 inline-flex items-center rounded-md bg-primary px-3 text-white text-sm">Ajouter un restaurateur</Link>
      </div>
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2">Nom</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurateurs.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2 text-right">
                  <button className="text-xs rounded-md bg-red-500 px-3 py-1 text-white">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


