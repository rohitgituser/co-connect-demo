
import { Component,NgZone } from '@angular/core';
import { LoadingScreenService } from "../services/loading-screen.service";
import { Subscription,Subject } from "rxjs";


@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent  {

  isLoading: Subject<boolean> = this.loadingScreenService.isLoading;

  constructor(private loadingScreenService: LoadingScreenService, public zone:NgZone) {
      
  }

}