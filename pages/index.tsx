import Head from 'next/head';
import Layout from '../components/layout.component';

export default function Home() {
  return (
    <Layout isMarkdown={true} metadata={{
      title: 'Babylon.js home',
      description: 'Babylon.js documentation page',
      keywords: 'babylonjs. documentation'
    }} id={[]}>
      HOME
      </Layout>
  )
}
