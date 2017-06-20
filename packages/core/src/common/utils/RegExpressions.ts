export class RegExpressions {

    public static EVENT_EXP = /^on/i;

    public static LAST_AMPERSAND = /\&$/;

    public static LAST_URL_SLASH = /\/+$/;

    public static ROUTE_PATH_PARAMETER = /(:)(\w+)/g;

    public static GET_PARAMETER = /\?([\w\&\=]*)/;
}