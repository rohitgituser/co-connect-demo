import { Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core'
import { AuthService } from '../helpers/auth.service';

/**
* Role Based Authorization Component Show (RbacShow) Directive
* Directive to show component based on role array passed 
*
**/
@Directive({
    selector: '[rbacShow]'
})
export class RbacShowDirective {

    allowedRoles: string[]

    constructor(private authService: AuthService, private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef){

    }

    @Input('rbacShow')
    set rbacShow(allowedRoles: string[]){
        this.allowedRoles = allowedRoles
        if(!this.allowedRoles || this.allowedRoles.length === 0 || !this.authService.getAuthUser()){
            this.viewContainer.clear()
            return
        }

        const allowed: boolean = this.allowedRoles.includes(this.authService.getAuthUser().role)
        if(allowed)
            this.viewContainer.createEmbeddedView(this.templateRef)
        else
            this.viewContainer.clear()
    }
}