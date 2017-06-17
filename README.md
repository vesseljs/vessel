# Vessel Framework

<sub>_Vessel.js is a work in progress!_</sub>

Vessel is javascript _(Typescript)_ client side framework. Which structures your application in a solid MVC providing tools like Virtual DOM, Dependency Injection, Services, Routing or an Event Dispatcher.


**Documentation: v1.0** _(work in progress)_

## Download and Installation

Packages installation via NPM

`npm install vesseljs`


Download the ready-to-go boilerplate (recommended)<br><sub>_(vessel-cli is coming!)_</sub> 

[Vessel (v1.0.0-pre) Boilerplate Download](#)

Then, run in the boilerplate directory

`npm install`


## Quick preview

### Models

Models are schemes of your data. We use **@attr** decorator to tell Vessel what properties are the attributes of our model, **@identifier** will set the property __'id'__ to be the identifier of the model. Also we can define an optional bridge service _(see example below)_ and **@validate** the setters.

```javascript
import { Model as BaseModel } from '@vessel/core';
import { attr, identifier, validate } from '@vessel/decorators';
import { ModelInterface } from '@vessel/types';

export class TodoModel extends BaseModel implements ModelInterface {

    @identifier
    @attr
    public id;

    @attr
    public author;

    @attr
    public body;

    @attr
    public date;

    protected bridge = 'service.todo';

    getId() {
        return this.attr.id;
    }

    setId(value) {
        this.attr.id = value;

        return this
    }


    getAuthor() {
        return this.attr.author;
    }

    @validate(
        function validateAuthor(value) {
            if (!(value.length >= 3 && value.length <= 20) ) {
                console.warn("Author length must be greater " +
                    "than 3 characters or less than 20.");
                return false;
            }
            return true;
        }
    )
    setAuthor(value) {
        this.attr.author = value;

        return this;
    }

    getBody() {
        return this.attr.body;
    }

    @validate(
        function validateBody(value) {
            if (!(value.length >= 0 && value.length <= 120) ) {
                throw TypeError("Body length must be less " +
                    "than 120 characters and must not be empty.");
            }
            return true;
        }
    )
    setBody(value) {
        this.attr.body = value;

        return this;
    }
}
```

### Collections


### Services

Your application is full of classes which perform useful actions, such as retrieving or processing data. That's the Service's component purpose. Services have two main objectives:
- Connect your application with external data —like Storage or a Rest Api— : **RemoteServices**.
- Perform the same actions among the controllers —for example, processing data— : **Services**.

You can create your own RemoteServices, so you have full control over your requests or you can code your own **Bridge Services**. This services are a special kind of pre-configured RemoteServices, which allows you to use collection.fetch(), model.fetch(), model.save(), model.remove() methods. For example, we're gonna use the HttpBridge so we can use our remote methods.

Here, we define what is the endpoint and how we're serializating and retrieving the information as well. E.g.: the **create** method is telling the bridge to set the model id when it is saved and to return this model so when we perform a model.save(), the framework will execute a request as follows: ```POST /model/{id}```. Then it will set the model id to be the id which the server just created and given to us. At this point, you may notice that, what the create() method returns is exactly what the model.save() will return as a promise _(see a controller example below)_. 

```javascript
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
```

When a method crud is used by both collection and model such as read, Vessel will automatically perform the requests accordingly: ```GET /collection``` or ```GET /model/{id}```. E.g.: todoCollection.fetch() will trigger a ```GET /todos``` request, todoModel.fetch() will produce a ```GET /todos/3``` assuming TodoModel exists and has the id _3_.

If your application needs to return different results depending on what the obj is: a model or a collection you can use ```isModel(obj)``` or ```isCollection(obj)``` so you can define what will the collection.fetch() and model.fetch() retrieve using the same bridge service.

### Dependency Injection

Vessel provides a dependency injector so you don't have to worry about instantiating classes or booting up your application when you need the same instance for multiple purposes (Services, Controllers, Views, Collections, etc.). First, you have to register your modules, this is an example of a modules.ts file:

```javascript
import { TodoController } from '../controller/TodoController';

import { TodoModel } from '../model/TodoModel';

import { TodoCollection } from '../collection/TodoCollection';
import { ThirdCollection } from '../collection/ThirdCollection';
import { TestCollection } from '../collection/TestCollection';
import { FourthCollection } from '../collection/FourthCollection';
import { FifthCollection } from '../collection/FifthCollection';

import { TodoView } from '../view/TodoView';

import { TodoService } from '../service/TodoService';

export const modules = {

    models: {
        'model.todo': TodoModel,
    },

    controllers: {
        'controller.todo': TodoController
    },

    collections: {
        'collection.todo': TodoCollection,
        'collection.test': TestCollection,
        'collection.third': ThirdCollection,
        'collection.fourth': FourthCollection,
        'collection.fifth': FifthCollection
    },

    views: {
        'view.todo': TodoView
    },

    services: {
        'service.todo': TodoService
    }

}; ```

This file has to be imported from the main.ts of your application.

```javascript
import { RouterBoot } from '@vessel/router';
import { VirtualDOMBoot } from '@vessel/dom';

import { app as appConfig } from './config/app';
import { modules } from './config/modules';
import { BaseApp } from '@vessel/core';
import { bootable } from '@vessel/decorators';

@bootable
class App extends BaseApp {

    public registerConfig() {
        return appConfig;
    }

    public registerModules() {
        return modules;
    }

    public registerPackages() {
        return [
            new RouterBoot(),
            new VirtualDOMBoot()
        ];
    }

    public getGlobalName() {
        return '$App';
    }

}
```

Notice how the modules are registered within the registerModules() method. The Vessel's Kernel will register this configuration and your modules will be ready to go! Once you have registered your modules, you can use the injector.

#### get(<module name>) Method

The get method is included in our **Collection, View, Model, Service** and **Controller** classes and it is a _container.get()_ alias. This method will return a single instance of the given **module name** and resolve its dependencies recursively. When a module is resolved, all the dependencies specified by the @get Decorator are injected to its instance. You will be warned if a circular dependency is detected.

```javascript
   // import [...]
   
   class MyController extends BaseController {
        
        method() {
            // Resolve the module TodoCollection and its dependencies
            // recursively.
            let collection = this.get('todo.collection'); 
        }
   }
```

#### @get(<module name>) Decorator

The @get() decorator can be used to add dependencies to a class. Note that this will not actually inject any dependencies. This dependencies are resolved when the class, which we're applying our decorator to, is loaded by a .get() method or the class it's a dependency of a class which is being loaded by the .get() method.

<sub>_MyCollection.ts (module name: todo.collection)_</sub>
```javascript
   // import [...]
   
   class MyCollection extends BaseCollection {
        
       @get('testService') 
       public testService;
       
   }
```

<sub>_MyController.ts (module name: todo.controller)_</sub>
```javascript
   // import [...]
   
   class MyController extends BaseController {
        
        method() {
            // Collection will be resolved, as well as its dependency testService.
            let collection = this.get('todo.collection');
        }
   }
```

<sub>_AnotherController.ts (module name: todo.controller_two)_</sub>
```javascript
   // import [...]
   
   class MyController extends BaseController {
        
        method() {
            // Same collection as the MyController one.
            let collection = this.get('todo.collection');
        }
   }
```



Limitations:

- You can't use a @get dependency within a constructor, as it is injected right after the instantiation. That said, this is wrong:

```javascript
   // import [...]
   
   class MyController extends BaseController {
        
        @get('collection')
        public myCollection;
        
        constructor() {
            let collection = this.myCollection // will be undefined.
        }
        
        method() {
            let collection = this.myCollection // will be fine.
        }
   }
```

But you can always use this.get(), this is a working snippet for the code right above:

```javascript
   // import [...]
   
   class MyController extends BaseController {
        public myCollection;
        
        constructor() {
            this.myCollection = this.get('collection') // will be fine.
        }
        
        method() {
            this.myCollection = will be fine.
        }
   }
```

- You can't use a @get dependency within classes that will have more than one instance, for example a TodoModel will be instantiated several times at runtime so dependency injection have no sense and they're not gonna be resolved since you're not starting a model with the container.get() method. However, this.get() can be used within models so, for example, you can get a service (which is not recommended, models should be used only for data schemes).

### Controllers

### Views
