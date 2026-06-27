import KaryaClient, { Karya } from "./KaryaClient"

async function getKaryaData(): Promise<Karya[]> {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  try {
    const res = await fetch(`${api}/api/karya?status=DITERIMA`, {
      next: { revalidate: 10 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export default async function KaryaSiswaPage() {
  const karyas = await getKaryaData()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  return <KaryaClient initialData={karyas} apiUrl={apiUrl} />
}