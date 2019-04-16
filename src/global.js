import { message } from "antd";
// user BrowserHistory
import "moment/locale/zh-cn";
import moment from "moment";
import FastClick from "fastclick";

moment.locale("zh-cn");

message.config({
  duration: 3,
  maxCount: 3
});


FastClick.attach(document.body);
