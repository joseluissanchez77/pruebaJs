import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponsePersona } from '../interface/persona.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  URL_API = environment.API_URL;

  constructor(private http:HttpClient) { }

  getPersons():Observable<ResponsePersona>{


    let direcion =`${this.URL_API}Persona`;

    return this.http.get<ResponsePersona>(direcion);

  }

  savePerson( person : ResponsePersona){
    return this.http.post(`${this.URL_API}Persona`, person);
  }

  getByIdPersonInt(id: number) {
    let direcion = `${this.URL_API}Persona/id:int?id=${id}`;

    return this.http.get<ResponsePersona>(direcion);
  }

  updatePerson(person: ResponsePersona) {
    return this.http.put(`${this.URL_API}Persona/${person.id}`, person);
  }


  deletePerson(person: ResponsePersona) {
    return this.http.delete(`${this.URL_API}Persona/${person.id}`);
  }

}
