import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, 
    private angularFireStorage: AngularFireStorage) {

   }
   public insertar(coleccion, datos) {
    return this.angularFirestore.collection(coleccion).add(datos);
  } 

  public consultar(coleccion) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion, documentId) {
    console.log("Coleecion:" + coleccion+"\nDocumentId:" + documentId);
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
   }

   public consultarPorId(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  public uploadImage(imagenes, foto, imagenBase64){
    let storageRef = 
    this.angularFireStorage.ref(imagenes).child(foto);
      return storageRef.putString("data:image/jpeg;base64,"+imagenBase64, 'data_url');
  }

  public deleteFileFromURL (fileURL) {

    return this.angularFireStorage.storage.refFromURL(fileURL).delete();

  }
}
