const { gql } = require('apollo-server-express');

module.exports.EPType = gql`
  type EPType {
    id: String
    Product: String
    ExpaID: String
    Dispatch: String
    createdAt: String
    EPName: String
    EPEmail: String
    EPPhone: String
    FacebookLink: String
    CV: String
    EPUniversity: String
    EPAge: String
    Gender: String
    EPYear: String
    CommunicationPrefrences: String
    TeamResponsible: Person
    EPManager: Person
    Status: String
    Note: String
    FinanceCorner: String
    OpportunityLink: String
    SubProduct: String
    HostLC: String
    Country: String
    AccDate: String
    APDDate: String
    REDate: String
    FinDate: String
    Travel: String
    Obstacles: String
    Prioritization: String
    Expectation: String
    Is_sign_up: String
    Sent_lns: String
  }

  type EPICXType {
    EPName: String
    EXPAID: String
    Email: String
    WhatsupNumber: String
    Country: String
    Background: String
    CV: String
    Status: String
    ifRejectedWhy: String
    MemberResponsible: String
    OPPmanager: String
    HomeMC: String
    HomeLC: String
    SUBProduct: String
    SDGNumber: String
    ProjectName: String
    OpportunityName: String
    CONTACTED: String
    InterviewDate: String
    TIME: String
    Interviewed: String
    Intreviewoutput: String
    APLDate: String
    APDDate: String
    REDate: String
    FinDate: String
  }

  input EPInput {
    Product: String
    ExpaID: String
    Dispatch: String
    EPName: String
    EPEmail: String
    EPPhone: String
    FacebookLink: String
    CV: String
    EPUniversity: String
    EPAge: String
    Gender: String
    EPYear: String
    CommunicationPrefrences: String
    Status: String
    Note: String
    FinanceCorner: String
    OpportunityLink: String
    SubProduct: String
    HostLC: String
    Country: String
    AccDate: String
    APDDate: String
    REDate: String
    FinDate: String
    Travel: String
    Obstacles: String
    Prioritization: String
    Expectation: String
    Is_sign_up: String
  }

  input OGXFilter {
    Status: [String]
    Product: [String]
    EPUniversity: [String]
    Gender: [String]
    TeamResponsible: [String]
    EPManager: [String]
    Is_sign_up: [String]
    Sent_lns: [String]
  }

  input ICXFilter {
    Status: [String]
    MemberResponsible: [String]
    SDGNumber: [String]
    CONTACTED: [String]
    Interviewed: [String]
  }
`;
