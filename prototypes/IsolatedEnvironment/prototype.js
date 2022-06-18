isolatedEnvironment = {
  "location" : "http://localhost/IsolatedEnvironment.html",
  "window" : undefined,
  "eval" : async (evalString, doesReturn) => {
    console.warn("Sending the isolated window an eval function!");

    const sendEval = () => {
      this.isolatedEnvironment.window.postMessage({
        "action" : "eval",
        "input"  : evalString,
        "returns" : doesReturn
      }, this.isolatedEnvironment.location);
    };

    if(doesReturn) {
      const response = await new Promise(resolve => {
        const isSameCommand = e => {
          if(e.data?.input == evalString && e.data?.action == "eval") {
            window.removeEventListener("message", isSameCommand);
            resolve(e.data?.result);
          }
        };

        window.addEventListener("message", isSameCommand);

        sendEval();
      });

      return response;
    } else {
      sendEval();
    }
  },
  "ping" : async () => {
    const actionName = "pingPong";
    const send = "ping", expected = "pong";

    const response = await new Promise(resolve => {
      const sendPing = () => this.isolatedEnvironment.window.postMessage({
        "action" : actionName,
        "input" : send,
        "returns" : true
      }, this.isolatedEnvironment.location);

      const isPong = e => {
        if(e.data?.action == actionName && e.data?.result == expected) {
          clearInterval(pingLoop);
          window.removeEventListener("message", isPong);
          resolve();
        }
      };

      window.addEventListener("message", isPong);

      const pingLoop = setInterval(sendPing, 100);
    });

    return response;
  }
};

this.isolatedEnvironment.window = window.open(this.isolatedEnvironment.location, await this.#createDocument(), `width=${this.settings.window.size.width}, height=${this.settings.window.size.height}, ${pos}`);

if (!this.isolatedEnvironment.window) {
  this.settings.messages.blockedPopups();
  return;
}

// Ping the isolated window until a "Pong" response
await this.isolatedEnvironment.ping();

await this.isolatedEnvironment.eval(`
  window.resizeTo(
    window.outerWidth,
    ${this.settings.window.size.dynamicSize}
      ? window.document.body.offsetHeight + (window.outerHeight - window.innerHeight)
      : window.outerHeight
  );
`, false);
