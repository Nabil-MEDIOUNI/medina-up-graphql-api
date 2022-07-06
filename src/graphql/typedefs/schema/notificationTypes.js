const { gql } = require('apollo-server-express');

module.exports.NotificationType = gql`
  type Notification {
    id: ID
    title: String
    body: String
    type: String
    post: Post
    ep: EPType
    notified_by: Person
    notified_to: PostPermissions
    seen_by: [Person]
    createdAt: String
    deleted_by: [Person]
  }

  input Notified_To_Input {
    can_view: String
    department: String
  }

  input NotificationInput {
    title: String
    body: String
    type: String
    ep_id: String
    notified_to: Notified_To_Input
    notified_by: String
    personal_notification: String
    post: String
  }
`;
