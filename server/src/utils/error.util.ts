import { ZodIssueCode } from "zod";
import { ERROR_TITLES } from "../config/constants.config";

export class ControllerError extends Error {
  title: ErrorTitle;

  constructor(title, message) {
    super(message);
    this.title = title;
  }
}

export class ErrorUtil {
  static parseZodMessage(message: string): ApiErrorMessage[] {
    const messageObj = JSON.parse(message);

    if (Array.isArray(messageObj)) {
      return messageObj.map((messageObj) => {
        const { code, path, message } = messageObj;

        let index: number | undefined;
        if (path.length > 2 && typeof path.at(-2) === "number") {
          index = path.at(-2);
        }

        let parents: string[] | undefined;
        if (path.length > 2) {
          let current = 0;
          while (
            typeof path[current] !== "number" &&
            current < path.length - 1
          ) {
            if (!Array.isArray(parents)) {
              parents = [];
            }

            parents.push(path[current]);
            current += 1;
          }
        }

        return {
          type: code,
          index,
          parents,
          key: path[path.length - 1],
          message: message,
        };
      });
    }

    return [];
  }
}

type ApiErrorMessage = {
  type: ZodIssueCode | string;
  index?: number;
  parents?: string[];
  key: string;
  message: string;
};

type ErrorTitle = (typeof ERROR_TITLES)[keyof typeof ERROR_TITLES];
