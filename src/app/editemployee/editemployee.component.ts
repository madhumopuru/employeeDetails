import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditemployeeComponent implements OnInit {
  
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

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditemployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public  data: {employeeDetails: any}) {

    }
  empcount;
  empfirstName;
  empLastName;
  empemaail;
  empage;
  empgender;
  empdob;

  ngOnInit(): void {
    let empdetails = this.data.employeeDetails
   // console.log(this.data.employeeDetails)
    this.empfirstName = empdetails.firstName;
    this.empLastName = empdetails.lastName;
    this.empemaail = empdetails.email;
    this.empage = empdetails.age;
    this.empgender = empdetails.gender;
    this.empdob =  new Date(empdetails.dateofBirth);
    this.empcount = empdetails.employeecount;
    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.startDate = this.maxDate;

   
   
  }
  
  onNoClick(){
    let params;
    this.dialogRef.close({data:params});
  }
  editEmployee(){

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

    params["employeecount"] = this.empcount;

    //console.log(params)
    this.dialogRef.close({data:params});

  }

  genericAlert(title,body) {
    this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: {title: title,body:body,actions:["Ok"]}
    });
  }

}

export interface employeeDetails{
  employeecount: number;
  firstName: string; 
  lastName: string;
  email: string; 
  age: string;
  gender: string; 
  dateofBirth: string; 

}

