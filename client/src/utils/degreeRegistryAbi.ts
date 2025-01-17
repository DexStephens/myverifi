export const degreeRegistryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "string",
                name: "ceebCode",
                type: "string",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "bool",
                name: "exists",
                type: "bool",
              },
            ],
            internalType: "struct DegreeRegistry.University",
            name: "university",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "docLink",
            type: "string",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "string",
            name: "major",
            type: "string",
          },
          {
            internalType: "string",
            name: "level",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revoked",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct DegreeRegistry.Degree",
        name: "degree",
        type: "tuple",
      },
    ],
    name: "DegreeEarned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "ceebCode",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct DegreeRegistry.University",
        name: "university",
        type: "tuple",
      },
    ],
    name: "UniversityAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "ceeb",
        type: "string",
      },
      {
        internalType: "string",
        name: "university",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "addUniversity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "assignee",
        type: "address",
      },
      {
        internalType: "string",
        name: "ceeb",
        type: "string",
      },
      {
        internalType: "string",
        name: "major",
        type: "string",
      },
      {
        internalType: "string",
        name: "level",
        type: "string",
      },
      {
        internalType: "string",
        name: "docLink",
        type: "string",
      },
    ],
    name: "assignDegree",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "getDegrees",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "string",
                name: "ceebCode",
                type: "string",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "bool",
                name: "exists",
                type: "bool",
              },
            ],
            internalType: "struct DegreeRegistry.University",
            name: "university",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "docLink",
            type: "string",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "string",
            name: "major",
            type: "string",
          },
          {
            internalType: "string",
            name: "level",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "revoked",
            type: "bool",
          },
        ],
        internalType: "struct DegreeRegistry.Degree[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
