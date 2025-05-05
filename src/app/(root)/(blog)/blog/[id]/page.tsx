import BlogComponent from "./BlogPage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogPage({ params }: any) {
  return <BlogComponent id={params.id} />;
}