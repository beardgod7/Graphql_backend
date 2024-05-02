const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    tasks: [Task]! 
  }

  type Task {
    id: ID!
    title: String!
    description: String
    isCompleted: Boolean!
    createdAt: String!  
    updatedAt: String!  
    dueDate: String  
  }

  type Query {
    getUsers: [User]!         
    getUser(id: ID!): User   
    getTaskById(id: ID!): Task  
    getTasks: [Task]!          
    getUserTasks(userId: ID!): [Task]! 
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User  
    login(email: String!, password: String!): String
    createTask(
      userId: ID!, 
      title: String!, 
      description: String, 
      dueDate: String
    ): Task  
    updateTask(
      id: ID!, 
      title: String, 
      description: String, 
      isCompleted: Boolean, 
      dueDate: String
    ): Task  
    deleteTask(id: ID!): Boolean  
  }
`;

module.exports = typeDefs;



