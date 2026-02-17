import { Directory, resolveFileFromEntry } from 'renoun'
import { z } from 'zod'


export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

export const docs = new Directory({
  path: 'docs',
  basePathname: null,
  filter: '**/*.mdx',
  schema: {
    mdx: {
      headings: z.array(
        z.object({
          id: z.string(),
          level: z.number(),
          text: z.string(),
          summary: z.string().optional(),
          children: z.custom<NonNullable<React.ReactNode>>().optional(),
        })
      ),
     
      frontmatter: frontmatterSchema,
    },
  },
  loader: {
    mdx: (path) => import(`./docs/${path}.mdx`),
  },
})

export const routes = docs.getEntries({ recursive: true, includeIndexAndReadmeFiles: true }).then((entries) =>
  Promise.all(
    entries.map(async (doc) => {
      const file = await resolveFileFromEntry(doc, 'mdx')

      const metadata = file ? await file.getExportValue('frontmatter') : null

      if (file && !metadata) {
        throw new Error(`Metadata export not defined for ${doc.getPathname()}`)
      }

      return {
        pathname: doc.getPathname(),
        segments: doc.getPathnameSegments({ includeBasePathname: false }),
        title: metadata?.title ?? doc.title ?? doc.baseName,
        order: file?.order ?? Number.POSITIVE_INFINITY,
      }
    })
  )
)
