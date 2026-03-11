import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { blogPosts } from "@/content/blogPosts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const companyPosts = blogPosts.filter((p) => p.category === "company");
  const compliancePosts = blogPosts.filter((p) => p.category === "compliance");

  return (
    <div className="min-h-screen bg-background">
      {(() => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          document.title = "Business Formation Blog | EZ BIZ FILE SERVICE";
          const meta = document.querySelector('meta[name="description"]');
          if (meta) meta.setAttribute("content", "Expert insights on business formation, LLC filing, compliance requirements, and IRS tax obligations. Stay informed with EZ BIZ FILE SERVICE.");
        }, []);
        return null;
      })()}

      <Navigation />

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Business Formation Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert guidance on starting your business the right way — from entity
            selection and state requirements to IRS compliance and liability
            protection.
          </p>
        </section>

        {/* Company Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <Badge variant="secondary" className="text-xs uppercase tracking-wide">
              Company
            </Badge>
            About EZ BIZ FILE SERVICE
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {companyPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Compliance Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
            <Badge variant="destructive" className="text-xs uppercase tracking-wide">
              Compliance
            </Badge>
            Risks of Not Filing
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {compliancePosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
};

function BlogCard({ post }: { post: (typeof blogPosts)[number] }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <Card className="h-full border-border hover:border-primary/40 transition-colors duration-200 hover:shadow-smooth">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post.publishedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Read article <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Blog;
