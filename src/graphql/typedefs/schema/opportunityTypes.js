const { gql } = require('apollo-server-express');

module.exports.OpportunityType = gql`
  type OpportunityType {
    id: String
    expaID: String
    title: String
    status: String
    sdg_number: Int
    product: String
    remote_opportunity: Boolean
    organization: OrganizationType
    home_lc: String
    home_mc: String
    host_lc: String
    cover_photo: PhotoType
    project_fee: ProjectFeeType
    specifics_info: OpportunitySpecificInfo
    transparent_details: OpportunityTransparentDetails
    applicants_count: Int
    slots: [SlotType]
    managers: [Person]
  }

  type OpportunitySpecificInfo {
    alphabetic_code: String
    salary: Int
  }

  type OpportunityTransparentDetails {
    covers_accomodation: String
    covers_administrative_costs: String
    covers_leadership_spaces: String
    covers_pickup: String
  }

  type ProjectFeeType {
    currency: String
    fee: Int
  }

  type OrganizationType {
    name: String
    description: String
    location: String
  }

  type SlotType {
    title: String
    status: String
    openings: Int
    available_openings: Int
    start_date: String
    end_date: String
  }

  input OpportunityInput {
    title: String
    status: String
    sdg_number: Int
    product: String
    remote_opportunity: Boolean
    home_lc: String
    home_mc: String
    host_lc: String
  }
`;
