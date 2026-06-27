import HomepageClient, { HomepageData } from "./HomepageClient"

async function getHomepageData(): Promise<HomepageData | null> {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  try {
    const res = await fetch(`${api}/api/homepage`, {
      next: { revalidate: 10 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as HomepageData
  } catch {
    return null
  }
}

export default async function Homepage() {
  const data = await getHomepageData()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#dc2626" }}>
        Gagal memuat data homepage. Silakan coba lagi nanti.
      </div>
    )
  }

  return <HomepageClient initialData={data} apiUrl={apiUrl} />
}
