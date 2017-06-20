export class Route {

    private path: string;

    private pathExp: RegExp;

    private bound: Function;

    private context: Function;

    private generatedPath;

    public constructor(private name: string) {}

    public setParameter(param, value) {
        let path = this.generatedPath
                ? this.generatedPath
                : this.path;
        return this.generatedPath = path.replace(':'+param, value);
    }

    public getResult() {
        let generated = this.generatedPath;
        this.generatedPath = void 0;
        return generated;
    }

    public getName() {
        return this.name;
    }

    public getPath() {
        return this.path;
    }

    public setPath(path) {
        this.path = path;

        return this;
    }

    public getRegExpPath() {
        return this.pathExp;
    }

    public setRegExpPath(pathExp) {
        this.pathExp = pathExp;

        return this;
    }

    public getBound() {
        return this.bound;
    }

    public setBound(bound) {
        this.bound = bound;

        return this;
    }

    public getContext() {
        return this.context;
    }

    public setContext(context) {
        this.context = context;

        return this;
    }

}