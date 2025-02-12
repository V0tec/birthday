import { useEffect, useCallback } from "react";

interface User {
  userName: string;
  data: string;
  gender: "male" | "female";
}

interface NotificationProps {
  users: User[];
}

const BirthdayNotification: React.FC<NotificationProps> = ({ users }) => {
  const checkBirthday = useCallback((birthDate: string): number => {
    const [day, month] = birthDate.split("/").map((num) => parseInt(num));
    const today = new Date();

    const currentYear = today.getFullYear();
    const birthdayThisYear = new Date(currentYear, month - 1, day);

    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(currentYear + 1);
    }

    const timeDiff = birthdayThisYear.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }, []);

  const playNotification = useCallback(
    async (userName: string, daysLeft: number) => {
      try {
        const sound = new Audio("/notification.mp3");
        await sound.play();

        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("Напоминание о дне рождения", {
              body:
                daysLeft === 0
                  ? `Сегодня день рождения у ${userName}!`
                  : `Через ${daysLeft} дня день рождения у ${userName}!`,
              icon: "/birthday-icon.png",
            });
          } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              playNotification(userName, daysLeft);
            }
          }
        }
      } catch (error) {
        console.error("Error playing notification:", error);
      }
    },
    []
  );

  useEffect(() => {
    const checkNotifications = () => {
      users.forEach((user) => {
        const daysLeft = checkBirthday(user.data);
        const notificationKey = `birthday_notification_${user.userName}_${user.data}`;
        const lastNotified = localStorage.getItem(notificationKey);
        const today = new Date().toDateString();

        if ((daysLeft === 3 || daysLeft === 0) && lastNotified !== today) {
          playNotification(user.userName, daysLeft);
          localStorage.setItem(notificationKey, today);
        }
      });
    };

    checkNotifications();

    const intervalId = setInterval(checkNotifications, 60 * 60 * 1000);

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [users, checkBirthday, playNotification]);

  return null;
};

export default BirthdayNotification;
