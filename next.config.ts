import createMDXPlugin from '@next/mdx'

const withMDX = createMDXPlugin({
  options: {
    rehypePlugins: [
      '@renoun/mdx/rehype/add-code-block',
      '@renoun/mdx/rehype/add-reading-time',
    ],
    remarkPlugins: [
      '@renoun/mdx/remark/add-frontmatter',
      '@renoun/mdx/remark/add-sections',
      '@renoun/mdx/remark/transform-relative-links',
    ],
  },
})

export default withMDX({
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    cpus: 4,
  },

})
