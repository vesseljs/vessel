/**
 * Standard definitions
 */

export interface ModelInterface {
    __metadata__: string[];
}

export interface ViewInterface {

}

export interface CollectionInterface {

}

export interface HttpInterface {

}

export interface StorageInterface {

}

/**
 * Private framework definitions
 */

export interface WindowInterface extends Window {
    $Vessel: any;
}

export interface AppInterface {
}