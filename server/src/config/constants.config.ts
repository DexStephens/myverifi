export const CONSTANTS = {
  FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],
  FILE_SIZE: 5 * 1024 * 1024,
  FILE_PATH: "uploads/",
};

export const ERROR_TITLES = {
  DATA: "Data Error",
  DNE: "Does Not Exist",
  UNIQUE: "Already Exists",
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  CONTRACT_CREATION: "contract_creation",
  CREDENTIAL_CREATION: "credential_creation",
  CREDENTIAL_ISSUANCE: "credential_issued",
};

export const CREDENTIAL_CONTRACT_METHODS = {
  DEPLOY_INSTITUTION_CONTRACT: "deployInstitutionContract",
  CREATE_CREDENTIAL_TYPE: "createCredentialType",
  ISSUE_CREDENTIAL: "issueCredential",
  BATCH_ISSUE_CREDENTIAL: "batchIssueCredential",
  GET_INSTITUTION_CONTRACT: "getInstitutionContract",
  VERIFY_CREDENTIAL: "verifyCredential",
};

export const CREDENTIAL_CONTRACT_EVENTS = {
  INSTITUTION_DEPLOYED: "InsitutionDeployed",
  CREDENTIAL_CREATION: "CredentialCreated",
  CREDENTIAL_ISSUANCE: "CredentialIssued",
};

export const DEFAULT_JSON_URI = "DEFAULT.com";
