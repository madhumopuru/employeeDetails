import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import {MatDialog} from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
import { EditemployeeComponent } from './editemployee/editemployee.component';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {


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

  constructor(public dialog: MatDialog) {}
  employeeArry=[]

  displayedColumns: string[] = ['employeecount', 'firstName', 'lastName', 'email', 'age', 'gender', 'dateofBirth', 'columndelete']; // pagination code


  employeeData:employeeDetails[] = [];

  dataSource = new MatTableDataSource<employeeDetails>(this.employeeData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  count=0;
  ngOnInit(){
    this.maxDate.setDate(this.maxDate.getDate());
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.startDate = this.maxDate;
    localStorage.clear();
    setTimeout(() => this.dataSource.paginator = this.paginator); 
    setTimeout(() => this.dataSource.sort = this.sort); 
    
     
  }
  tableData(){
   
    let result = JSON.parse(localStorage.getItem('itemsArray'));
    this.employeeData = result
    this.dataSource = new MatTableDataSource<employeeDetails>(this.employeeData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteEmployee(elm){
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: {  body: "Are you sure you want to delete Employee?", actions: ["Cance","OK"] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "OK") {
        this.delete(elm)
      }
    });
  }

  editEmployee(elm){
    const dialogRef = this.dialog.open(EditemployeeComponent, {
      disableClose: true,
      width: '300px',
      data: {  employeeDetails: elm }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data ===  undefined) {
         console.log("No data")
      }
      else{
        //console.log(result.data)
        this.updateRowData(result.data)
      }
    });
  }

  updateRowData(row_obj){
    // this.dataSource.data = this.dataSource.data
    // .filter(i => i !== elm)
    // .map((i, idx) => (i.employeecount = (idx + 1), i));
    // localStorage.setItem('itemsArray', JSON.stringify( this.dataSource.data));
    // this.count = this.count - 1;
    
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      if(value.employeecount == row_obj.employeecount){
        value.firstName = row_obj.firstName;
        value.lastName = row_obj.lastName;
        value.email = row_obj.email;
        value.age = row_obj.age;
        value.gender = row_obj.gender;
        value.dateofBirth = row_obj.dateofBirth;
        localStorage.setItem('itemsArray', JSON.stringify( this.dataSource.data));
      }
      return true;
    });
  }



  delete(elm) {
    //console.log(elm)
    this.dataSource.data = this.dataSource.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.employeecount = (idx + 1), i));
      localStorage.setItem('itemsArray', JSON.stringify( this.dataSource.data));
      this.count = this.count - 1;
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

    this.count=this.count+1;
    params["employeecount"] = this.count;

    this.employeeArry.push(params)


    var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

    oldItems.push(params);

    localStorage.setItem('itemsArray', JSON.stringify(oldItems));
  
    this.tableData()

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: {  body: "Successfully you have created employee", actions: ["OK"] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "OK") {
        this.clearForm()
      }
      else{
        this.clearForm()
      }
    });
  }
  clearForm(){
    this.firstNameForm = new FormControl();
    this.lastNameForm = new FormControl();
    this.emailForm = new FormControl();
    this.ageForm = new FormControl();
    this.genderForm = new FormControl();
    this.dobForm = new FormControl();
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

