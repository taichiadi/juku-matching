import ChatClient from "./ChatClient";

export default async function ConsultPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ChatClient token={token} />;
}
