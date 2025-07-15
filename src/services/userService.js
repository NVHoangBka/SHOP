export const fetchUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return response.json();
};
