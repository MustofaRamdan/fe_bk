import ArtikelClient, { Post } from "./ArtikelClient"

async function getArtikelData(): Promise<Post[]> {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  try {
    const res = await fetch(`${api}/api/posts`, {
      next: { revalidate: 10 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export default async function ArtikelPage() {
  const posts = await getArtikelData()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  return <ArtikelClient initialData={posts} apiUrl={apiUrl} />
}