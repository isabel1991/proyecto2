import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Alumnado } from '../alumnado';
import { Router } from "@angular/router";

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  alumnadoEditando: Alumnado;  

  idAlumSelec: string;
  

  arrayColeccionAlumnado: any = [{
    id: "",
    data: {} as Alumnado
   }];

  



  constructor(private firestoreService: FirestoreService,private router:Router,private socialSharing: SocialSharing) {
    // Crear una tarea vacía
    this.alumnadoEditando = {} as Alumnado;
    this.alumnadoEditando.repetidor=false;
    this.obtenerListaAlumnado();
    

  }

  navigateToAlumno() {
    this.router.navigate(["/alumno/", this.idAlumSelec]);
  }

  navigateToNuevo() {
    this.router.navigate(["/alumno/", "nuevo"]);
  }

  navigateToHome() {
    this.router.navigate(["/home/"]);
  }

  navigateToAbout() {
    this.router.navigate(["/about-us/"]);
  }

  navigateToMap() {
    this.router.navigate(["/map/"]);
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("alumnados", this.alumnadoEditando).then(() => {
      console.log('Alumno/a creada correctamente!');
      this.alumnadoEditando= {} as Alumnado;
      this.alumnadoEditando.repetidor=false;
    }, (error) => {
      console.error(error);
    });
  }

  

  obtenerListaAlumnado(){
    this.firestoreService.consultar("alumnados").subscribe((resultadoConsultaAlumnado) => {
      this.arrayColeccionAlumnado = [];
      resultadoConsultaAlumnado.forEach((datosAlumnado: any) => {
        this.arrayColeccionAlumnado.push({
          id: datosAlumnado.payload.doc.id,
          data: datosAlumnado.payload.doc.data()
        });
      })
    });
  }



  selecAlumnado(alumSelec) {
    console.log("Alumno/a seleccionado/a: ");
    this.idAlumSelec = alumSelec.id;
    this.alumnadoEditando.foto = alumSelec.data.foto;
    this.alumnadoEditando.nombre = alumSelec.data.nombre;
    this.alumnadoEditando.apellidos = alumSelec.data.apellidos;
    this.alumnadoEditando.fechaNacimiento = alumSelec.data.fechaNacimiento;
    this.alumnadoEditando.curso = alumSelec.data.curso;
    this.alumnadoEditando.antiguedad = alumSelec.data.antiguedad;
    this.alumnadoEditando.asignaturas = alumSelec.data.asignaturas;
    this.alumnadoEditando.repetidor = alumSelec.data.repetidor;
    this.alumnadoEditando.total = alumSelec.data.total;

  }

  clicBotonBorrar() {
    this.firestoreService.borrar("alumnados", this.idAlumSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaAlumnado();
      // Limpiar datos de pantalla
      this.alumnadoEditando = {} as Alumnado;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("alumnados", this.idAlumSelec, this.alumnadoEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaAlumnado();
      // Limpiar datos de pantalla
      this.alumnadoEditando = {} as Alumnado;

    })
  }

  regularSharing() {
    this.socialSharing.share("Mi mensaje que comparto", null, null, null).then(() => {
      console.log("Se ha compartido correctamente");
    }).catch((error) => {
      console.log("Se ha producido un error: " + error);
    });
  }

  date_format(date)
{
     return (date.getDate()) + '/' +
            (date.getMonth()+1) + '/' +
            (date.getFullYear() + ' ').substring(2);

}



}
