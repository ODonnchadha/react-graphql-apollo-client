## Consuming a GraphQL API with Apollo Client and React

- COURSE OVERVIEW:
    - Why? Declarative data fetching. Intelligent caching. Compabilitity. Active community. Modern developer tools. Great for modern UI frameworks.

- SETUP REACT & APOLLO DEVELOPMENT ENVIRONMENT:
    - Apollo Client:
        - GraphQL: Query language for APIs. Clients ask for what they exactly need and nothing more. Easy for APIs to evolve over time.
        - UI (Framework Agnostic) - Apollo Client (Normalizes Data. Stores in Cache.) - GraphQL Server.
        - Why Client? Declarative data fetching. Great modern framework fit. Intelligent caching. Universally compatable. Modern tools & developer experience.
    - Download & Setup:
        - [Globomatics App](https://github.com/adhithiravi/Consuming-GraphqL-Apollo)
        ```javascript
            cd app
            npm install
            npm start
            cd api
            npm install
            npm start
        ```
        - NOTE: Error: `digital envelope routines unsupported react` 
        - This is acceptable when running localhost. 
        - In the newly released VS 2022, starting a react-app from scratch, having VS 2022 creating a self-signed certificate for you, still causes the sample project to crash:
        ```json
            "start": "react-scripts --openssl-legacy-provider start"
        ```
    - VS Code Extensions:
        - Add the following root-level `aplool.config.js` Apollo extension. Many tools will leverage this.
            ```javascript
                module.exports = {
                    client: {
                        service: {
                        url: "http://localhost:4000/graphql",
                        skipSSLValidation: true,
                        }
                    }
                }
            ```
        - Add the `Apollo GraphQL` extension.
    - Summary:
        
- EXPLORING THE GRAPHQL SCHEMA WITH INTROSPECTION:
    - Introspection? A manner in which to discover the resources that are available in the GraphQL API schema.
    ```javascript
        query retrieveAllSchemaTypes {
            __schema {
                types {
                name
                }
            }
        }
        query retrieveSupportedQueriesMutations {
            __schema {
                queryType {
                    fields {
                        name
                        description
                    }
                }
                mutationType {
                    fields {
                        name
                        description
                    }
                }
            }
        }
        query retrieveTypeInfo {
            sessionInfo: __type(name: "Session") {
                fields {
                    name
                    description
                }
            }
            speakInfo: __type(name: "Speaker") {
                fields {
                    name
                    description
                }
            }
        }
        query retrieveDirectives {
            __schema {
                directives {
                    name
                    description
                    args {
                        name
                        description
                    }
                }
            }
        }
        query retrieveSessions($with_day: Boolean!) {
            sessions {
                id
                title
                day @include(if: $with_day)
                endsAt
                }
            }
            {
                "with_day": false
            }
    ```
    - Apollo codegen to introspect schema:
        - Using Apollo client, obtain the schema. From either remote server or a local file.
        ```javascript
            npm install apollo-codegen
            Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
            apollo-codegen introspect-schema http://localhost:4000/graphql --output apollo.schema.json
        ```


- QUERIES: RETRIEVING DATA FROM GRAPHQL:
    - useQuery hook.
    - Variables in queries. Arguments to fields can be dynamic.
    - Errors. Apollo useQuery returns result object with error amd loading as properties.
    - Fragments: Reuseable units. Can build sets of fields and reuse them across multiple queries.
    - e.g.: Speaker & SpeakerById.
    - Arguments: Can pass arguments to fields in order to filter resulting data. Every field and nested object can receive its own set of arguments.
    - Aliases: We cann directly query for the same field with different arguments. And alias will allow a rename result of a field.
    - e.g.: Sort sessions based upon the level of the session, and use aliases within the query.
    - Query Directives.

- MUTATIONS: MODIFICATIONS & UPDATES WITH GRAGPQL DATA:
    - useMutation hook. Creating new data. Modifying existing data. Tracking the mutation status. Updating cache after mutation.
    - Mutations: Can create, update, and delete data. The fileds run in sries one after the other. 
    - As is, mutations can cause a side effect. Update cache. Sometimes manually.
    ```javascript
        import { gql, useMutation } from '@apollo/client';
        const ADD_TODO = gql`
            mutation AddTodo($type: String!) {
                addToDo(type: $type) {
                    id
                    type
                }
            }
        `;
        const [addTodo, { data }] = useMutation(ADD_TODO);
    ```
    - useMutation returns a mutate function that you can call at any time to execute the mutation.
    - Also returns an object with fields that represent the current status of the mutation's execution.
    - Tracking mutation status:
    - Updating cache after mutation. e.g.: featured speaker. When you mutate one field, return back the id *and* the mutated field.
    - Updating cache after complex mutations? Or, a delete?
        - If a mutation modifies multiple entities, or if it creates or deletes entities, the Apollo client cache is *not* automatically updates to reflect the result of the mutation.
    - Summary:
        - Apollo React Setup.
        - Introspection Queries.
        - Queries to Retrieve Data. useQuery hook.
        - Mutations to Update Data. useMutation hook.