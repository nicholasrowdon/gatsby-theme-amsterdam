import React from 'react'
import { graphql } from 'gatsby'
import Intro from '../components/Intro'
import PostList from '../components/PostList'
import SEO from '../components/SEO'
import Pagination from '../components/Pagination'
import Container from '../components/Container'
import { useSiteMetadata } from '../hooks/use-site-metadata'

const PostsPage = ({ data, pageContext }) => {
  const { intro } = useSiteMetadata()
  const posts = data.allPost.edges

  let ogImage
  try {
    ogImage = posts[0].node.cover.childImageSharp.ogimg.src
  } catch (error) {
    ogImage = null
  }
  console.log(pageContext.paginationPath)

  return (
    <>
      <SEO
        image={ogImage}
        slug={
          pageContext.humanPageNumber === 1
            ? `${pageContext.paginationPath}/`
            : `${pageContext.paginationPath}/${pageContext.humanPageNumber}`
        }
      />
      <Container fullWidth noPadding>
        {intro && <Intro text={intro} context={pageContext} />}
        {posts.length > 0 && <PostList posts={posts} context={pageContext} />}
      </Container>
      <Pagination context={pageContext} />
    </>
  )
}

export default PostsPage

export const postsQuery = graphql`
  query($skip: Int!, $limit: Int!) {
    allPost(sort: { fields: [date], order: DESC }, skip: $skip, limit: $limit) {
      edges {
        node {
          slug
          excerpt
          title
          tags
          date(formatString: "MMMM DD, YYYY")
          cover {
            childImageSharp {
              fluid(maxWidth: 1000) {
                ...GatsbyImageSharpFluid_withWebp
              }
              ogimg: resize(width: 1000) {
                src
              }
            }
          }
        }
      }
    }
  }
`
