export interface User {
  username: string;
  password: string;
  redirect: string;
}

export const users: User[] = [
  { username: "admin", password: "admin", redirect: "/admin" },
  { username: "knitting", password: "knitting", redirect: "/knitting" },
  { username: "dyeing", password: "dyeing", redirect: "/dyeing" },
  { username: "trims", password: "trims", redirect: "/trimming" },
  { username: "merchant", password: "merchant", redirect: "/merchant" },
];

export const authenticate = (username: string, password: string) => {
  return users.find(
    (u) => u.username === username.toLowerCase() && u.password === password
  );
};
