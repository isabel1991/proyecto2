import { Component, OnInit } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Alumnado } from '../alumnado';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
  
  
})
export class AlumnoPage implements OnInit {

  id = null;
  alumnadoEditando=null;
  
  document: any = {
    id: "",
    data: {} as Alumnado,
    
  };
  constructor(private activatedRoute: ActivatedRoute,public alertController: AlertController, private firestoreService: FirestoreService, private router:Router, 
    private loadingController: LoadingController, private toastController: ToastController, private imagePicker: ImagePicker,
    private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.firestoreService.consultarPorId("alumnados", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Alumnado;
      } 
    });
    
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("alumnados", this.id, this.document.data).then(() => {
      // Actualizar la lista completa
      console.log("Id: " + this.id );
      console.log(this.document.data);
      // Limpiar datos de pantalla
      this.document.data = {} as Alumnado;
      this.router.navigate(["/home/"]);

    })
  }




  // clicBotonBorrar() {
  //   this.firestoreService.borrar("alumnados", this.id).then(() => {
  //     // Limpiar datos de pantalla
  //     this.document.data = {} as Alumnado;
  //     this.router.navigate(["/home/"]);
  //   })
  // }

    clicBotonInsertar() {
      this.firestoreService.insertar("alumnados", this.document.data).then(() => {
        console.log('Alumno/a creada correctamente!');
        this.document.data= {} as Alumnado;
        this.document.data.repetidor=false;
        this.router.navigate(["/home/"]);
      }, (error) => {
        console.error(error);
      });
    }


    async uploadImagePicker() {
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
    
      //Mensaje de finalización de subida de la imagen 
      const toast = await this.toastController.create({
        message:'Image was update successfully',
        duration: 3000
      });

      //Comprobar si la aplicación tiene permisos de lectura
      this.imagePicker.hasReadPermission().then(
        (result) => {

          //Si no tiene permiso de lectura se solicita al usuario
          if(result ==false){
            this.imagePicker.requestReadPermission();

          }
          else{
            //Abrir selector de imágenes (IMagePicker)
            this.imagePicker.getPictures({
              maximumImagesCount: 1, //Permitir sólo 1 imagen
              outputType: 1 //1=Base64
            }).then (
              (results) => { //En la variable results se tienen las imagenes seleccionadas
                //Carpeta del Storage donde se almacenará la imagen
                let imagenes = "imagenes";
                //Recorrer todas las imagenes que haya seleccionado el usuario
                //aunque realmente solo será 1 como se ha indicado en las opciones
                for (var i=0; i<results.length; i++) {
                  //mostrar el mensaje de espera
                  loading.present();
                  //Asignar el nombre de la imagen en función de la hora actual para 
                  //evitar duplicados de nombres
                  let foto = `${new Date().getTime()}`;
                  //Llamar al método que se sube la imagen al Storage
                  this.firestoreService.uploadImage(imagenes,foto,results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                      console.log("downloadURL:"+downloadURL);
                      if(this.document.data.foto!= null){
                        this.deleteFile(this.document.data.foto);
                      }
                      //Aquí guardamos la url en el campo que nos interesa
                      this.document.data.foto = downloadURL;
                      toast.present();
                      loading.dismiss();
                    })
                  })
                }
              },
              (err) => {
                console.log(err)
              }
            );
          }
        }, (err) => {
          console.log(err);
        });
      
    }
  

    async deleteFile(fileURL){
      const toast = await this.toastController.create({
        message: 'File was deleted seccessfully',
        duration: 3000
      });
      this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
    }
  

    async clicAlertConfirm() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirme',
        message: '¿Desea borrar a '+ this.document.data.nombre+ "?",
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              this.router.navigate(["/home/"]);
              
            }
          }, {
            
            text: 'OK',        
            handler: () => {
              console.log("FOTO: "+ this.document.data.foto);
              console.log("Nombre: "+ this.document.data.nombre);
              if(this.document.data.foto!= null){
                this.deleteFile(this.document.data.foto);
                
              }
              this.firestoreService.borrar("alumnados", this.id).then(() => {
                // Limpiar datos de pantalla
               // console.log("FOTO: "+ this.document.data.foto);
                

                this.document.data = {} as Alumnado;
               
                this.router.navigate(["/home/"]);
              
              })
            }
          
            }
      
        ]
      });
  
      await alert.present();
    }

    regularShare() {
      this.socialSharing.share(`El/la mejor alumno/a es: 
        Nombre: ${this.document.data.nombre}
        Apellidos: ${this.document.data.apellidos}`, null, null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
    }

    whatsappShare(){
       this.socialSharing.shareViaWhatsApp("El/la mejor alumno/a es: " + "\n" + "Nombre: " + this.document.data.nombre + "\n" + "Apellidos: " + this.document.data.apellidos,null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
     }

     twitterShare(){
      this.socialSharing.shareViaTwitter("El/la mejor alumno/a es: " + "\n" + "Nombre: " + this.document.data.nombre + "\n" + "Apellidos: " + this.document.data.apellidos,null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
    }
    
    facebookShare(){
       this.socialSharing.shareViaFacebook("El/la mejor alumno/a es: " + "\n" + "Nombre: " + this.document.data.nombre + "\n" + "Apellidos: " + this.document.data.apellidos,null, null).then(() => {
        alert("Enviado")
      }).catch((error) => {
        console.log("Se ha producido un error: " + error);
      });
     }

}


//ESTO ES LO QUE TENÍA QUE BORRAR -- CORREGIDO 




// const routes: Routes = [
//   { path: "", redirectTo: "home", pathMatch: "full" },
//   { path: "home", loadChildren: "./home/home.module#HomePageModule" },
//   { path: "alumno/:id", loadChildren: "./alumno/alumno.module#AlumnoPageModule" }
// ];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}