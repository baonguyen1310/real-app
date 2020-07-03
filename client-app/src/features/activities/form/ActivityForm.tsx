import React, { useState, FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/Activity";
import { v4 as uuid} from 'uuid';
import { observer } from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore';
interface IProps {
  activity: IActivity;
}
export const ActivityForm: React.FC<IProps> = ({
  activity: initialFormState
}) => {
  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity,submitting, cancelFormOpen} = activityStore;
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id : '',
        title : '',
        description : '',
        category : '',
        date: '',
        city: '',
        venue: '',
      }
    }
  };

  const [activity, setActivity] = useState(initializeForm);

  const handleInputForm = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () =>{
      if(activity.id.length === 0){
        let newActivity = {
          ...activity,
          id: uuid()
        }
        createActivity(newActivity);
      }else{
        editActivity(activity);
      }
  }
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputForm}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputForm}
          name="description"
          rows={2}
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputForm}
          name="category"
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputForm}
          name="date"
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputForm}
          name="city"
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputForm}
          name="venue"
          placeholder="Venue"
          value={activity.venue}
        />
        <Button loading ={ submitting } floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={cancelFormOpen}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);