const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getColumns(boardID: String!): ColumnResponse
    getBoards: BoardResponse
    getBoardById(id: String!): BoardByIdResponse
    me: UserResponse
  }
  type Mutation {
    addColumn(boardID: String!, title: String!): Response
    addCard(
      boardID: String!
      columnID: String!
      cardInput: CardInput!
    ): Response
    removeCard(columnId: String!, cardId: String!): Response
    removeColumn(boardID: String!, columnID: String!): Response
    removeBoard(boardID: String!): Response
    signup(email: String!, name: String!, password: String!): UserResponse!
    login(email: String!, password: String!): UserResponse!
    logout: Boolean
    addBoard(title: String!): Response
    reorderColumn(
      boardID: String!
      columnID: String!
      source: Int!
      destination: Int!
    ): Response
    reorderCard(
      cardID: String!
      sourceColumnID: String!
      destinationColumnID: String!
      sourcePosition: Int!
      destinationPosition: Int!
    ): Response
  }

  type Response {
    success: Boolean!
    message: String!
  }

  type UserResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type ColumnResponse {
    success: Boolean!
    message: String!
    columns: [Column]
  }

  type BoardResponse {
    success: Boolean!
    message: String!
    boards: [Board]
  }

  type BoardByIdResponse {
    success: Boolean!
    message: String!
    board: Board
  }

  type User {
    id: ID!
    email: String!
    name: String!
  }

  type Column {
    id: ID
    title: String!
    cards: [Card]
  }

  type Board {
    id: ID
    title: String!
    columns: [Column]
    owner: User!
  }

  type Card {
    id: ID
    title: String!
  }

  input CardInput {
    title: String!
  }
`;

module.exports = typeDefs;
