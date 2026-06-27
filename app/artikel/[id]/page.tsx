import ArtikelDetailClient, { PostDetail } from "./ArtikelDetailClient"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPostDetail(id: string): Promise<PostDetail | null> {
  const api = process.env.NEXT_PUBLIC_API_URL || ""
  try {
    const res = await fetch(`${api}/api/posts/${id}`, {
      next: { revalidate: 10 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as PostDetail
  } catch {
    return null
  }
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPostDetail(id)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#dc2626" }}>
        Artikel tidak ditemukan atau gagal dimuat.
      </div>
    )
  }

  return <ArtikelDetailClient post={post} apiUrl={apiUrl} />
}