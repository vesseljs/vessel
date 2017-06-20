export class Strategy {

    private currentStrategy;

    public static HashStrategy = 'hash';

    public static HistoryStrategy = 'history';

    public constructor(strategy) {
        this.currentStrategy = strategy;
    }

    public getStrategy() {
        return this.currentStrategy
    }

    public setStrategy(strategy: string) {
        this.currentStrategy = strategy;

        return this;
    }

    public isHistory() {
        return this.getStrategy() === Strategy.HistoryStrategy
    }

    public isHash() {
        return this.getStrategy() === Strategy.HashStrategy
    }

}