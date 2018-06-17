import * as React from "react";
import * as ReactDOM from "react-dom";
import Popup from "./Popup";
import "./Popup.scss";

document.title = chrome.i18n.getMessage("name");

// 发送一个copy消息出去
function sendCopy(tab) {
  chrome.tabs.sendMessage(tab.id, { action: "copy" });
}

let tab = null;

// 当前打开的选项卡
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  tab = tabs.find(item => item.active);
  sendCopy(tab);
});

/** 监听 contentScripts 页消息 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const pageInfo = request.type === "FROM_PAGE" ? request.text : "";
  return tab && ReactDOM.render(
    <Popup
      tab={tab}
      handleClick={sendCopy.bind(this, tab)}
      pageInfo={pageInfo}
    />,
    document.getElementById("popup")
  );
});
