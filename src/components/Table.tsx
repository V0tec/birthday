import { useState } from "react";

interface User {
  userName: string;
  data: string;
  gender: "male" | "female";
}

interface TableProps {
  users: User[];
  onDeleteUser: (index: number) => void;
  onEditUser: (index: number, updatedUser: User) => void;
}

interface GiftSuggestion {
  emoji: string;
  name: string;
}

function Table({ users, onDeleteUser, onEditUser }: TableProps) {
  const [showGifts, setShowGifts] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<User>({
    userName: "",
    data: "",
    gender: "male",
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

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

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditedUser(users[index]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

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
    const dateParts = editedUser.data
      ? editedUser.data.split("/")
      : ["", "", ""];

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
        updatedDate = editedUser.data;
    }

    setEditedUser((prevUser) => ({ ...prevUser, data: updatedDate }));
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedUser.userName.trim() === "" || editedUser.data.trim() === "")
      return;

    if (editIndex !== null) {
      onEditUser(editIndex, editedUser);
    }

    setEditIndex(null);
    setEditedUser({ userName: "", data: "", gender: "male" });
  };

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

  const getGiftSuggestions = (
    age: number,
    gender: string
  ): GiftSuggestion[] => {
    const suggestions: GiftSuggestion[] = [];

    const universalGifts = [
      { emoji: "📱", name: "Смартфон" },
      { emoji: "⌚", name: "Умные часы" },
      { emoji: "🎧", name: "Наушники" },
    ];

    const kidsGifts = [
      { emoji: "🎮", name: "Игровая приставка" },
      { emoji: "🧸", name: "Плюшевый медведь" },
      { emoji: "🎨", name: "Набор для творчества" },
      { emoji: "🚲", name: "Велосипед" },
    ];

    const teenGifts = [
      { emoji: "🛹", name: "Скейтборд" },
      { emoji: "🎸", name: "Гитара" },
      { emoji: "📸", name: "Фотоаппарат" },
      { emoji: "🎮", name: "Видеоигра" },
    ];

    const youngAdultGifts = [
      { emoji: "💻", name: "Ноутбук" },
      { emoji: "📚", name: "Электронная книга" },
      { emoji: "🎧", name: "Беспроводные наушники" },
      { emoji: "⌚", name: "Фитнес-браслет" },
    ];

    const adultGifts = [
      { emoji: "☕", name: "Кофемашина" },
      { emoji: "🏃‍♂️", name: "Абонемент в спортзал" },
      { emoji: "🧘‍♂️", name: "Массажное кресло" },
      { emoji: "🌿", name: "Набор для сада" },
    ];

    const maleGifts = [
      { emoji: "🎣", name: "Набор для рыбалки" },
      { emoji: "⚒️", name: "Набор инструментов" },
      { emoji: "🏃‍♂️", name: "Спортивная экипировка" },
    ];

    const femaleGifts = [
      { emoji: "💄", name: "Набор косметики" },
      { emoji: "💅", name: "Набор для маникюра" },
      { emoji: "👜", name: "Дизайнерская сумка" },
    ];

    if (age <= 12) {
      suggestions.push(...kidsGifts);
    } else if (age <= 19) {
      suggestions.push(...teenGifts);
    } else if (age <= 30) {
      suggestions.push(...youngAdultGifts);
    } else {
      suggestions.push(...adultGifts);
    }

    if (gender === "male") {
      suggestions.push(...maleGifts);
    } else {
      suggestions.push(...femaleGifts);
    }

    suggestions.push(...universalGifts);

    return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  return (
    <div className='usersTable'>
      <h2>Список пользователей</h2>
      {users.length === 0 ? (
        <p>Пользователей пока нету...</p>
      ) : (
        <table border={1}>
          <thead>
            <tr>
              <th>
                📛 <span>Имя</span>
              </th>
              <th>
                📅 <span>Дата рождения</span>
              </th>
              <th>
                🎂 <span>Исполниться</span>
              </th>
              <th>
                🎁 <span>Подарки</span>
              </th>
              <th>
                ⚙️ <span>Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const birthDate = user.data.split("/");
              const birthDay = parseInt(birthDate[0], 10);
              const birthMonth = parseInt(birthDate[1], 10);
              const birthYear = parseInt(birthDate[2], 10);

              let age = currentYear - birthYear;

              if (
                currentMonth < birthMonth ||
                (currentMonth === birthMonth && currentDay < birthDay)
              ) {
                age -= 1;
              }

              const selectedMonth = editedUser.data
                ? editedUser.data.split("/")[1]
                : "";
              const selectedYear = editedUser.data
                ? editedUser.data.split("/")[2]
                : "";
              const availableDays = getAvailableDays(
                selectedMonth,
                selectedYear
              );
              const availableMonths = getAvailableMonths(selectedYear);

              return (
                <tr key={index}>
                  <td>
                    {editIndex === index ? (
                      <input
                        type='text'
                        name='userName'
                        value={editedUser.userName}
                        onChange={handleChange}
                      />
                    ) : (
                      user.userName
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <div>
                        <select
                          value={
                            editedUser.data ? editedUser.data.split("/")[0] : ""
                          }
                          onChange={(e) =>
                            handleDateChange("day", e.target.value)
                          }
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
                          value={
                            editedUser.data ? editedUser.data.split("/")[1] : ""
                          }
                          onChange={(e) =>
                            handleDateChange("month", e.target.value)
                          }
                          required
                        >
                          <option value=''>Месяц</option>
                          {availableMonths.map((month, index) => {
                            const monthNum = index + 1;
                            const monthValue =
                              monthNum < 10
                                ? `0${monthNum}`
                                : monthNum.toString();
                            return (
                              <option key={index} value={monthValue}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                        <select
                          value={
                            editedUser.data ? editedUser.data.split("/")[2] : ""
                          }
                          onChange={(e) =>
                            handleDateChange("year", e.target.value)
                          }
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
                    ) : (
                      user.data
                    )}
                  </td>
                  <td>{age + 1}</td>
                  <td>
                    {showGifts === index ? (
                      <ul>
                        {getGiftSuggestions(age, user.gender).map((gift, i) => (
                          <li key={i}>
                            {gift.emoji} {gift.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <button onClick={() => setShowGifts(index)}>
                        🎁 <span>Показать подарки</span>
                      </button>
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <button onClick={handleSubmitEdit}>
                        ✅ <span>Сохранить</span>
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(index)}>
                          ✏️ <span>Редактировать</span>
                        </button>
                        <button onClick={() => onDeleteUser(index)}>
                          🗑️ <span>Удалить</span>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
