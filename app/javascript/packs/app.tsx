import React from "react";
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Channel from './types/Channel'
import ChannelList from './components/ChannelList';
import ChannelPlayer from './components/ChannelPlayer';
import PageViewTracker from './components/PageViewTracker'
import { isIOS } from 'react-device-detect'

import { library } from '@fortawesome/fontawesome-svg-core'; //fontawesomeのコアファイル
import { fab } from '@fortawesome/free-brands-svg-icons'; //fontawesomeのbrandアイコンのインポート
import { fas } from '@fortawesome/free-solid-svg-icons'; //fontawesomeのsolidアイコンのインポート
import { far } from '@fortawesome/free-regular-svg-icons'; //fontawesomeのregularアイコンのインポート

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  }),
);

const App = () => {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    // チャンネル一覧を取得
    const fetchData = async () => {
      const res = await fetch('/api/v1/channels', {credentials: 'same-origin'});
      const response = await res.json() as Array<any>;

      const channels = response.map(channel => {
        if (channel.contentType === null) { return null; }
        return new Channel(
          channel.name,         // A.ch
          channel.channelId,    // 0C1A6C6959CEB2A8BF9598BC9185FF32
          channel.tracker,      // 14.13.42.64:5184
          channel.contactUrl,   // http://jbbs.shitaraba.net/bbs/read.cgi/game/52685/1567349533/
          channel.genre,        // PS4
          channel.description,  // モンスターハンターワールド：アイスボーン MHWIB - &lt;Open&gt;
          channel.listeners,    // -1
          channel.relays,       // -1
          channel.bitrate,      // 1500
          channel.contentType,  // FLV
          channel.album,
          channel.comment,
          channel.creator,
          channel.trackTitle,
          channel.trackUrl,
          channel.uptime,
          channel.yellowPage
        );
      });
      setChannels(channels);
    };

    fetchData();

    //fontawesomeを読み込み
    library.add(fab, fas, far);
  }, []);

  const classes = useStyles({});

  return (
    <BrowserRouter>
      <PageViewTracker>
        <AppBar position="fixed" color="inherit" >
          <Toolbar>
            <Link to='/'>
              <Logo src='/images/pecalive.png' />
            </Link>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path='/' render={(props) => <ChannelList channels={channels} />} />
            {/*<Route path='/channels/:streamId' render={(props) => { return <ChannelPlayer streamId={props.match.params.streamId} channels={channels} isHls={isIOS} local={false} />}} />*/}
            <Route path='/channels/:streamId' render={(props) => { return <ChannelPlayer streamId={props.match.params.streamId} channels={channels} isHls={isIOS} local={false} />}} />
            <Route path='/hls/:streamId' render={(props) => { return <ChannelPlayer streamId={props.match.params.streamId} channels={channels} isHls={true} local={false} />}} />
            <Route path='/local/:streamId' render={(props) => { return <ChannelPlayer streamId={props.match.params.streamId} channels={channels} isHls={true} local={true} />}} />
          </Switch>
        </main>
      </PageViewTracker>
    </BrowserRouter>
  )
};

const Logo = styled.img`
  height: 30px;
  padding-top: 3px;
  padding-bottom: 3px;
`;

export default App;
