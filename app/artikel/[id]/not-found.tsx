import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6b7c4f] text-white rounded-lg hover:bg-[#5a6a42] transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Artikel
        </Link>
      </div>
    </div>
  )
}