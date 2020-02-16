const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    columns(boardID: String!): [Column]
    boards: [Board]
    boardById(id: String!): Board
    me: User
  }
  type Mutation {
    addColumn(boardID: String!, title: String!): Boolean
    addCard(boardID: String!, columnID: String!, cardInput: CardInput!): Boolean
    removeCard(columnId: String!, cardId: String!): Boolean
    removeColumn(boardID: String!, columnID: String!): Boolean
    removeBoard(boardID: String!): Boolean
    signup(email: String!, name: String!, password: String!): User!
    login(email: String!, password: String!): User!
    logout: Boolean
    addBoard(title: String!): Boolean
    reorderColumn(
      boardID: String!
      columnID: String!
      source: Int!
      destination: Int!
    ): Boolean
    reorderCard(
      cardID: String!
      sourceColumnID: String!
      destinationColumnID: String!
      sourcePosition: Int!
      destinationPosition: Int!
    ): Boolean
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
