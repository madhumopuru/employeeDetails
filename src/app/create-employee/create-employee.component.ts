import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateEmployeeComponent implements OnInit {

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  minDate = new Date(Date.now());
  maxDate = new Date(Date.now());
  startDate: Date;
 



  firstNameForm = new FormControl();
  lastNameForm = new FormControl();
  emailForm = new FormControl();
  ageForm = new FormControl();
  genderForm = new FormControl();
  dobForm = new FormControl();

  constructor(public dialog: MatDialog, private router: Router) {}
  employeeArry=[]

 
  count=0;
  ngOnInit(){
    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.startDate = this.maxDate;
    localStorage.clear();
  
  
  }
 
  

  genericAlert(title,body) {
    this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: {title: title,body:body,actions:["Ok"]}
    });
  }

  submitEmployee(){

    let params = {};

    if(!this.firstNameForm.valid) {
      this.genericAlert("Invalid First Name","Please Enter First Name");
      return;
    }
    params["firstName"] = this.firstNameForm.value;

    if(!this.lastNameForm.valid) {
      this.genericAlert("Invalid Last Name","Please Enter Last Name");
      return;
    }
    
    params["lastName"] = this.lastNameForm.value;

    if (!this.emailForm.valid) {
      this.genericAlert("Invalid Email", "Please Enter Email Format");
      return;
    }

    params["email"] = this.emailForm.value;

    if (!this.ageForm.valid) {
      this.genericAlert("Invalid Age", "Please Enter Age");
      return;
    }

    params["age"] = this.ageForm.value;

    if (!this.genderForm.valid) {
      this.genericAlert("Invalid Gender", "Please Select Gender");
      return;
    }

    params["gender"] = this.genderForm.value;

    if (this.dobForm.value === null) {
      this.genericAlert("Invalid DOB", "Please Select Dateof Birth");
      return;
    }

    let dt_evaluate: string = this.dobForm.value;
    let dt_evaluate_date: Date = new Date(dt_evaluate);
    params["dateofBirth"] = moment(dt_evaluate_date).format("YYYY-MM-DD");

    params["id"] = new Date().getTime();


    this.employeeArry.push(params)


    var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

    oldItems.push(params);

    localStorage.setItem('itemsArray', JSON.stringify(oldItems));
  
   this.router.navigate(['employeeDetails']);

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: {  body: "Successfully you have created employee", actions: ["OK"] }
    });

    
  }
 
}

