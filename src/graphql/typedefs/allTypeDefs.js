const { gql } = require('apollo-server-express');

module.exports.allTypeDefs = gql `
  type Query {
    # related to currentPerson
    currentPerson: Person
    # related to people
    getPerson(id: ID!): Person
    allPeople(filters: PeopleFilter): [Person]
    allTeamLeaders: [Manager]
    # related to eps
    allEPSCRM(filters: OGXFilter, product: String): [EPType]
    allEPs(filters: OGXFilter, product: String): [EPType]
    allICXEPs(filters: ICXFilter, product: String): [EPICXType]
    EPsIManage(filters: OGXFilter): [EPType]
    getSingleEP(id: String!): EPType
    getSingleEPCRM(id: String!, product: String): EPType
    getSingleICXEP(name: String!, product: String): EPICXType
    allManagers(product: String): [Manager]
    allTeamResponsible(product: String): [Manager]
    # related to opportunities
    allOpportunities: [OpportunityType]
    getOpportunity(id: String!): OpportunityType
    # related to posts
    allPosts: [Post]
    getPost(id: ID!): Post
    # related to votes
    allVotes: [VoteType]
    getRoom(id: String, name: String): VoteType
    getCandidate(id: String, name: String, candidate: String): CandidateType
    getVoters(id: String, name: String): [VoterType]
    getSingleVoter(id: String, name: String): VoterType
    # related to notifications
    allNotifications: [Notification]
    neverSeenNotifications: [Notification]
    getNotification(id: ID!): Notification
  }

  type Mutation {
    # related to currentPerson
    currentPersonUpdate(person: PersonInput): Person
    changePassword(email: String!, password: String!, id: String!): Person
    currentPersonUpdatePassword(
      oldPassword: String!
      newPassword: String!
    ): Person
    changeCoverPhoto(file: Upload): Person
    # related to people
    createPerson(person: PersonInput): Person
    cahnge_user_connectivity(connectivity: Boolean): Person
    updatePerson(id: ID!, person: PersonInput): Person
    deletePerson(id: ID!): Person
    deleteMultiplePeople(ids: [ID]): [Person]
    generatePersonPassword: [Person]
    # related to eps
    createEP(ep: EPInput): EPType
    ExportEPSToSheet: EPType
    updateEP(id: ID!, ep: EPInput): EPType
    setEPManager(id: ID!, personID: ID!): EPType
    setTeamResponsible(id: ID!, personID: ID!): EPType
    setMultipleManagers(ids: [ID], manager: String,teamResponsible: String): [EPType]
    deleteEP(id: ID!): EPType
    deleteMultipleEPs(ids: [ID]): [EPType]
    # related to opportunities
    createOpportunity(opportunity: OpportunityInput): OpportunityType
    updateOpportunity(id: ID!, opportunity: OpportunityInput): OpportunityType
    deleteOpportunity(id: ID!): OpportunityType
    # related to posts
    createPost(post: PostInput, attachements: Upload): Post
    approvePost(id: ID!): Post
    updatePost(id: ID!, post: PostInput, attachements: Upload): Post
    deletePost(id: ID!): Post
    likePost(id: String!): Post
    disLikePost(id: String!): Post
    commentPost(id: String!, comment: String!): Post
    editPostComment(
      postId: String!
      commentId: String!
      newComment: String
    ): Comment
    deletePostComment(postId: String!, commentId: String!): Comment
    likeComment(postId: String!, commentId: String!): Comment
    disLikeComment(postId: String!, commentId: String!): Comment
    replyComment(postId: String!, commentId: String!, comment: String): Comment
    # related to votes
    createVote(vote: VoteInput): VoteType
    joinVoteRoom(id: String, name: String): VoteType
    dismissVoter(id: String, name: String, voterId: String): VoterType
    closeRoom(id: String, name: String): VoteType
    showVoteResult(id: String, name: String): VoteType
    vote(id: String, name: String, candidate: String, vote: String): VoteType
    # related to notifications
    sendNotification(notification: NotificationInput): Notification
    seeNotification(id: ID!): Notification
    deleteNotification(id: ID!): Notification
    deleteMultipleNotifications(ids: [ID]): [Notification]
    seeMultipleNotifications(ids: [ID]): [Notification]
  }
`;