/**
 * Standard interfaces
 */

export interface ModelInterface {
    __metadata__ ?: string[];
}

export interface ViewInterface {

}

export interface CollectionInterface {

}

export interface HttpInterface {

}

export interface StorageInterface {

}

export interface AppInterface {
    can: any;
    browserBoot(): AppInterface;
}