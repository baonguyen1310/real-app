import { IActivity } from "./../models/Activity";
import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";

configure({enforceActions : 'always'});

export class ActivityStore {
  @observable activitiesRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = '';

  @computed get activitiesByDate() {
    return Array.from(this.activitiesRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('Editing activity',()=>{
        this.activitiesRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction('Editing activity error',()=>{
        this.submitting = false;
      })
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
      runInAction('Deleting activity',()=>{
        this.activitiesRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      })
    } catch (error) {
      runInAction('Deleting activity error',()=>{
        this.submitting = false;
        this.target = '';
      })
      console.log(error);
    } 
  };
  @action openEditForm = (id: string) => {
    this.selectActivity = this.activitiesRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('Load Activities in action.',()=>{
        activities.forEach((act) => {
          act.date = act.date.split(".")[0];
          this.activitiesRegistry.set(act.id, act);
        });
        this.loadingInitial = false;
      })
    } catch (error) {
      runInAction('Load activities action error.',()=>{
        this.loadingInitial = false;
      })
      console.log(error);
    }
  };

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activitiesRegistry.get(id);
    this.editMode = false;
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction('Creating activity',()=>{
        this.activitiesRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      })
    } catch (error) {
      runInAction('Creating activity error',()=>{
        this.submitting = false;
      })
      console.log(error);
    } 
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };
}

export default createContext(new ActivityStore());
