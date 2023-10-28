export const generateBase64FromImage = (
    imageFile: any
    ): Promise<string | ArrayBuffer | null | undefined> => {
      if (!imageFile) {
        return new Promise((resolve, reject) => {});
      }
      
      const reader = new FileReader();
      const promise = new Promise(
        (
          resolve: (result: string | ArrayBuffer | null | undefined) => void,
          reject: (reason: any) => void
          ) => {
            reader.onload = (e: ProgressEvent<FileReader>) =>
            resolve(e.target?.result);
            reader.onerror = (err) => reject(err);
          }
          );
          
          reader.readAsDataURL(imageFile);
          return promise;
  }
  