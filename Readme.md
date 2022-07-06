# graphql-api



## GitFlow
* 2 Main branches:
  - Master: Production Code
  - Dev: Testing code

* _No push to master_**

* Only Merge to Dev

* Create a Branch by new feature develop - ie: ticket-(number/name)

* you should always reference the Jira Ticket so the branch / commit are linked

* ie: LMU-XXX: something I commit

* Create sub branch feature if needed


## Getting Started

create a file called _nodemon.json_** and put within all the credentials:
```
{
  "env":{
    "MONGO_USER": "username",
    "MONGO_PASSWORD": "password",
    "CLUSTER": "cluster_tag",
    "MONGO_DB": "MEDINA_UP_DB",
    "PORT": 8000
  }
}
```

Install dependencies:
```
yarn
```

Run:
```
yarn dev 
```

Open GraphiQL in your browser 
(http://localhost:8000/graphql)