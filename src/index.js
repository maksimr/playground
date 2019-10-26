import { EventEmitter } from 'events';

function main() {
  class BrowserChannel {
    static create(channelId) {
      return new BrowserChannel(channelId);
    }

    constructor(channelId) {
      this.id = channelId;
      this.target = new EventEmitter();
    }

    connect() {
      const sse = this.sse = new EventSource(`/api/channel?id=${this.id}`);
      sse.addEventListener('message', (message) => {
        const rawEvent = JSON.parse(message.data);
        const event = new Event(rawEvent.event);
        event.date = rawEvent.date;
        event.data = rawEvent.data;
        this.dispatchEvent(event);
      });
    }

    disconnect() {
      if (this.sse) {
        this.sse.close();
        this.sse = null;
      }
    }

    on(type, callback) {
      this.target.addListener(type, callback);
    }

    off(type, callback) {
      this.target.removeListener(type, callback);
    }

    dispatchEvent(event) {
      this.target.emit(event.type, event);
    }
  }


  const channel = BrowserChannel.create('AAA');
  channel.connect();
  channel.on('foo', (event) => {
    updateText(`${event.date} - ${event.data.v8}`);
  });


  function updateText(text) {
    document.getElementById('app').innerText = text;
  }
}


main();