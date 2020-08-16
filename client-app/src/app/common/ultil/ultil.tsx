import { IActivity, IAttendee } from "../../models/Activity";
import { IUser } from "../../models/User";

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dateString = `${year}-${month}-${day}`;

  return new Date(dateString + " " + timeString);
};

export const setActivityProps = (act: IActivity, user: IUser) => {
  act.date = new Date(act.date);
  act.isGoing = act.attendees.some((a) => a.username === user?.username);
  act.isHost = act.attendees.some(
    (a) => a.username === user?.username && a.isHost
  );
  return act;
};

export const createAttend = (user : IUser) : IAttendee =>{
  return {
    displayName: user.displayName,
    isHost: false,
    username : user.username,
    image : user.image!
  }
}
