export const typeDefs = /* GraphQL */ `
  type User {
    id: Int!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type Baby {
    id: Int!
    userId: Int!
    name: String!
    birthDate: String!
    gender: String
    bloodType: String
    allergies: String
    pediatricianName: String
    notes: String
    createdAt: String
    updatedAt: String
  }

  type Consultation {
    id: Int!
    babyId: Int!
    consultationDate: String!
    doctorName: String!
    specialistType: String
    weight: Float
    height: Float
    diagnosis: String
    notes: String
    medicinePrescribed: String
    nextAppointmentDate: String
    createdAt: String
    updatedAt: String
  }

  type Vaccine {
    id: Int!
    babyId: Int!
    name: String!
    recommendedAge: String
    appliedDate: String
    nextDoseDate: String
    status: String!
    notes: String
    createdAt: String
    updatedAt: String
  }

  type Cost {
    id: Int!
    babyId: Int!
    costDate: String!
    category: String!
    description: String
    amount: Float!
    createdAt: String
    updatedAt: String
  }

  type DashboardSummary {
    babyId: Int!
    consultationsCount: Int!
    vaccinesCount: Int!
    pendingVaccinesCount: Int!
    totalCosts: Float!
    nextVaccineName: String
    nextVaccineDate: String
    lastConsultationDate: String
  }

  input RegisterUserInput {
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateBabyInput {
    userId: Int!
    name: String!
    birthDate: String!
    gender: String
    bloodType: String
    allergies: String
    pediatricianName: String
    notes: String
  }

  input UpdateBabyInput {
    name: String
    birthDate: String
    gender: String
    bloodType: String
    allergies: String
    pediatricianName: String
    notes: String
  }

  input CreateConsultationInput {
    babyId: Int!
    consultationDate: String!
    doctorName: String!
    specialistType: String
    weight: Float
    height: Float
    diagnosis: String
    notes: String
    medicinePrescribed: String
    nextAppointmentDate: String
  }

  input UpdateConsultationInput {
    consultationDate: String
    doctorName: String
    specialistType: String
    weight: Float
    height: Float
    diagnosis: String
    notes: String
    medicinePrescribed: String
    nextAppointmentDate: String
  }

  input CreateVaccineInput {
    babyId: Int!
    name: String!
    recommendedAge: String
    appliedDate: String
    nextDoseDate: String
    status: String
    notes: String
  }

  input UpdateVaccineInput {
    name: String
    recommendedAge: String
    appliedDate: String
    nextDoseDate: String
    status: String
    notes: String
  }

  input CreateCostInput {
    babyId: Int!
    costDate: String!
    category: String!
    description: String
    amount: Float!
  }

  input UpdateCostInput {
    costDate: String
    category: String
    description: String
    amount: Float
  }

  type Query {
    users: [User!]!
    babies(userId: Int!): [Baby!]!
    baby(id: Int!): Baby
    consultations(babyId: Int!): [Consultation!]!
    vaccines(babyId: Int!): [Vaccine!]!
    costs(babyId: Int!): [Cost!]!
    dashboardSummary(babyId: Int!): DashboardSummary!
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User!
    login(input: LoginInput!): User!

    createBaby(input: CreateBabyInput!): Baby!
    updateBaby(id: Int!, input: UpdateBabyInput!): Baby!
    deleteBaby(id: Int!): Boolean!

    createConsultation(input: CreateConsultationInput!): Consultation!
    updateConsultation(id: Int!, input: UpdateConsultationInput!): Consultation!
    deleteConsultation(id: Int!): Boolean!

    createVaccine(input: CreateVaccineInput!): Vaccine!
    updateVaccine(id: Int!, input: UpdateVaccineInput!): Vaccine!
    deleteVaccine(id: Int!): Boolean!

    createCost(input: CreateCostInput!): Cost!
    updateCost(id: Int!, input: UpdateCostInput!): Cost!
    deleteCost(id: Int!): Boolean!
  }
`;
