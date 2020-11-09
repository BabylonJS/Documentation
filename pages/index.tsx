import Head from "next/head";
import Layout from "../components/layout.component";

export default function Home() {
    return (
        <Layout
            breadcrumbs={[]}
            metadata={{
                title: "Babylon.js home",
                description: "Babylon.js documentation page",
                keywords: "babylonjs. documentation",
            }}
            id={[]}
        >
            <Head>
                <script type="application/ld+json">
                    {`{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://docs.babylonjs.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://docs.babylonjs.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }`}
                </script>
            </Head>
            <>HOME</>
        </Layout>
    );
}
