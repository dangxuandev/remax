'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Platform = require('../npm/remax/esm/Platform.js');
require('../npm/remax/esm/render.js');
var React = require('react');
require('../npm/remax/esm/createAppConfig.js');
require('../npm/remax/esm/createHostComponent.js');
require('../npm/remax/esm/createPageConfig.js');
require('../npm/remax/esm/index.js');
var index$1 = require('../npm/remax/npm/remax-alipay/esm/hostComponents/index.js');
var index$2 = require('../npm/remax/npm/remax-wechat/esm/hostComponents/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/View/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Input/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Textarea/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Video/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Swiper/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/ScrollView/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/SwiperItem/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Icon/index.js');
var index$b = require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Text/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/RichText/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Progress/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Button/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/CheckboxGroup/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Checkbox/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Form/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Label/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Picker/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/PickerView/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/PickerViewColumn/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/RadioGroup/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Radio/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Slider/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Switch/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Navigator/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Image/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/Canvas/index.js');
require('../npm/remax/npm/remax-toutiao/esm/hostComponents/WebView/index.js');
require('../npm/remax/npm/remax-toutiao/esm/api/index.js');

function Text() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  switch (Platform.default.current) {
    case 'alipay':
      return React.createElement(index$1.Text, props);

    case 'toutiao':
      return React.createElement(index$b.default, props);

    case 'wechat':
    default:
      return React.createElement(index$2.Text, props);
  }
}

exports.default = Text;
