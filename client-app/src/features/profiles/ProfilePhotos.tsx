import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import PhotoUploadWidget from "../../app/common/photoUpload/PhotoUploadWidget";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    deletePhoto,
    loading,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };

  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="image" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map((photo) => (
                  <Card key={photo.id}>
                    <Image src={photo.url}></Image>
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          loading={loading && target === photo.id}
                          onClick={(e) => {
                            setMainPhoto(photo);
                            setTarget(e.currentTarget.name);
                          }}
                          basic
                          disabled={photo.isMain}
                          positive
                          content="Main"
                        ></Button>
                        <Button
                          name={photo.id}
                          disabled={photo.isMain}
                          onClick={(e) => {
                            deletePhoto(photo);
                            setDeleteTarget(e.currentTarget.name);
                          }}
                          loading={loading && deleteTarget === photo.id}
                          basic
                          negative
                          content="Trash"
                        ></Button>
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};
export default observer(ProfilePhotos);
