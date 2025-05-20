import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>History</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>Your listening history will appear here.</p>
    </div>
  );
} 