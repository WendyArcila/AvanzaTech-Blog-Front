import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {



  constructor() { }

  setStorage(key:string ,value: string ){
      localStorage.setItem(key, value);
  }

  getStorage(key:string ):string | undefined {
      return localStorage.getItem(key) || undefined;
  }

  deleteStorage(key:string){
      localStorage.removeItem(key);
  }

  deleteAllStorage(){
      localStorage.clear();
  }
}
