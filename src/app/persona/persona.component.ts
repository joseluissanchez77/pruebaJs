import { Component, Input, OnInit } from '@angular/core';
import { PersonaService } from '../service/persona.service';
import { FormBuilder } from '@angular/forms';
import { ResponsePersona } from '../interface/persona.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css'
})
export class PersonaComponent implements OnInit {

  @Input() objGetPerson: ResponsePersona[] | any = [];

  constructor(
    private personaService: PersonaService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.personas();
  }

  ngOnInit(): void {

  }




  personas() {

    this.personaService.getPersons().subscribe({
      next: (rpt: ResponsePersona) => {
        console.log(rpt);
        this.objGetPerson = rpt;
        // this.collectionSize = rpt.total;
      },
      error: (e) => {
        console.log(e);
        // this.loading = false;
      },
    });
  }


  deletePersonRowConfirm(data: ResponsePersona) {
    Swal.fire({
      title: 'Esta seguro de borrar persona?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Borrar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.deletePerson(data);
      } else if (result.isDenied) {
        // this.cancelarProducto();
        Swal.fire('Accion cancelada', '', 'info');
      }
    });
  }


  deletePerson(data: ResponsePersona) {
    this.personaService.deletePerson(data).subscribe({
      next: (rpt) => {
        // this.productos();
        console.log(rpt);
      },
      error: (errorData) => {
        console.log(errorData);
        // this.loginError = errorData?.error?.detail;
      },
      complete: () => {
        this.personas();
        Swal.fire('Persona Borrada!', '', 'success');
      },
    });
  }



  dataPersonRow(data: ResponsePersona) {

  }


  btnAddPerson() {
    this.router.navigate(["person-save"]);
  }

  btnUpdatePerson($event: ResponsePersona) {
    this.router.navigate(["person-update", $event.id]);
  }

}
