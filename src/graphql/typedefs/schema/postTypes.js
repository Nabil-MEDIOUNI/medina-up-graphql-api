const { gql } = require('apollo-server-express');

module.exports.PostTypes = gql`
  type PostList {
    data: [Post]
    paging: Paging
  }
  type ReactionList {
    data: [Person]
    paging: Paging
  }
  type Paging {
    current_page: Int
    total_items: Int
    total_pages: Int
  }
  type Post {
    id: ID
    title: String
    description: String
    createdAt: String
    posted_to: PostPermissions
    likes: Like
    comments: [Comment]
    post_components: [PostComponent]
    is_approved: Boolean
    creator: Person
    seen_by: [Person]
  }
  
  type PostComponent {
    component_attachment: Attachement
    content: String
    content_type: String
  }

  type PostPermissions {
    can_view: String
    department: String
  }

  type Like {
    count: Int
    liked_by: [Person]
  }

  type Attachement {
    filename: String
    file: String
    filesize: String
    type: String
  }

  type Comment {
    id: String
    comment: String
    likes: Like
    replies: [Comment]
    createdAt: String
    commenter: Person
  }

  input PostPermissionsInput {
    can_view: String
  }

  input PostInput {
    title: String
    description: String
    size: Int
    file: String
    filename: String
    post_type: String
    posted_to: PostPermissionsInput
    type: String
    fcm_token: String
  }

`;
