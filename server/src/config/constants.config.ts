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
