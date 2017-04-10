import { defineProp } from '../../../../common/utils/src/utilities';

export class AttribProxy {

    public data = <any>{};

    public addAttribute( name ) {
        this.data[name] = "";
        defineProp(this, name,
            function getter() {
                return this.data[name];
            },
            function setter( value ) {
                this.data[name] = value;
            }
        )
    }

}