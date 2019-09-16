import template from './template';
import Model from './model';
import View from './view';
import Controller from './controller';

const easychat = new Easychat({
  apiKey: '2b8ed76c93763b0',
});

const model = new Model(easychat);
const view = new View(template);
const controller = new Controller(model, view);

controller.init();
