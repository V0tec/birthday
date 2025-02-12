import { useState } from "react";

interface User {
  userName: string;
  data: string;
  gender: "male" | "female";
}

interface AddUserFormProps {
  onAddUser: (user: User) => void;
}

function AddUserForm({ onAddUser }: AddUserFormProps) {
  const [user, setUser] = useState<User>({
    userName: "",
    data: "",
    gender: "male",
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const getAvailableDays = (selectedMonth: string, selectedYear: string) => {
    if (!selectedMonth || !selectedYear) return days;

    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const lastDay = new Date(year, month, 0).getDate();

    if (year === currentYear && month === currentMonth) {
      return Array.from({ length: currentDay }, (_, i) => {
        const day = i + 1;
        return day < 10 ? `0${day}` : day.toString();
      });
    }

    return Array.from({ length: lastDay }, (_, i) => {
      const day = i + 1;
      return day < 10 ? `0${day}` : day.toString();
    });
  };

  const getAvailableMonths = (selectedYear: string) => {
    if (!selectedYear) return months;

    const year = parseInt(selectedYear);

    if (year === currentYear) {
      return months.slice(0, currentMonth);
    }

    return months;
  };

  const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return day < 10 ? `0${day}` : day.toString();
  });

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const years = Array.from(
    { length: currentYear - (currentYear - 100) + 1 },
    (_, i) => currentYear - i
  );

  const isDateValid = (day: string, month: string, year: string) => {
    const selectedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };

  const handleDateChange = (field: string, value: string) => {
    let updatedDate: string;
    const dateParts = user.data ? user.data.split("/") : ["", "", ""];

    if (field === "month") {
      const monthNum = parseInt(value);
      value = monthNum < 10 ? `0${monthNum}` : value;
    }

    let newDay = field === "day" ? value : dateParts[0];
    let newMonth = field === "month" ? value : dateParts[1];
    let newYear = field === "year" ? value : dateParts[2];

    if (newDay && newMonth && newYear) {
      if (!isDateValid(newDay, newMonth, newYear)) {
        return;
      }
    }

    switch (field) {
      case "day":
        updatedDate = `${value}/${dateParts[1]}/${dateParts[2]}`;
        break;
      case "month":
        updatedDate = `${dateParts[0]}/${value}/${dateParts[2]}`;
        break;
      case "year":
        updatedDate = `${dateParts[0]}/${dateParts[1]}/${value}`;
        break;
      default:
        updatedDate = user.data;
    }

    setUser((prevUser) => ({ ...prevUser, data: updatedDate }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user.userName.trim() === "" || user.data.trim() === "") return;

    onAddUser(user);
    setUser({ userName: "", data: "", gender: "male" });
  };

  const selectedMonth = user.data ? user.data.split("/")[1] : "";
  const selectedYear = user.data ? user.data.split("/")[2] : "";
  const availableDays = getAvailableDays(selectedMonth, selectedYear);
  const availableMonths = getAvailableMonths(selectedYear);

  return (
    <div className='usersForm'>
      <h2>Добавить пользователя</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='userName'
          value={user.userName}
          onChange={(e) => handleChange(e)}
          required
          minLength={2}
          placeholder='Имя'
          maxLength={32}
          pattern='^[a-zA-Zа-яА-ЯіїєґІЇЄҐ\s]+$'
        />
        <div>
          <select
            value={user.data ? user.data.split("/")[0] : ""}
            onChange={(e) => handleDateChange("day", e.target.value)}
            required
          >
            <option value=''>День</option>
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            value={user.data ? user.data.split("/")[1] : ""}
            onChange={(e) => handleDateChange("month", e.target.value)}
            required
          >
            <option value=''>Месяц</option>
            {availableMonths.map((month, index) => {
              const monthNum = index + 1;
              const monthValue =
                monthNum < 10 ? `0${monthNum}` : monthNum.toString();
              return (
                <option key={index} value={monthValue}>
                  {month}
                </option>
              );
            })}
          </select>
          <select
            value={user.data ? user.data.split("/")[2] : ""}
            onChange={(e) => handleDateChange("year", e.target.value)}
            required
          >
            <option value=''>Год</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className='usersForm__radio'>
          <input
            type='radio'
            name='gender'
            value='male'
            checked={user.gender === "male"}
            onChange={handleChange}
          />
          <label htmlFor='male'>Мужчина</label>
          <input
            type='radio'
            name='gender'
            value='female'
            checked={user.gender === "female"}
            onChange={handleChange}
          />
          <label htmlFor='female'>Женщина</label>
        </div>
        <button type='submit'>Отправить</button>
      </form>
    </div>
  );
}

export default AddUserForm;
