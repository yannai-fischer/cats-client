import {User} from "./models";

export const CAT_SERVER_URL:string = `http://localhost:3000`;

export const DEFAULT_PASSWORD:string = `11111111`

export const FICTITIOUS_USER: User = {
  isAdmin: false,
  firstName: "אורח",
  lastName: "כהן",
  address: "רחוב העצמאות 12, תל אביב יפו",
  username: "johncohen",
  password: "הסיסמהשלי",
  email: "johncohen@example.com",
  phone: "0551234567"
}
