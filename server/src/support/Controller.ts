import nano from "nano"


export default class Controller {
  protected couch: nano.ServerScope

  constructor(couch: nano.ServerScope) {
    this.couch = couch
  }
}
