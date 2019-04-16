/** 样式 */
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
    md: {span: 8},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 10},
    md: {span: 10},
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: {span: 2, offset: 11},
    sm: {span: 2, offset: 11},
  },
};


/** 消息 */
const message = {

  article_createType_ADMIN: '管理员',
  article_createType_MEMBER: '会员',

  article_state_NORMAL: '正常',
  article_state_AUDITING: '审核中',

  paymentMethod_paymentType_ONLINE: '在线支付',
  paymentMethod_paymentType_OFFLINE: '线下支付',

  paymentMethod_collectType_DELIVERY_AGAINST_PAYMENT: '款到发货',
  paymentMethod_collectType_CASH_ON_DELIVERY: '货到付款',


};

/** 默认分页信息 */
const defaultPagination = {
  current: 1, // 当前页面
  size: 10, // 每页显示多少
};


export default {
  formItemLayout,
  submitFormLayout,
  message,
  defaultPagination,
};
