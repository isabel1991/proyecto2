import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  constructor(private firestoreService: FirestoreService,private router:Router) {
    
   }

  ngOnInit() {
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


}
