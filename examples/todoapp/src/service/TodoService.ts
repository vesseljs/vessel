import { Bridge as BaseBridge } from '@vessel/core';

export class TodoService extends BaseBridge {

    protected endPoint = '/todos';

    protected getResponse(response) {
        return JSON.parse(response.data);
    }

    public create(jsonResponse, model) {
        model.setId(jsonResponse.id);
        return model;
    }

    public read(jsonResponse, obj) {
        return obj;
    }

    public update(jsonResponse, model) {
        return model;
    }

    public destroy(jsonResponse) {
        return jsonResponse.id;
    }


}