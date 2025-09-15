type PageProps = { params: Promise<{ slug: string }> };

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  return <main className="p-6">Tag: {slug}</main>;
}
