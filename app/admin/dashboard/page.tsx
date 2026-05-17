// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { redirect } from "next/navigation"

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions)

//   if (!session) {
//     redirect("/api/auth/signin")
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Dashboard Admin</h1>
//       <p>Selamat datang, {session.user?.email}</p>
//     </div>
//   )
// }