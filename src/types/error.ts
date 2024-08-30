export interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
}
