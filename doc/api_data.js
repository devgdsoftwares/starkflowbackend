define({ "api": [
  {
    "type": "get",
    "url": "/data/candidates",
    "title": "Candidate Wizard Data",
    "name": "GetCandidateWizardData",
    "group": "AppData",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Object data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\": {\n      experience_role: [\n         {id: 1, title: 'Intern'},\n         {id: 2, title: 'Fresher'},\n         {id: 3, title: 'Junior'},\n         {id: 4, title: 'Mid Level'},\n         {id: 5, title: 'Senior'},\n         {id: 6, title: 'Lead'},\n       ],\n       looking_for: [\n         {id: 1, title: 'Contract'},\n         {id: 2, title: 'Permanent'},\n         {id: 3, title: 'Both'},\n       ],\n       availability: [\n         {id: 1, title: 'Immediately'},\n         {id: 2, title: 'In 1 week'},\n         {id: 3, title: 'In 2 weeks'},\n         {id: 4, title: 'In 1 month'},\n         {id: 5, title: 'More than a month'},\n       ],\n       salary: {\n         curreny: [\n           {id: 1, title: 'USD'},\n           {id: 2, title: 'EUR'},\n           {id: 3, title: 'GBP'},\n           {id: 4, title: 'INR'},\n           {id: 5, title: 'RUB'},\n         ],\n         duration: [\n           {id: 1, title: 'Hour'},\n           {id: 2, title: 'Week'},\n           {id: 3, title: 'Month'},\n           {id: 4, title: 'Year'}\n         ]\n       }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/AppDataRoutes.ts",
    "groupTitle": "AppData"
  },
  {
    "type": "get",
    "url": "/data/designations",
    "title": "Get designations",
    "name": "GetDesignations",
    "group": "AppData",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Designations.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>List of designations.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\":[\n      {\n        \"_id\":\"5adf1ab90f17bdb02064b4bb\",\n        \"title\":\"Backend Developer\",\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/AppDataRoutes.ts",
    "groupTitle": "AppData"
  },
  {
    "type": "get",
    "url": "/data/domains",
    "title": "Domains",
    "name": "GetDomains",
    "group": "AppData",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search domains.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>List of domains.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\":[\n      {\n        \"_id\":\"5adf1ab90f17bdb02064b4bb\",\n        \"title\":\"Market Research\",\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/AppDataRoutes.ts",
    "groupTitle": "AppData"
  },
  {
    "type": "get",
    "url": "/data/features",
    "title": "Features",
    "name": "GetFeatures",
    "group": "AppData",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search features.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>List of features.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\":[\n      {\n        \"_id\":\"5adf1ab90f17bdb02064b4bb\",\n        \"title\":\"Dashboard\",\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/AppDataRoutes.ts",
    "groupTitle": "AppData"
  },
  {
    "type": "get",
    "url": "/data/skills",
    "title": "Skills",
    "name": "GetSkills",
    "group": "AppData",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "q",
            "description": "<p>Search skill.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "data",
            "description": "<p>List of skills.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\":[\n      {\n        \"_id\":\"5adf1ab90f17bdb02064b4bb\",\n        \"title\":\"Node.JS\",\n        \"parent\":\"Tools/Platforms/Apis\"\n      }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/AppDataRoutes.ts",
    "groupTitle": "AppData"
  },
  {
    "type": "put",
    "url": "/jobs/:id",
    "title": "Archive a Job",
    "name": "ArchiveJob",
    "group": "Job",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the Job.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"error\":false,\n   \"message\": \"Job archived successfully.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "post",
    "url": "/jobs",
    "title": "Create a Job",
    "name": "CreateJob",
    "group": "Job",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"skills\": [\n    {\n      \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n      \"title\": \"MongoDB\"\n    }\n  ],\n  \"title\": \"Fullstack Developer - Second latest\",\n  \"description\": \"Some random description for the job\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Job object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ValidationFailed:",
          "content": "HTTP/1.1 200 ValidationFailed\n{\n  \"error\": true,\n  \"message\": \"Validation failed\",\n  \"data\": {\n    \"title\": \"Job title is required\",\n    \"description\": \"Job description is required\",\n    \"skills\": \"Job skills are required\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Job Created Successfully:",
          "content": " HTTP/1.1 201 OK\n {\n    \"error\":false,\n    \"message\": \"Job posted successfully.\",\n    \"data\": {\n          \"skills\": [\n            {\n              \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n              \"title\": \"MongoDB\"\n            }\n          ],\n          \"_id\": \"5b0bda44271c78261b4aba77\",\n          \"title\": \"Fullstack Developer Latest\",\n          \"description\": \"Some random description for the job\",\n          \"user\": {\n            \"_id\": \"5b015cfb1785db7a7651491e\",\n            \"firstName\": \"My\",\n            \"lastName\": \"Name\",\n            \"pictureUrl\": \"http://placehold.it/400x400\"\n          },\n          \"createdAt\": \"2018-05-28T10:30:28.009Z\",\n          \"updatedAt\": \"2018-05-28T10:30:28.009Z\",\n          \"__v\": 0\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "delete",
    "url": "/jobs/:id",
    "title": "Delete a Job",
    "name": "DeleteJob",
    "group": "Job",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the Job.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"error\":false,\n   \"message\": \"Job deleted successfully.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "get",
    "url": "/jobs/:id",
    "title": "Get a Job",
    "name": "GetJob",
    "group": "Job",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the Job.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Job object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\": {\n          \"skills\": [\n            {\n              \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n              \"title\": \"MongoDB\"\n            }\n          ],\n          \"_id\": \"5b0bda44271c78261b4aba77\",\n          \"title\": \"Fullstack Developer Latest\",\n          \"description\": \"Some random description for the job\",\n          \"user\": {\n            \"_id\": \"5b015cfb1785db7a7651491e\",\n            \"firstName\": \"My\",\n            \"lastName\": \"Name\",\n            \"pictureUrl\": \"http://placehold.it/400x400\"\n          },\n          \"createdAt\": \"2018-05-28T10:30:28.009Z\",\n          \"updatedAt\": \"2018-05-28T10:30:28.009Z\",\n          \"__v\": 0\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFoundError",
            "description": "<p>Job not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "NotFoundError:",
          "content": "HTTP/1.1 404 NotFoundError\n\"Job not found.\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "get",
    "url": "/jobs/:id",
    "title": "Get a Job (Public)",
    "name": "GetJobPublic",
    "group": "Job",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>ID of the Job.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Job object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\": {\n          \"skills\": [\n            {\n              \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n              \"title\": \"MongoDB\"\n            }\n          ],\n          \"_id\": \"5b0bda44271c78261b4aba77\",\n          \"title\": \"Fullstack Developer Latest\",\n          \"description\": \"Some random description for the job\",\n          \"user\": {\n            \"_id\": \"5b015cfb1785db7a7651491e\",\n            \"firstName\": \"My\",\n            \"lastName\": \"Name\",\n          },\n          \"createdAt\": \"2018-05-28T10:30:28.009Z\",\n          \"updatedAt\": \"2018-05-28T10:30:28.009Z\",\n          \"__v\": 0\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFoundError",
            "description": "<p>Job not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "NotFoundError:",
          "content": "HTTP/1.1 404 NotFoundError\n\"Job not found.\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "get",
    "url": "/jobs",
    "title": "Job List",
    "name": "GetJobs",
    "group": "Job",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "per_page",
            "defaultValue": "20",
            "description": "<p>Jobs to show per page.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"asc\"",
              "\"desc\""
            ],
            "optional": false,
            "field": "sort_as",
            "defaultValue": "desc",
            "description": "<p>Sort the jobs as.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"createdAt\"",
              "\"updateAt\"",
              "\"title\""
            ],
            "optional": false,
            "field": "sort_by",
            "defaultValue": "createdAt",
            "description": "<p>Sort job by.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Paginate and Jobs object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\": {\n      \"jobs\": [\n       {\n          \"skills\": [\n            {\n              \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n              \"title\": \"MongoDB\"\n            }\n          ],\n          \"_id\": \"5b0bda44271c78261b4aba77\",\n          \"title\": \"Fullstack Developer Latest\",\n          \"description\": \"Some random description for the job\",\n          \"user\": {\n            \"_id\": \"5b015cfb1785db7a7651491e\",\n            \"firstName\": \"My\",\n            \"lastName\": \"Name\",\n            \"pictureUrl\": \"http://placehold.it/400x400\"\n          },\n          \"createdAt\": \"2018-05-28T10:30:28.009Z\",\n          \"updatedAt\": \"2018-05-28T10:30:28.009Z\",\n          \"__v\": 0\n        },\n      ],\n      \"paginate\": {\n        \"total_item\": 25,\n        \"showing\": 20,\n        \"first_page\": 1,\n        \"previous_page\": 1,\n        \"current_page\": 1,\n        \"next_page\": 2,\n        \"last_page\": 2\n      }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "post",
    "url": "/jobs/:id",
    "title": "Update a Job",
    "name": "UpdateJob",
    "group": "Job",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"skills\": [\n    {\n      \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n      \"title\": \"MongoDB\"\n    }\n  ],\n  \"title\": \"Fullstack Developer - Second latest\",\n  \"description\": \"Some random description for the job\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Job object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "ValidationFailed:",
          "content": "HTTP/1.1 200 ValidationFailed\n{\n  \"error\": true,\n  \"message\": \"Validation failed\",\n  \"data\": {\n    \"title\": \"Job title is required\",\n    \"description\": \"Job description is required\",\n    \"skills\": \"Job skills are required\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Job Created Successfully:",
          "content": " HTTP/1.1 201 OK\n {\n    \"error\":false,\n    \"message\": \"Job updated successfully.\",\n    \"data\": {\n          \"skills\": [\n            {\n              \"_id\": \"5adf1ab90f17bdb02064b4b1\",\n              \"title\": \"MongoDB\"\n            }\n          ],\n          \"_id\": \"5b0bda44271c78261b4aba77\",\n          \"title\": \"Fullstack Developer Latest\",\n          \"description\": \"Some random description for the job\",\n          \"createdAt\": \"2018-05-28T10:30:28.009Z\",\n          \"updatedAt\": \"2018-05-28T10:30:28.009Z\",\n          \"__v\": 0\n    }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnauthorizedError",
            "description": "<p>Authorization error on server.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFoundError",
            "description": "<p>Job not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected error on server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 401 UnauthorizedError\n\"Unauthorized\"",
          "type": "json"
        },
        {
          "title": "NotFoundError:",
          "content": "HTTP/1.1 404 NotFoundError\n\"Job not found.\"",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 ServerError\n\"An error occured\"",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/JobRoutes.ts",
    "groupTitle": "Job"
  },
  {
    "type": "get",
    "url": "/messages",
    "title": "Chats",
    "name": "Chats",
    "group": "Messages",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Results per page.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Messages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\": [\n      {\n        \"text\": \"ookokokok\",\n        \"createdAt\": \"2018-06-05T21:19:21.288Z\",\n        \"other\": {\n            \"_id\": \"5a8caf697f6c946b4d5c1d39\",\n            \"name\": \"Some User\"\n        },\n        \"me\": {\n            \"_id\": \"5a8caf697f6c946b4d5c1d36\",\n            \"name\": \"Admin\"\n        },\n        \"position\": \"left\"\n      },\n      {\n          \"text\": \"masd\",\n          \"createdAt\": \"2018-06-05T21:19:06.671Z\",\n          \"other\": {\n              \"_id\": \"5a8caf697f6c946b4d5c1d3a\",\n              \"name\": \"Other user\"\n          },\n          \"me\": {\n              \"_id\": \"5a8caf697f6c946b4d5c1d36\",\n              \"name\": \"Admin\"\n          }\n      }\n      \"position\": \"right\"\n    ]\n}",
          "type": "json"
        },
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 200 UnauthorizedError\n{\n   error: true,\n   status: 401,\n   message: 'Unauthorized.'\n});",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 200 ServerError\n{\n   error: true,\n   status: 500,\n   message: 'An error occured.'\n});",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/MessageRoutes.ts",
    "groupTitle": "Messages"
  },
  {
    "type": "get",
    "url": "/messages/id",
    "title": "Chat thread",
    "name": "MessageChat",
    "group": "Messages",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User id of the person in conversation.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>Page number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "defaultValue": "10",
            "description": "<p>Results per page.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Chat messages.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\":false,\n    \"data\": [\n      {\n        \"_id\": \"5b16f4c3431e01dd64a90761\",\n        \"me\": {\n          \"_id\": \"5a8caf697f6c946b4d5c1d36\",\n          \"name\": \"Admin\"\n        },\n        \"other\": {\n          \"_id\": \"5a8caf697f6c946b4d5c1d3a\",\n          \"name\": \"Some User\"\n        },\n        \"text\": \"masd\",\n        \"body\": {},\n        \"createdAt\": \"2018-06-05T21:18:54.636Z\",\n        \"updatedAt\": \"2018-06-05T21:18:54.636Z\",\n        \"seen\": false,\n        \"position\": \"left\"\n      }\n    ]\n}",
          "type": "json"
        },
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 200 UnauthorizedError\n{\n   error: true,\n   status: 401,\n   message: 'Unauthorized.'\n});",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 200 ServerError\n{\n   error: true,\n   status: 500,\n   message: 'An error occured.'\n});",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/MessageRoutes.ts",
    "groupTitle": "Messages"
  },
  {
    "type": "post",
    "url": "/messages",
    "title": "New Message",
    "name": "SendMessage",
    "group": "Messages",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "from",
            "description": "<p>ID of the sender.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>ID of the receiver.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>Text of the message.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Any extra data for the message.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "error",
            "description": "<p>If expected error occured.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "message",
            "description": "<p>Message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n    \"error\": false,\n    \"message\": \"Message sent.\",\n    \"data\": {\n\n    }\n}",
          "type": "json"
        },
        {
          "title": "UnauthorizedError:",
          "content": "HTTP/1.1 200 UnauthorizedError\n{\n   error: true,\n   status: 401,\n   message: 'Unauthorized.'\n});",
          "type": "json"
        },
        {
          "title": "ValidationError:",
          "content": "HTTP/1.1 200 ValidationError\n{\n   error: true,\n   status: 422,\n   message: 'Validation failed.',\n   data: [\n     {\n       \"type\": \"from\",\n       \"message\": \"Sender of message is required.\"\n     }\n   ]\n});",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 200 ServerError\n{\n   error: true,\n   status: 500,\n   message: 'An error occured.'\n});",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/MessageRoutes.ts",
    "groupTitle": "Messages"
  }
] });
