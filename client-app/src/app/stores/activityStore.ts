import { toast } from "react-toastify";
import { setActivityProps, createAttend } from "./../common/ultil/ultil";
import { RootStore } from "./rootStore";
import { history } from "./../../index";
import { IActivity } from "./../models/Activity";
import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import agent from "../api/agent";
import { act } from "react-dom/test-utils";

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activitiesRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;

  @computed get activitiesByDate() {
    const result = this.groupActivitiesByDate(
      Array.from(this.activitiesRegistry.values())
    );
    return result;
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("Editing activity", () => {
        this.activitiesRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Editing activity error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("Deleting activity", () => {
        this.activitiesRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("Deleting activity error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("Load Activities in action.", () => {
        activities.forEach((act) => {
          setActivityProps(act, this.rootStore.userStore.user!);
          this.activitiesRegistry.set(act.id, act);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("Load activities action error.", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("Getting activity", () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activitiesRegistry.set(activity.id, act);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };
  @action clearActivity = () => {
    this.activity = null;
  };
  getActivity = (id: string) => {
    return this.activitiesRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      
      // asigning back data
      const attendee = createAttend(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      runInAction("Creating activity", () => {
        this.activitiesRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("Creating activity error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action attendActivity = async () => {
    const attendee = createAttend(this.rootStore.userStore.user!);
    try {
      this.loading = true;
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activitiesRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem signing up to activity.");
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activitiesRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling activity.");
    }
  };
}

// export default createContext(new ActivityStore());
