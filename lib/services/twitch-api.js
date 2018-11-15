const axios = require('axios').default;
const moment = require('moment');
const _ = require('lodash');

class TwitchApi {
  constructor(config) {
    this.clientSecret = config.clientSecret;
    this.clientId = config.clientId;
    this.accessToken = config.accessToken;
    this.channelId = config.channelId || 18074328;
    this.wasLiveTimestamp = null;

    setInterval(() => {
      this.getChannelStatus().then().catch();
    }, 60000);
  }

  getChannelStatus() {
    return axios.get('https://api.twitch.tv/kraken/streams/destiny', {
      headers:
        {
          'Client-ID': this.clientId,
        },
    }).then((data) => {
      const date = _.get(data, 'data.stream.created_at', null);
      const viewers = _.get(data, 'data.stream.viewers', 'Unknown');
      if (date === null) {
        if (this.wasLiveTimestamp !== null) {
          return `Stream was last online ${moment(this.wasLiveTimestamp).fromNow()}`;
        }
        return 'Stream is offline. (Time since last streaming coming soon, sorry!)';
      }
      this.wasLiveTimestamp = moment().unix();
      return `Viewers: ${viewers}. Stream live as of ${moment(date, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()}`;
    });
  }
}

module.exports = TwitchApi;
