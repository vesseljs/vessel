import { HttpBridge } from '@vessel/core';

export class TodoService extends HttpBridge {

    protected endPoint = '/weather';

    protected getResponse(response) {
        return JSON.parse(response);
    }

    public create(jsonResponse, model) {
        model.setId(jsonResponse.id);
        return model;
    }

    public read(jsonResponse, obj) {
        return jsonResponse;
    }

    public update(jsonResponse, model) {
        return model;
    }

    public destroy(jsonResponse) {
        return jsonResponse.id;
    }


}