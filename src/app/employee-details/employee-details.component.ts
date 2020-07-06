import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table'
import {MatSort} from '@angular/material/sort';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { EditemployeeComponent } from '../editemployee/editemployee.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(public dialog: MatDialog,  private router: Router) { }

  displayedColumns: string[] = ['employeecount', 'firstName', 'lastName', 'email', 'age', 'gender', 'dateofBirth', 'columndelete']; // pagination code


  employeeData:employeeDetails[] = [];

  dataSource = new MatTableDataSource<employeeDetails>(this.employeeData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  ngOnInit(): void {
    setTimeout(() => this.dataSource.paginator = this.paginator); 
    setTimeout(() => this.dataSource.sort = this.sort); 
    this.tableData()
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

    
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      if(value.id == row_obj.id){
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
    this.dataSource.data = this.dataSource.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.id = (idx + 1), i));
      localStorage.setItem('itemsArray', JSON.stringify( this.dataSource.data));
  }
  genericAlert(title,body) {
    this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: {title: title,body:body,actions:["Ok"]}
    });
  }

  locationBack(){
    this.router.navigate(['createEmployee']);
  }
}

export interface employeeDetails{
  id:number;
  firstName: string; 
  lastName: string;
  email: string; 
  age: string;
  gender: string; 
  dateofBirth: string; 

}
