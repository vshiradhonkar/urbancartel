
import React, { useEffect } from 'react';
import '../App.css';

const BotpressChat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    document.body.appendChild(script);

    const configScript = document.createElement('script');
    configScript.src = 'https://mediafiles.botpress.cloud/43c546c8-dd42-4804-b3f9-a24fd39d23ff/webchat/config.js';
    configScript.defer = true;
    document.body.appendChild(configScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(configScript);
    };
  }, []);

  return <div id="botpress-webchat" className="urban-cartel-chat-window" />;
};

export default BotpressChat;