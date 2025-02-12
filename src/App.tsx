import { useState, useEffect } from "react";
import AddUserForm from "./components/AddUserForm";
import Table from "./components/Table";
import BirthdayNotification from "./components/BirthdayNotification";
import Header from "./components/Header";
import Footer from "./components/Footer";

interface User {
  userName: string;
  data: string;
  gender: "male" | "female";
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/usersBase.json");
        if (!response.ok) {
          throw new Error("Failed to fetch users data");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = (user: User) => {
    if (user.userName.trim() === "" || user.data.trim() === "") {
      alert("Пожалуйста, заполните все поля!");
      return;
    }
    setUsers([...users, user]);
  };

  const deleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const editUser = (index: number, updatedUser: User) => {
    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;
    setUsers(updatedUsers);
  };

  return (
    <>
      <Header />
      <div className='mainTitle'>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: {error}</div>
        ) : (
          <>
            <Table
              users={users}
              onDeleteUser={deleteUser}
              onEditUser={editUser}
            />
            <AddUserForm onAddUser={addUser} />
          </>
        )}
      </div>
      <BirthdayNotification users={users} />
      <Footer />
    </>
  );
}

export default App;
