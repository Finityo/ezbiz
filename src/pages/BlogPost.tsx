import SEOHead from "@/components/SEOHead";
import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { getBlogBySlug, blogPosts } from "@/content/blogPosts";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogBySlug(slug) : undefined;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | EZ BIZ FILE SERVICE`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", post.metaDescription);
    }
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  const renderContent = (md: string) => {
    return md
      .split("\n")
      .map((line) => {
        if (line.startsWith("### ")) return `<h3 class="text-xl font-semibold text-foreground mt-8 mb-3">${line.slice(4)}</h3>`;
        if (line.startsWith("## ")) return `<h2 class="text-2xl font-display font-bold text-foreground mt-10 mb-4">${line.slice(3)}</h2>`;
        if (line.trim() === "---") return `<hr class="my-8 border-border" />`;
        if (line.startsWith("> "))
          return `<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 text-muted-foreground italic">${processInline(line.slice(2))}</blockquote>`;
        if (line.startsWith("- "))
          return `<li class="ml-6 list-disc text-muted-foreground mb-1">${processInline(line.slice(2))}</li>`;
        const olMatch = line.match(/^(\d+)\.\s(.*)/);
        if (olMatch)
          return `<li class="ml-6 list-decimal text-muted-foreground mb-1">${processInline(olMatch[2])}</li>`;
        if (line.startsWith("|")) {
          if (line.includes("---")) return "";
          const cells = line.split("|").filter(Boolean).map((c) => c.trim());
          return `<tr>${cells.map((c) => `<td class="border border-border px-3 py-2 text-sm">${processInline(c)}</td>`).join("")}</tr>`;
        }
        if (line.trim()) return `<p class="text-muted-foreground mb-4 leading-relaxed">${processInline(line)}</p>`;
        return "";
      })
      .join("\n");
  };

  const processInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        const isInternal = href.startsWith("/");
        return `<a href="${href}" class="text-primary underline hover:text-primary/80 transition-colors"${isInternal ? "" : ' target="_blank" rel="noopener noreferrer"'}>${label}</a>`;
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={post.title} description={post.excerpt} path={`/blog/${slug}`} />
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-10">
            <Badge
              variant={post.category === "company" ? "secondary" : "destructive"}
              className="mb-4 text-xs uppercase tracking-wide"
            >
              {post.category === "company" ? "Company" : "Compliance"}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {new Date(post.publishedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </header>

          <div
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-display font-bold text-foreground mb-6">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  to={`/blog/${rp.slug}`}
                  className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:shadow-smooth transition-all"
                >
                  <h3 className="font-semibold text-foreground text-sm mb-1 leading-snug">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default BlogPost;
