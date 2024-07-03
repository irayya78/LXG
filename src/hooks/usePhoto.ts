import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface Photo {
  filepath: string;
  webviewPath?: string;
  base64Data?: string;
}

export const usePhoto = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const base64Data = await base64FromPath(photo.webPath!);
    const newPhoto = {
      filepath: new Date().getTime() + '.jpeg',
      webviewPath: photo.webPath,
      base64Data,
    };

    setPhotos([...photos, newPhoto]);
  };

  const selectPhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
    });

    const base64Data = await base64FromPath(photo.webPath!);
    const newPhoto = {
      filepath: new Date().getTime() + '.jpeg',
      webviewPath: photo.webPath,
      base64Data,
    };

    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (filepath: string) => {
    setPhotos(photos.filter((photo) => photo.filepath !== filepath));
  };

  const base64FromPath = async (path: string): Promise<string> => {
    const response = await fetch(path);
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };

  return {
    photos,
    takePhoto,
    selectPhoto,
    removePhoto,
  };
};