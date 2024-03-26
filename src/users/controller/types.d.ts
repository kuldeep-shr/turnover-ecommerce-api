interface Payload {
  name: string;
  email: string;
  password?: string;
}
interface ApiResponse extends Payload {
  id?: number;
  token: string;
  token_validity: string;
}

export { Payload, ApiResponse };
