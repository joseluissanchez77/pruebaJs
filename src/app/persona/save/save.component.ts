import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PersonaService } from '../../service/persona.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ResponsePersona } from '../../interface/persona.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrl: './save.component.css'
})
export class SaveComponent implements OnInit {

  ActionBtn: string = 'Guardar';
  personFormInteface: ResponsePersona = {
    id: 0,
    name: '',
    age: 0,
    fechaNaciento: ''
  };



  ngOnInit(): void {

  }

  personForm = this.fb.group({
    fcn_nombre: ['', [Validators.required]],
    fcn_edad: ['', [Validators.required]],
    fcn_date_Of_Birth: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private personService: PersonaService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {

    activatedRoute.params.subscribe((prm) => {
      if (prm['id'] != undefined) {
        this.ActionBtn = 'Editar'
        this.getIdPersonData(prm['id']);

      }

    });


  }


  cancelarPersona() {
    this.personForm.reset();
    this.router.navigate(['']);
  }


  guardarEditarPersona() {
    let $id = this.personFormInteface.id;
    let $msj = $id == 0 ? "guardar" : "editar";

    if (this.personForm.valid) {
      Swal.fire({
        title: 'Esta seguro de ' + $msj + ' persona?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: $msj,
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {

          let $data = {
            id: this.personFormInteface.id,
            name: this.personForm.get('fcn_nombre')?.value,
            age: this.personForm.get('fcn_edad')?.value,
            fechaNaciento: this.personForm.get('fcn_date_Of_Birth')?.value
          };

          $id == 0 ? this.confirmarSave($data) : this.confirmarEditar($data);
        } else if (result.isDenied) {
          Swal.fire(
            'Accion cancelada, los datos fueron borrados del formulario',
            '',
            'info'
          );
        }
      });
    } else {
      this.personForm.markAllAsTouched();
    }
  }


  confirmarSave($data: any) {

    this.personService.savePerson($data).subscribe({
      next: (rpt) => {
        this.personForm.reset();
        this.router.navigate(['']);
      },
      error: (errorData) => {
        console.log(errorData);
        // this.loginError = errorData?.error?.detail;
      },
      complete: () => {
        this.personForm.reset();
        // this.formGroupProductos.get('fcn_categoria')?.setValue('');
        Swal.fire('Guardado!', '', 'success');
      },
    });
  }


  confirmarEditar($data: any) {

    this.personService.updatePerson($data).subscribe({
      next: (rpt) => {
        this.personForm.reset();
        this.router.navigate(['']);
      },
      error: (errorData) => {
        console.log(errorData);
        // this.loginError = errorData?.error?.detail;
      },
      complete: () => {
        this.personForm.reset();
        // this.formGroupProductos.get('fcn_categoria')?.setValue('');
        Swal.fire('Editado!', '', 'success');
      },
    });
  }

  getIdPersonData(id: number) {
    this.personService.getByIdPersonInt(id).subscribe({
      next: (rpt) => {

        const myDate = rpt.fechaNaciento;
        const formattedDate = this.datePipe.transform(myDate, 'yyyy-MM-dd');
        rpt.fechaNaciento = formattedDate!;

        this.personFormInteface = rpt;

      },
      error: (errorData) => {
        console.log(errorData);
      },
      complete: () => { },
    });
  }

  /**
 * get
 */

  get fcn_nombre() {
    return this.personForm.controls.fcn_nombre;
  }
  get fcn_edad() {
    return this.personForm.controls.fcn_edad;
  }
  get fcn_date_Of_Birth() {
    return this.personForm.controls.fcn_date_Of_Birth;
  }
}
